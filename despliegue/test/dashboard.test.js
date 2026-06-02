jest.mock("../models/dashboard.model", () => ({
  getResumen: jest.fn().mockResolvedValue({
    usuarios: 10,
    alertas: 5,
    mensajes: 3
  })
}));
const dashboardController = require("../controllers/dashboard.controller");
describe("Dashboard Controller", () => {
  test("renderiza dashboard", async () => {
    const req = {
      session: {}
    };
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await dashboardController.renderDashboard(req, res);

    expect(res.render).toHaveBeenCalled();
  });
});
