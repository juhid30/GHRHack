import { useState } from "react";

export default function ResumeViewer() {
  const [selectedTab, setSelectedTab] = useState("fresher");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const resumeTemplates = {
    fresher: "This is a Fresher Resume Template.",
    intermediate: "This is an Intermediate Resume Template.",
    pro: "This is a Pro Resume Template.",
  };

  const handleFileUpload = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile || !jobRole) return;

    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("job_role", jobRole);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Resume Template Viewer</h1>

      <div className="flex space-x-4 mb-4">
        {Object.keys(resumeTemplates).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md ${
              selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="border p-4 rounded-md shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => window.open(`/path-to-resume-${num}.pdf`, "_blank")}
          >
            Resume Template {num}
          </div>
        ))}
      </div>

      <div className="border p-4 w-full max-w-lg rounded-md shadow-md">
        {resumeTemplates[selectedTab]}
      </div>

      <button
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        Analyze Resume
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-2/3 flex space-x-4 relative">
            <div className="w-1/2">
              <h2 className="text-lg font-bold mb-2">Enter Job Role</h2>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                placeholder="Job Role (e.g., Web Developer)"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
              <input type="file" onChange={handleFileUpload} className="mb-4" />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAnalyzeResume}
              >
                Submit for Analysis
              </button>
            </div>
            <div className="w-1/2 border-l pl-4">
              <h2 className="text-lg font-bold mb-2">Analysis Result</h2>
              {analysisResult ? (
                <div className="text-sm bg-gray-100 p-4 rounded space-y-4">
                  <h3 className="text-md font-semibold">Profile</h3>
                  <p>
                    <strong>Name:</strong> {analysisResult.details.profile.name}
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    {analysisResult.details.profile.contact_no}
                  </p>
                  <p>
                    <strong>LinkedIn:</strong>{" "}
                    <a
                      href={analysisResult.details.profile.linkedin_link}
                      className="text-blue-500"
                      target="_blank"
                    >
                      Profile Link
                    </a>
                  </p>

                  <h3 className="text-md font-semibold">Resume Evaluation</h3>
                  <p>
                    <strong>Leadership & Teamwork:</strong>{" "}
                    {
                      analysisResult.response.resume_evaluation
                        .key_qualifications_and_experience
                        .leadership_and_teamwork
                    }
                  </p>
                  <p>
                    <strong>Relevant Expertise:</strong>{" "}
                    {
                      analysisResult.response.resume_evaluation
                        .key_qualifications_and_experience.relevant_expertise
                    }
                  </p>

                  <h3 className="text-md font-semibold">Technical Skills</h3>
                  <ul className="list-disc pl-5">
                    {analysisResult.response.resume_evaluation.key_qualifications_and_experience.technical_skills.map(
                      (skill, index) => (
                        <li key={index}>{skill}</li>
                      )
                    )}
                  </ul>

                  <h3 className="text-md font-semibold">Project Experience</h3>
                  <ul className="list-disc pl-5">
                    {analysisResult.response.resume_evaluation.key_qualifications_and_experience.project_experience.map(
                      (project, index) => (
                        <li key={index}>{project}</li>
                      )
                    )}
                  </ul>

                  <h3 className="text-md font-semibold">Rating</h3>
                  <p>
                    <strong>Score:</strong>{" "}
                    {analysisResult.response.resume_evaluation.rating.score}/
                    {analysisResult.response.resume_evaluation.rating.max_score}
                  </p>
                  <p>
                    <strong>Overall Alignment:</strong>{" "}
                    {
                      analysisResult.response.resume_evaluation.rating
                        .overall_alignment
                    }
                  </p>
                </div>
              ) : (
                <p>No analysis yet.</p>
              )}
            </div>
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
