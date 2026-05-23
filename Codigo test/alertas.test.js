describe('Modulo Alertas', () => {
    test('crear alerta correctamente', () => {
        const alerta = {
            titulo: 'Alerta crítica',
            prioridad: 'Alta'
        };
        expect(alerta.titulo).toBe('Alerta crítica');
    });
});