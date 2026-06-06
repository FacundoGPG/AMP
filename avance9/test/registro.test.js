describe('Modulo de registro', () =>{
    test('Registro con datos correctos', ()=>{
        const nuevoUsuario ={
            nombre: 'David',
            apellido: 'Robles',
            correo: 'demo123@gmail.com',
            contraseña:'12345'
        };
        expect(nuevoUsuario.nombre).toBe('David');
        expect(nuevoUsuario.apellido).toBe('Robles');
        expect(nuevoUsuario.correo).toBe('demo123@gmail.com');
        expect(nuevoUsuario.contraseña).toBe('12345');
    });
});