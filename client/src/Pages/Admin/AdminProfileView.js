import React from 'react'
import AdminMenuBar from '../../Components/Admin/AdminMenuBar'
import AdminHeader from '../../Components/Admin/AdminHeader'
import ProfileSettings from '../../Components/Admin/ProfileSettings'

export default function AdminProfileView() {
  return (
    <div>
        <div className='flex'>
          <div><AdminMenuBar/></div>  
          <div className='flex flex-col w-full'>
            <div><AdminHeader/></div>
            <div className=' justify-center mt-20 '><ProfileSettings/></div>
          </div>
         
         
            
          
        </div>
    </div>
  )
}
