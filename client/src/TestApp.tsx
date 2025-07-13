import React from 'react';

function TestApp() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center">TechGPT - Test Page</h1>
      <p className="text-center mt-4">This is a test page to verify React is working</p>
      <div className="mt-8 text-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default TestApp;