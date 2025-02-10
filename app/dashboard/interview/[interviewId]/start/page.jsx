"use client";

import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db"; // Ensure this is the correct import for your database
import { eq } from "drizzle-orm"; // Ensure you import the `eq` operator
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

function StartInterview({ params }) {
  const unwrappedParams = React.use(params);
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
  const [activeQuestionIndex,setActiveQuestionindex]=useState(0);

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      // Fetch interview details from the database
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, unwrappedParams.interviewId));

      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log("Interview Questions:", jsonMockResp); // Log the questions to the console
        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
      } else {
        console.error("No interview data found for the given ID.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Questions Section */}
      <QuestionsSection 
        mockInterviewQuestions={mockInterviewQuestions} 
        activeQuestionIndex={activeQuestionIndex} 
      />
  
      {/* Video/Audio Recording Section */}
      <RecordAnswerSection 
      mockInterviewQuestions={mockInterviewQuestions} 
      activeQuestionIndex={activeQuestionIndex} 
      interviewData={interviewData}
      />
    </div>
  );
}
  export default StartInterview;
  
