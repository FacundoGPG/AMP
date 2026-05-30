const alertasController = require("../controllers/alertas.controller");
describe("Alertas Controller", () => {
  test("renderAlertas renderiza la vista correcta", () => {
    const req = {};
    const res = {
      render: jest.fn()
    };
    alertasController.renderAlertas(req, res);
    expect(res.render).toHaveBeenCalledWith(
      "alertas",
      {
        pageTitle: "Alertas - Beta 1"
      }
    );
  });
});