import React from "react";

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to the Frontend!
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        This is a generic website using React, TypeScript, and Tailwind CSS.
      </p>
    </div>
  );
};

export default App;
