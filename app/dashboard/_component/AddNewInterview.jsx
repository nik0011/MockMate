"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const router=useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Input Data:", jobPosition, jobDescription, jobExperience);

      // Construct AI prompt
      const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. Based on this information, please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT} interview questions with answers in JSON format. Provide "Question" and "Answer" as fields in the JSON.`;

      // Fetch response from AI
      const result = await chatSession.sendMessage(InputPrompt);
      const rawResponse = await result.response.text();
      console.log("Raw Response:", rawResponse);

      // Parse and clean JSON response
      const MockJsonResp = rawResponse.replace("```json", "").replace("```", "");
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(MockJsonResp);
        console.log("Parsed JSON Response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw new Error("Invalid JSON response from AI.");
      }

      // Validate parsed response
      if (!parsedResponse || !Array.isArray(parsedResponse)) {
        throw new Error("Invalid or empty JSON response.");
      }

      // Insert data into the database
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedResponse), // Ensure JSON is stored as a string
          jobPosition,
          jobDescription,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"), // Standardized timestamp format
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Database Insertion Successful. Inserted ID:", resp);
      console.log("ID:", resp);
      if (resp) {
        setOpenDailog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
      }

      alert("Interview data saved successfully!");
    } catch (error) {
      console.error("Error generating interview questions or saving data:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="p-10 border rounded-lg bg-secondary 
            hover:scale-105 hover:shadow-md cursor-pointer transition-all"
          >
            <h2 className="font-bold text-lg text-center">+ Add New</h2>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job description,
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label className="font-semibold">Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      value={jobPosition}
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label className="font-semibold">
                      Job Description / Tech Stack
                    </label>
                    <Textarea
                      placeholder="Ex. React, Node.js, MySQL"
                      value={jobDescription}
                      onChange={(event) =>
                        setJobDescription(event.target.value)
                      }
                    />
                  </div>
                  <div className="my-3">
                    <label className="font-semibold">Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      value={jobExperience}
                      onChange={(event) =>
                        setJobExperience(event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <button type="button" onClick={() => setOpenDailog(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 p-2 rounded-sm text-gray-50"
                    disabled={loading}
                    aria-label="Start Interview"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin" />
                        <span>Generating from AI...</span>
                      </div>
                    ) : (
                      "Start Interview"
                    )}
                  </button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
