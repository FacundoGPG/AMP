const chismeController = require("../controllers/chisme.controller");
describe("Chisme Controller", () => {
  test("el controller carga correctamente", () => {
    expect(chismeController).toBeDefined();
  });
});