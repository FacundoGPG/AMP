const dashboardController = require("../controllers/dashboard.controller");
describe("Dashboard Controller", () => {
    test("redirige si no existe sesión", () => {
        const req = {
            session: {}
        };
        const res = {
            redirect: jest.fn(),
            render: jest.fn()
        };
        dashboardController.renderDashboard(req, res);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });
    test("renderiza dashboard si hay usuario", () => {
        const req = {
            session: {
                usuario: {
                    nombre: "David"
                }
            }
        };
        const res = {
            redirect: jest.fn(),
            render: jest.fn()
        };
        dashboardController.renderDashboard(req, res);
        expect(res.render).toHaveBeenCalled();
    });
});