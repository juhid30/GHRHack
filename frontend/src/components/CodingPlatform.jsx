import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";

const CodingPlatform = () => {
  return (
    <>
      <div className="h-[100vh] w-[100%] bg-white">
        {" "}
        {/* Light background */}
        <div className="flex h-[90%]">
          <div className="p-8 flex flex-col ">{/* <Sidebar /> */}</div>
          <div className=" w-[92.5%] p-5">
            <CodeEditor />
          </div>
        </div>
      </div>
    </>
  );
};

export default CodingPlatform;
