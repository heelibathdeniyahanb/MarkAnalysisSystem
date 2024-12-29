import React from 'react'
import UserList from '../../Components/Admin/UserList'
import AdminMenuBar from '../../Components/Admin/AdminMenuBar'
import AdminHeader from '../../Components/Admin/AdminHeader'

export default function UserListPage() {
  return (
    <div className='flex'>
     <div><AdminMenuBar/></div> 
     <div> <AdminHeader/></div>
        <UserList/>
    </div>
  )
}
