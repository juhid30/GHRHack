import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="loading-dots flex">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
