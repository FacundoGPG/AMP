const buzonController = require("../controllers/buzon.controller");
describe("Buzón", ()=>{
    test("Módulo cargado", ()=>{
        expect(buzonController).toBeDefined();
    });
});