import React from 'react'

function Historial() {
  return (
    <div className='flex flex-col h-full w-full p-16'>
    <div className='font-bold text-5xl mb-2'>
      Historial
    </div>

    <div className='text-xl mb-12'>
      Historial de Prestamos
    </div>
    
    <div className='h-full w-full'>

    <div class="overflow-hidden rounded-lg shadow-md">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Nombre</th>
            <th class="py-2 px-4 border-b">Edad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 px-4 border-b">Ana</td>
            <td class="py-2 px-4 border-b">23</td>
          </tr>
          <tr>
            <td class="py-2 px-4">Luis</td>
            <td class="py-2 px-4">30</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    </div>
    </div>
  )
}

export default Historial