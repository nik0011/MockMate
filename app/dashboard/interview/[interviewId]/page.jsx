"use client";

import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db"; // Ensure this is the correct import for your database
import { eq } from "drizzle-orm"; // Ensure you import the `eq` operator
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { use } from "react";

function Interview({ params}) {
  const unwrappedParams = React.use(params);
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log("Interview ID:", params.interviewId);
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, unwrappedParams.interviewId));

      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="my-10 flex flex-col items-center">
      <h2 className="font-bold text-3xl mb-5 text-center text-primary">
        Let's Get Started!
      </h2>

      {/* Flex Layout for Info + Lightbulb and Webcam */}
      <div className="flex flex-col lg:flex-row justify-between w-full max-w-6xl gap-40">
        {/* Info and Lightbulb Section - Left */}
        <div className="w-full lg:w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          {/* Job Details */}
          <h2 className="text-lg font-bold text-gray-800">
            <span className="text-blue-600">Job Role/Job Position:</span>
          </h2>
          <p className="text-gray-700 mt-2 text-base">
            {interviewData?.jobPosition || "Not Available"}
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-4">
            <span className="text-blue-600">Job Description:</span>
          </h2>
          <p className="text-gray-700 mt-2 text-base">
            {interviewData?.jobDescription || "Not Available"}
          </p>

          <h2 className="text-lg font-bold text-gray-800 mt-4">
            <span className="text-blue-600">Years of Experience:</span>
          </h2>
          <p className="text-gray-700 mt-2 text-base">
            {interviewData?.jobExperience || "Not Available"}
          </p>

          {/* Lightbulb Section */}
          <div className="p-5 mt-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <Lightbulb className="mr-2" />
            <strong>NOTE:</strong>
            <p className="text-gray-700 text-base">
              Enable Video Web Cam and Microphone to Start your AI Generated
              Mock Interview. It has 5 questions that you can answer, and at the
              end, you will get a report based on your answers.
            </p>
          </div>
        </div>

        {/* Webcam Section - Right */}
        <div className="flex flex-col items-center justify-center lg:w-1/2">
          <div className="flex justify-center items-center mb-4">
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{
                  height: 300,
                  width: 300,
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            ) : (
              <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-secondary w-64 h-64 flex justify-center items-center shadow-md hover:shadow-lg transition-all">
                <WebcamIcon className="h-20 w-20 text-gray-700" />
              </div>
            )}
          </div>

          {/* Enable Webcam Button - Below Webcam */}
          <button
            onClick={() => setWebCamEnabled(true)}
            className="mt-4 w-full bg-gray-200 text-gray-800 px-2 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-all"
          >
            Enable Webcam
          </button>

          {/* Start Interview Button - Aligned Right */}
          <div className="mt-4 w-full flex justify-end">
            <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
            <button
              onClick={() => console.log("Start Interview Clicked")}
              className="px-4 py-3 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all"
            >
              Start Interview
            </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
