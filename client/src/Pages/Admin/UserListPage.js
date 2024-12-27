import React from 'react'
import UserList from '../../Components/Admin/UserList'
import AdminMenuBar from '../../Components/Admin/AdminMenuBar'

export default function UserListPage() {
  return (
    <div className='flex'>
      <AdminMenuBar/>
        <UserList/>
    </div>
  )
}
