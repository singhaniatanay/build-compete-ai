import React from "react";
import ChallengeForm from "@/components/company/ChallengeForm";

const CreateChallenge = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Challenge</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ChallengeForm />
      </div>
    </div>
  );
};

export default CreateChallenge; 