import React from 'react'

function Prestamos() {
  return (
    <div className='flex flex-col h-full w-full p-16'>
    <div className='font-bold text-5xl mb-2'>
      Préstamos
    </div>

    <div className='text-xl mb-12'>
      Listado de Préstamos en Activo
    </div>
    <input
         className='bg-gray-50 w-72 h-6 p-6 mb-4 self-end rounded-lg shadow-md'
          type="text" 
          placeholder='Buscar'
    />
    
    <div className='h-full w-full'>

    <div class="overflow-hidden rounded-lg shadow-md">
      <table class="min-w-full bg-gray-50">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ISBN</th>
            <th class="py-2 px-4 border-b">TItulo</th>
            <th class="py-2 px-4 border-b">Autor</th>
            <th class="py-2 px-4 border-b">Edicion</th>
            <th class="py-2 px-4 border-b">     </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
            <td class="py-2 px-4 border-b">
              <button className='h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]'>Prestamo</button>
            </td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>

          <tr>
            <td class="py-2 px-4 border-b">9780875847405</td>
            <td class="py-2 px-4 border-b">DESARROLLO HUMANO</td>
            <td class="py-2 px-4 border-b">DIANE E. PAPALIA GABRIELA MARTORELL</td>
            <td class="py-2 px-4 border-b">DECIMOTERCERA EDICIÓN</td>
          </tr>
           
        </tbody>
      </table>
    </div>
    
    </div>
    </div>
  )
}

export default Prestamos