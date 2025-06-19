import { Command, SearchIcon } from 'lucide-react'
// import React from 'react'

export default function TopBar() {
  return (
    <div className='flex-1 flex flex-row items-center justify-between py-2'>
      <div className='flex-1'>
        <h1 className='font-bold text-gray-800'>Admin Dashboard</h1>
      </div>
      <div className='flex flex-row items-center gap-x-3'>
        <div className='flex flex-row items-center py-1 px-4 justify-between border border-gray-300 bg-white rounded-md  '>
            <SearchIcon color='gray' className='' />
            <input type="text" placeholder='Search' className='outline-none flex-1' />
            <Command color='gray' />
        </div>
        
      </div>
    </div>
  )
}
