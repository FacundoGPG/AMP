const usuariosModel = require("../models/usuarios.model");
describe("Usuarios Model", () => {
    test("ObtenerUsuarios regresa 4 usuarios", () => {
        const usuarios = usuariosModel.ObtenerUsuarios();
        expect(usuarios.length).toBe(4);
    });
    test("ObtenerUsuariosActivos solo regresa usuarios activos", () => {
        const usuarios = usuariosModel.ObtenerUsuariosActivos();
        expect(usuarios.length).toBe(3);
        usuarios.forEach(usuario => {
            expect(usuario.active).toBe(true);
        });
    });
});