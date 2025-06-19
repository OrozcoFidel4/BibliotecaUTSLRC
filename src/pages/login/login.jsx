import React from 'react';

const Login = () => {
  console.log('Login');

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      
      <div className='h-94 w-94 bg-[#537473] flex flex-col items-center justify-center rounded-xl shadow-xl'>
        <h1 className="text-white text-2xl font-semibold mb-4">Iniciar Sesion</h1>
        <input className='bg-gray-100 w-72 h-12 p-6 m-2 rounded-lg' type="email" placeholder='Correo Electronico'/>
        <input className='bg-gray-100 w-72 h-12 p-6 m-2 rounded-lg' type="password" placeholder='Contraseña' />
      </div>
    </div>
  );
};

export default Login;