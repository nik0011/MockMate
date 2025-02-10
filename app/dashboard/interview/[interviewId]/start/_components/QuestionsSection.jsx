import { index } from 'drizzle-orm/mysql-core'
import { Lightbulb } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestions,activeQuestionIndex}) {
  return mockInterviewQuestions&&(
    <div className='p-5 border rounded-lg my-10'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
      {mockInterviewQuestions&&mockInterviewQuestions.map((question,index)=>(
        <h2 className={`p-2  rounded-full
        text-xs md:text-sm text-center cursor-pointer
      ${activeQuestionIndex==index&&`bg-blue-600 text-white`}`}
        >Question #{index+1}</h2>
      ))}
      </div> 
      <h2 className='my-5 text-sm md:text-lg'>{mockInterviewQuestions[activeQuestionIndex]?.Question}</h2>
      
      <div className='border rounded-lg p-5 bg-blue-100 my-5'>
        <h2 className='flex gap-2 items-center text-blue-700'>
          <Lightbulb/>
          <strong>Note:</strong>
        </h2>
        <h2 className=' text-sm text-blue-400 my-2 '>Click on Record Answer when you want to answer the question. At
the end of interview we will give you the feedback along with
correct answer for each of question and your answer to comapre
it.</h2>
      </div>
    </div>
  )
}

export default QuestionsSection