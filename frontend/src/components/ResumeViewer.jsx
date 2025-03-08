import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiUpload, FiX, FiFileText, FiUser, FiAward, FiCode, FiDownload, FiEye } from 'react-icons/fi';

const RESUME_TYPES = {
  fresher: {
    icon: FiUser,
    title: 'Fresher',
    description: 'Perfect for those just starting their career',
    templates: [
      { 
        id: 1, 
        name: 'Clean Start 1', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/fresher1.pdf?alt=media&token=1080a625-5665-4e68-8e1e-6c36183ab447',
        description: 'Minimalist design perfect for highlighting academic achievements and internships'
      },
      { 
        id: 2, 
        name: 'Clean Start 2', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/fresher2.pdf?alt=media&token=b2539471-609a-4bf0-9939-9132f326f8b2',
        description: 'Modern layout emphasizing skills and project experience'
      },
      { 
        id: 3, 
        name: 'Clean Start 3', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/fresher3.pdf?alt=media&token=cdeb8e52-d6f2-417e-8aa9-6e76baa1aeca',
        description: 'Classic format ideal for traditional industries and academic positions'
      }
    ]
  },
  intermediate: {
    icon: FiCode,
    title: 'Intermediate',
    description: '2-5 years of experience templates',
    templates: [
      { 
        id: 4, 
        name: 'Intern 1', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/medium1.pdf?alt=media&token=8228fb6f-8c2a-4b55-8094-f6497b96876b',
        description: 'Balanced layout showcasing professional growth and key achievements'
      },
      { 
        id: 5, 
        name: 'Intern 2', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/medium1.pdf?alt=media&token=8228fb6f-8c2a-4b55-8094-f6497b96876b',
        description: 'Technical focus with emphasis on project contributions and skills'
      },
      { 
        id: 6, 
        name: 'Intern 3', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/medium3.pdf?alt=media&token=802dfb74-75d5-45e0-b178-09786146c1ed',
        description: 'Dynamic design highlighting leadership and team collaboration'
      }
    ]
  },
  pro: {
    icon: FiAward,
    title: 'Professional',
    description: 'Senior level resume templates',
    templates: [
      { 
        id: 7, 
        name: 'SDE 1', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/pro1.pdf?alt=media&token=b313fdfd-fcba-4934-95b0-a288c6792c18',
        description: 'Executive style emphasizing strategic impact and team leadership'
      },
      { 
        id: 8, 
        name: 'SDE 1 New', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/pro2.pdf?alt=media&token=b313fdfd-fcba-4934-95b0-a288c6792c18',
        description: 'Results-driven layout focusing on major achievements and innovations'
      },
      { 
        id: 6, 
        name: 'SDE 2', 
        path: 'https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/pro3.pdf?alt=media&token=b313fdfd-fcba-4934-95b0-a288c6792c18',
        description: 'Advanced template for showcasing architectural decisions and system design'
      }
    ]
  }
};

export default function ResumeViewer() {
  const [selectedTab, setSelectedTab] = useState('fresher');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobRole, setJobRole] = useState('');
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
    formData.append('file', resumeFile);
    formData.append('job_role', jobRole);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Template Explorer</h1>
          <p className="text-lg text-gray-600">Find the perfect template for your career stage</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-12">
          {Object.entries(RESUME_TYPES).map(([key, { icon: Icon, title }]) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                selectedTab === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="font-medium">{title}</span>
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESUME_TYPES[selectedTab].templates.map((template) => (
            <div
              key={template.id}
              className="bg-white border rounded-lg p-4 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FiFileText className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base font-medium text-gray-900">{template.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={template.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                    title="View PDF"
                  >
                    <FiEye className="w-4 h-4" />
                  </a>
                  <a
                    href={template.path}
                    download
                    className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                    title="Download PDF"
                  >
                    <FiDownload className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{template.description}</p>
            </div>
          ))}
        </div>

        {/* Analyze Resume Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Analyze Your Resume
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

              <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                      Resume Analysis
                    </Dialog.Title>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Upload Resume</h4>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-md p-6 text-center ${
                          isDragging
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-400'
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
                          <FiUpload className="w-8 h-8 text-gray-400 mb-3" />
                          <span className="text-gray-600">
                            {resumeFile
                              ? `Selected: ${resumeFile.name}`
                              : 'Drop your resume here or click to browse'}
                          </span>
                        </label>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Role
                        </label>
                        <input
                          type="text"
                          value={jobRole}
                          onChange={(e) => setJobRole(e.target.value)}
                          placeholder="e.g., Frontend Developer"
                          className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        />
                      </div>

                      <button
                        onClick={handleAnalyzeResume}
                        disabled={!resumeFile || !jobRole}
                        className={`mt-4 w-full py-2 px-4 rounded-md ${
                          resumeFile && jobRole
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Analyze Resume
                      </button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-md">
                      <h4 className="text-lg font-semibold mb-4">Analysis Results</h4>
                      {analysisResult ? (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-md border">
                            <h5 className="font-medium text-gray-900 mb-2">Profile</h5>
                            <p>
                              <span className="font-medium">Name:</span>{' '}
                              {analysisResult.details.profile.name}
                            </p>
                            <p>
                              <span className="font-medium">Contact:</span>{' '}
                              {analysisResult.details.profile.contact_no}
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-md border">
                            <h5 className="font-medium text-gray-900 mb-2">Technical Skills</h5>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.response.resume_evaluation.key_qualifications_and_experience.technical_skills.map(
                                (skill, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-md border">
                            <h5 className="font-medium text-gray-900 mb-2">Overall Rating</h5>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-gray-900">
                                {analysisResult.response.resume_evaluation.rating.score}/
                                {analysisResult.response.resume_evaluation.rating.max_score}
                              </span>
                              <span className="text-gray-600">
                                {analysisResult.response.resume_evaluation.rating.overall_alignment}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <p>Upload your resume and specify a job role to see the analysis</p>
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
  );
}