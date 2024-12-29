import React from 'react'
import TestAnalysis from '../../Components/Admin/TestAnalyst'
import AdminMenuBar from '../../Components/Admin/AdminMenuBar'

export default function AdminAnalysisPage() {
  return (
    <div className='flex'>
        <div><AdminMenuBar/></div>
        <div><TestAnalysis/></div>
    </div>
  )
}
