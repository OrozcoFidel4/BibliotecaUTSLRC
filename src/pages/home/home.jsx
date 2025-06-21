import React from 'react'

function Home() {
  return (
    <div className='h-full w-full px-16'>
    <div className="flex flex-col pt-6">
       <div className="font-bold text-5xl mb-2">Inicio</div>
        <div className="text-xl mb-12">Bienvenido, Jonh Doe</div>
    </div>

    <div className='w-full flex flex-row gap-4'>
          <button className='h-64 flex-1 bg-[#88073f] text-gray-100 rounded-xl shadow-xl hover:bg-[#480422] items-'>Prestamos</button>
          <button className='h-64 flex-1 bg-[#88073f] text-gray-100 rounded-xl shadow-xl hover:bg-[#480422] items-'>Prestamos</button>

    </div>

    </div>
  )
}

export default Home