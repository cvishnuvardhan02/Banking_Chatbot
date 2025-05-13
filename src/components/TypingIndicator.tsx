
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
    </div>
  );
};

export default TypingIndicator;
