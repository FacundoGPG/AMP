const reportesController = require("../controllers/reportes.controller");
describe("Reportes Controller", () => {
  test("el controller carga correctamente", () => {
    expect(reportesController).toBeDefined();
  });
});