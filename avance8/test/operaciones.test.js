const operacionesController = require("../controllers/operations.controller");
describe("Operaciones Controller", () => {
  test("el controller carga correctamente", () => {
    expect(operacionesController).toBeDefined();
  });
});