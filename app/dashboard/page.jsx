import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_component/AddNewInterview'
import Interviewlist from './_component/Interviewlist'

function Dashboard() {
  return (
    <div>
      <h2 className='fond-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview/>
      </div>
      {/* Previous Interview List */}
      <Interviewlist/>
    </div>
    
  )
}

export default Dashboard