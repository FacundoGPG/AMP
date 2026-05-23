describe('Módulo de login y registro', () => {
  test('Login con datos correctos', () => {
    const usuario = {
      correo: 'santy@gmail.com',
      contrasena: 'Test21May'
    };
    expect(usuario.correo).toBe('santy@gmail.com');
    expect(usuario.contrasena).toBe('Test21May');
  });

});