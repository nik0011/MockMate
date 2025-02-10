"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema"; // Import the correct table
import moment from "moment";

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer((prevAns) => prevAns + " " + results.map((res) => res.transcript).join(" "));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 5) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt =
      `Questions: ${mockInterviewQuestions[activeQuestionIndex]?.Question}, User Answer: ${userAnswer}.` +
      "Please provide a rating and feedback (3-5 lines) for improvement in JSON format with 'rating' and 'feedback' fields.";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawResponse = result.response.text();
      const jsonResponse = JSON.parse(rawResponse.replace("```json", "").replace("```", "")); // Parse response properly

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestions[activeQuestionIndex]?.Question,
        correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: jsonResponse?.feedback,
        rating: jsonResponse?.rating,
        userEmail: user.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      if (resp) {
        toast("User Answer recorded successfully");
      }
      setUserAnswer("");
    } catch (error) {
      console.error("DB Insert Error:", error);
      toast("Failed to save answer. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Webcam Section */}
      <div className="my-10 relative flex justify-center items-center bg-gray-300 rounded-lg w-full max-w-md aspect-video overflow-hidden">
        <Webcam className="w-full h-full object-cover rounded-lg transform scale-x-[-1]" />
        <Image src={"/webcam.png"} width={120} height={120} className="absolute" alt="Webcam overlay icon" />
      </div>

      {/* Recording Controls */}
      <Button disabled={loading} variant="outline" className="my-5" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="text-red-500 flex gap-2">
            <Mic /> Recording...
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      <br />
      {/* Show User Answer */}
      <Button className="bg-blue-600" onClick={() => console.log(userAnswer)}>
        Show User Answer
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
