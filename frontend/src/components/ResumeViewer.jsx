import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiUpload,
  FiX,
  FiFileText,
  FiUser,
  FiAward,
  FiCode,
  FiDownload,
  FiEye,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const RESUME_TYPES = {
  fresher: {
    icon: FiUser,
    title: "Fresher",
    description: "Perfect for those just starting their career",
    templates: [
      {
        id: 1,
        name: "Clean Start 1",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/fresher1.pdf?alt=media&token=1080a625-5665-4e68-8e1e-6c36183ab447",
        description:
          "Minimalist design perfect for highlighting academic achievements and internships",
      },
      {
        id: 2,
        name: "Clean Start 2",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/fresher2.pdf?alt=media&token=b2539471-609a-4bf0-9939-9132f326f8b2",
        description: "Modern layout emphasizing skills and project experience",
      },
      {
        id: 3,
        name: "Clean Start 3",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/fresher3.pdf?alt=media&token=cdeb8e52-d6f2-417e-8aa9-6e76baa1aeca",
        description:
          "Classic format ideal for traditional industries and academic positions",
      },
    ],
  },
  intermediate: {
    icon: FiCode,
    title: "Intermediate",
    description: "2-5 years of experience templates",
    templates: [
      {
        id: 4,
        name: "Intern 1",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/medium1.pdf?alt=media&token=8228fb6f-8c2a-4b55-8094-f6497b96876b",
        description:
          "Balanced layout showcasing professional growth and key achievements",
      },
      {
        id: 5,
        name: "Intern 2",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/medium1.pdf?alt=media&token=8228fb6f-8c2a-4b55-8094-f6497b96876b",
        description:
          "Technical focus with emphasis on project contributions and skills",
      },
      {
        id: 6,
        name: "Intern 3",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/medium3.pdf?alt=media&token=802dfb74-75d5-45e0-b178-09786146c1ed",
        description:
          "Dynamic design highlighting leadership and team collaboration",
      },
    ],
  },
  pro: {
    icon: FiAward,
    title: "Professional",
    description: "Senior level resume templates",
    templates: [
      {
        id: 7,
        name: "SDE 1",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/pro1.pdf?alt=media&token=b313fdfd-fcba-4934-95b0-a288c6792c18",
        description:
          "Executive style emphasizing strategic impact and team leadership",
      },
      {
        id: 8,
        name: "SDE 1 New",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/pro2.pdf?alt=media&token=b313fdfd-fcba-4934-95b0-a288c6792c18",
        description:
          "Results-driven layout focusing on major achievements and innovations",
      },
      {
        id: 6,
        name: "SDE 2",
        path: "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/pro3.pdf?alt=media&token=b313fdfd-fcba-4934-95b0-a288c6792c18",
        description:
          "Advanced template for showcasing architectural decisions and system design",
      },
    ],
  },
};

export default function ResumeViewer() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("fresher");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setResumeFile(file);
    }
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
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-[10rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#0e162b] mb-4">
              Resume Template Explorer
            </h1>
            <p className="text-xl text-[#0e162b]">
              Find the perfect template for your career stage
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center space-x-4 mb-12">
            {Object.entries(RESUME_TYPES).map(
              ([key, { icon: Icon, title }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTab(key)}
                  className={`flex items-center px-6 py-3 rounded-md transition-colors text-lg ${
                    selectedTab === key
                      ? "bg-[#d85981] text-[#0e162b] font-bold"
                      : "bg-[#ffeae5e7] text-[#0e162b] hover:bg-[#EEB6B3] border border-[#0e162b]"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{title}</span>
                </button>
              )
            )}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESUME_TYPES[selectedTab].templates.map((template) => (
              <div
                key={template.id}
                className="bg-[#ffeae5e7] border rounded-lg p-5 hover:border-[#d85981] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <FiFileText className="w-6 h-6 text-[#0e162b]" />
                    <h3 className="text-lg font-medium text-[#0e162b]">
                      {template.name}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={template.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md text-[#0e162b] hover:bg-[#EEB6B3]"
                      title="View PDF"
                    >
                      <FiEye className="w-5 h-5" />
                    </a>
                    <a
                      href={template.path}
                      download
                      className="p-2 rounded-md text-[#0e162b] hover:bg-[#EEB6B3]"
                      title="Download PDF"
                    >
                      <FiDownload className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <p className="text-base text-[#0e162b] mt-2">
                  {template.description}
                </p>
              </div>
            ))}
          </div>

          {/* Modified Buttons Section */}
          <div className="text-center mt-12 flex justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-[#d85981] text-[#0e162b] font-medium rounded-md hover:bg-[#EEB6B3] transition-colors text-lg"
            >
              <FiUpload className="w-5 h-5 mr-2" />
              Analyze Your Resume
            </button>

            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center px-6 py-3 bg-[#d85981] text-[#0e162b] font-medium rounded-md hover:bg-[#EEB6B3] transition-colors text-lg"
            >
              <FiBriefcase className="w-5 h-5 mr-2" />
              Search for Internships
            </button>
          </div>

          {/* Analysis Modal */}
          <Transition show={isModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => setIsModalOpen(false)}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                </Transition.Child>

                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-4xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-semibold text-[#0e162b]"
                      >
                        Resume Analysis
                      </Dialog.Title>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-[#0e162b] hover:text-[#000000]"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xl font-semibold mb-4 text-[#0e162b]">
                          Upload Resume
                        </h4>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-md p-6 text-center ${
                            isDragging
                              ? "border-[#d85981] bg-[#ffeae5e7]"
                              : "border-[#EEB6B3] hover:border-[#d85981] bg-[#ffeae5e7]"
                          }`}
                        >
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <FiUpload className="w-10 h-10 text-[#0e162b] mb-3" />
                            <span className="text-[#0e162b] text-lg">
                              {resumeFile
                                ? `Selected: ${resumeFile.name}`
                                : "Drop your resume here or click to browse"}
                            </span>
                          </label>
                        </div>

                        <div className="mt-4">
                          <label className="block text-lg font-medium text-[#0e162b] mb-2">
                            Job Role
                          </label>
                          <input
                            type="text"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            placeholder="e.g., Frontend Developer"
                            className="w-full px-3 py-3 border rounded-md focus:ring-1 focus:ring-[#d85981] focus:border-[#d85981] text-[#0e162b] bg-[#ffeae5e7] text-lg"
                          />
                        </div>

                        <button
                          onClick={handleAnalyzeResume}
                          disabled={!resumeFile || !jobRole}
                          className={`mt-4 w-full py-3 px-4 rounded-md text-lg font-medium ${
                            resumeFile && jobRole
                              ? "bg-[#d85981] text-[#0e162b] hover:bg-[#EEB6B3]"
                              : "bg-[#ffeae5e7] text-[#0e162b] cursor-not-allowed"
                          }`}
                        >
                          Analyze Resume
                        </button>
                      </div>

                      <div className="bg-[#ffeae5e7] p-6 rounded-md">
                        <h4 className="text-xl font-semibold mb-4 text-[#0e162b]">
                          Analysis Results
                        </h4>
                        {analysisResult ? (
                          <div className="space-y-4">
                            <div className="bg-[#EEB6B3] p-4 rounded-md border border-[#d85981]">
                              <h5 className="font-medium text-[#0e162b] mb-2 text-lg">
                                Profile
                              </h5>
                              <p className="text-[#0e162b] text-lg">
                                <span className="font-medium">Name:</span>{" "}
                                {analysisResult.details.profile.name}
                              </p>
                              <p className="text-[#0e162b] text-lg">
                                <span className="font-medium">Contact:</span>{" "}
                                {analysisResult.details.profile.contact_no}
                              </p>
                            </div>

                            <div className="bg-[#EEB6B3] p-4 rounded-md border border-[#d85981]">
                              <h5 className="font-medium text-[#0e162b] mb-2 text-lg">
                                Technical Skills
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {analysisResult.response.resume_evaluation.key_qualifications_and_experience.technical_skills.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-[#ffeae5e7] text-[#0e162b] px-3 py-1 rounded-md text-base"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="bg-[#EEB6B3] p-4 rounded-md border border-[#d85981]">
                              <h5 className="font-medium text-[#0e162b] mb-2 text-lg">
                                Overall Rating
                              </h5>
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-[#0e162b]">
                                  {
                                    analysisResult.response.resume_evaluation
                                      .rating.score
                                  }
                                  /
                                  {
                                    analysisResult.response.resume_evaluation
                                      .rating.max_score
                                  }
                                </span>
                                <span className="text-[#0e162b] text-lg">
                                  {
                                    analysisResult.response.resume_evaluation
                                      .rating.overall_alignment
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-[#0e162b] text-lg">
                            <p>
                              Upload your resume and specify a job role to see
                              the analysis
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </>
  );
}
