const clientesController = require("../controllers/clientes.controller");
describe("Clientes", ()=>{
    test("Módulo cargado", ()=>{
        expect(clientesController).toBeDefined();
    });
});