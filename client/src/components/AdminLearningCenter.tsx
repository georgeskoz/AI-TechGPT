import React from "react";

type AdminLearningCenterProps = {
  activeTab?: string;
};

export default function AdminLearningCenter({ activeTab }: AdminLearningCenterProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Learning Center</h2>
      <p className="text-gray-600">
        Admin learning center module placeholder.
        {activeTab ? ` (tab: ${activeTab})` : ""}
      </p>
      <div className="p-4 border rounded-md bg-gray-50 text-sm text-gray-700">
        This minimal component was restored to satisfy imports. You can expand it later.
      </div>
    </div>
  );
}


