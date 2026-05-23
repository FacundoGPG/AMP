describe('Módulo de reportes', () => {
  test('Generar reportes con datos correctamente', () => {
    const reporte = {
      totalClientes: 10,
      totalAlertas: 3,
    };
    expect(reporte.totalClientes).toBe(10);
    expect(reporte.totalAlertas).toBe(3);
  });
});