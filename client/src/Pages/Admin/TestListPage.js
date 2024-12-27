import React from 'react'
import TestList from '../../Components/Admin/TestList'
import AdminMenuBar from '../../Components/Admin/AdminMenuBar'

export default function TestListPage() {
  return (
    <div className='flex'>
      <AdminMenuBar/>
        <TestList/>
    </div>
  )
}
