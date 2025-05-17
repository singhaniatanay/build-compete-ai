import React from "react";
import ChallengeForm from "@/components/company/ChallengeForm";

const EditChallenge = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Challenge</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ChallengeForm isEditing={true} />
      </div>
    </div>
  );
};

export default EditChallenge; 