import React from 'react'
import TestList from '../../Components/Admin/TestList'
import AdminMenuBar from '../../Components/Admin/AdminMenuBar'
import AdminHeader from '../../Components/Admin/AdminHeader'

export default function TestListPage() {
  return (
    <div className='flex'>
    <div><AdminMenuBar/></div>  
    <div><AdminHeader/></div>
        <TestList/>
    </div>
  )
}
