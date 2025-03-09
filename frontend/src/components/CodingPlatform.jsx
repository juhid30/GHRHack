import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";
import Navbar from "./Navbar"; // Added Navbar import

const CodingPlatform = () => {
  return (
    <>
      <Navbar /> {/* Added Navbar */}
      <div className="h-[100vh] w-full bg-white pt-16">
        {/* Light background with top padding to avoid overlap */}
        <div className="flex h-[90%]">
          <div className="p-8 flex flex-col">{/* <Sidebar /> */}</div>
          <div className="w-[92.5%] p-5">
            <CodeEditor />
          </div>
        </div>
      </div>
    </>
  );
};

export default CodingPlatform;
