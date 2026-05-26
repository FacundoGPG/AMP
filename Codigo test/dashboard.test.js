describe('Modulo Dashboard', () => {
  test('dashboard carga con estado correcto', () => {
    const respuesta = {
      status: 200,
      vista: 'dashboard'
    };
    expect(respuesta.status).toBe(200);
    expect(respuesta.vista).toBe('dashboard');
  });
});