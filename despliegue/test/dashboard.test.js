const dashboardController = require("../controllers/dashboard.controller");
const dashboardModel = require("../models/dashboard.model");


  jest.mock("../models/dashboard.model");


  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

// Datos de prueba 
const mockResumen = {
  total_reportes: 6,
  total_alertas: 5,
  operaciones_revision: 1,
  total_clientes: 15,
};

const mockBloqueados = [
  { nombre: "Carlos Medina", fecha_bloqueo: new Date("2026-05-20T11:32:00") },
  { nombre: "Grupo Delta",   fecha_bloqueo: null },
];

const mockAlertas = [
  { motivo: "Coincidencia PEP",        prioridad: "Alta",  fecha_generacion: new Date(), cliente: "Carlos Medina" },
  { motivo: "Múltiples operaciones",   prioridad: "Media", fecha_generacion: new Date(), cliente: "Empresa X" },
  { motivo: "Monto alto inusual",      prioridad: "Baja",  fecha_generacion: new Date(), cliente: "Sin cliente" },
];

const mockOperaciones = [
  { id_cliente: 1, tipo_producto: "Crédito Personal", monto: 50000, estado: "Activo",    vigencia: new Date("2026-06-22") },
  { id_cliente: 2, tipo_producto: "Factoraje",        monto: 120000, estado: "En Proceso", vigencia: new Date("2026-05-27") },
];

// Helpers
const mockReqRes = () => ({
  req: { session: { usuario: { nombre: "Demo" } } },
  res: {
    render:  jest.fn(),
    status:  jest.fn().mockReturnThis(),
    send:    jest.fn(),
  },
});

// Tests
describe("Dashboard Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    dashboardModel.getResumen.mockResolvedValue(mockResumen);
    dashboardModel.getPersonasBloqueadas.mockResolvedValue(mockBloqueados);
    dashboardModel.getAlertasRecientes.mockResolvedValue(mockAlertas);
    dashboardModel.getOperacionesRecientes.mockResolvedValue(mockOperaciones);
  });

  // Render principal
  test("renderiza dashboard con todos los datos", async () => {
    const { req, res } = mockReqRes();
    await dashboardController.renderDashboard(req, res);

    expect(res.render).toHaveBeenCalledWith("dashboard", expect.objectContaining({
      resumen:     mockResumen,
      bloqueados:  mockBloqueados,
      alertas:     mockAlertas,
      operaciones: mockOperaciones,
    }));
  });

  test("pasa tiempoRelativo como función al render", async () => {
    const { req, res } = mockReqRes();
    await dashboardController.renderDashboard(req, res);

    const args = res.render.mock.calls[0][1];
    expect(typeof args.tiempoRelativo).toBe("function");
  });

  // Error de BD
  test("responde 500 si el modelo falla", async () => {
    const { req, res } = mockReqRes();
    dashboardModel.getResumen.mockRejectedValue(new Error("DB caída"));

    await dashboardController.renderDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al cargar el dashboard");
  });

  // tiempoRelativo
  describe("tiempoRelativo()", () => {
    const { tiempoRelativo } = dashboardController;

    test("segundos recientes", () => {
      const fecha = new Date(Date.now() - 30 * 1000);
      expect(tiempoRelativo(fecha)).toBe("Hace 30 seg");
    });

    test("minutos", () => {
      const fecha = new Date(Date.now() - 10 * 60 * 1000);
      expect(tiempoRelativo(fecha)).toBe("Hace 10 min");
    });

    test("horas", () => {
      const fecha = new Date(Date.now() - 3 * 3600 * 1000);
      expect(tiempoRelativo(fecha)).toBe("Hace 3 h");
    });

    test("días", () => {
      const fecha = new Date(Date.now() - 5 * 86400 * 1000);
      expect(tiempoRelativo(fecha)).toBe("Hace 5 días");
    });

    test("meses", () => {
      const fecha = new Date(Date.now() - 2 * 2592000 * 1000);
      expect(tiempoRelativo(fecha)).toBe("Hace 2 meses");
    });

    test("años", () => {
      const fecha = new Date(Date.now() - 2 * 31536000 * 1000);
      expect(tiempoRelativo(fecha)).toBe("Hace 2 años");
    });
  });

  // Datos vacíos
  describe("cuando no hay datos", () => {
    test("bloqueados vacío no rompe el render", async () => {
      const { req, res } = mockReqRes();
      dashboardModel.getPersonasBloqueadas.mockResolvedValue([]);

      await dashboardController.renderDashboard(req, res);
      expect(res.render).toHaveBeenCalled();

      const args = res.render.mock.calls[0][1];
      expect(args.bloqueados).toEqual([]);
    });

    test("alertas vacías no rompe el render", async () => {
      const { req, res } = mockReqRes();
      dashboardModel.getAlertasRecientes.mockResolvedValue([]);

      await dashboardController.renderDashboard(req, res);

      const args = res.render.mock.calls[0][1];
      expect(args.alertas).toEqual([]);
    });

    test("operaciones vacías no rompe el render", async () => {
      const { req, res } = mockReqRes();
      dashboardModel.getOperacionesRecientes.mockResolvedValue([]);

      await dashboardController.renderDashboard(req, res);

      const args = res.render.mock.calls[0][1];
      expect(args.operaciones).toEqual([]);
    });
  });

  // Prioridades de alertas
  describe("prioridades de alertas en mock", () => {
    test("hay alertas con prioridad Alta, Media y Baja", async () => {
      const { req, res } = mockReqRes();
      await dashboardController.renderDashboard(req, res);

      const { alertas } = res.render.mock.calls[0][1];
      const prioridades = alertas.map(a => a.prioridad);

      expect(prioridades).toContain("Alta");
      expect(prioridades).toContain("Media");
      expect(prioridades).toContain("Baja");
    });
  });

});