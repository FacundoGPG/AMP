const historyController = require("../controllers/history.controller");
describe("History Controller", () => {
  test("el controller carga correctamente", () => {
    expect(historyController).toBeDefined();
  });
});