import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  FiMic, 
  FiCode, 
  FiBookOpen, 
  FiArrowRight, 
  FiBarChart2, 
  FiAward, 
  FiChevronRight,
  FiVideo,
  FiStar,
  FiCpu,
  FiFileText,
  FiMessageSquare,
  FiPlayCircle
} from "react-icons/fi";

export default function UpskillingHome() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(null);

  const UPSKILL_CATEGORIES = [
    {
      id: "public-speaking",
      route: "/public-speaking",
      icon: FiMic,
      title: "Public Speaking",
      description: "Boost your confidence in presentations and speeches",
      color: "#d85981",
      features: [
        {
          title: "Real-time Feedback",
          description: "Get instant analysis on your speaking style and confidence level",
          icon: FiBarChart2
        },
        {
          title: "Video Recording",
          description: "Record and review your presentations to track improvement",
          icon: FiVideo
        },
        {
          title: "Confidence Meter",
          description: "Visual speedometer showing your confidence score",
          icon: FiStar
        }
      ]
    },
    {
      id: "coding",
      route: "/coding",
      icon: FiCode,
      title: "Coding Platform",
      description: "Practice and improve your programming skills",
      color: "#0e162b",
      features: [
        {
          title: "DSA Practice",
          description: "Strengthen your data structures and algorithms skills",
          icon: FiCpu
        },
        {
          title: "Debugging Challenges",
          description: "Find and fix bugs in broken code samples",
          icon: FiFileText
        },
        {
          title: "Regular Coding Exercises",
          description: "Daily challenges to keep your coding skills sharp",
          icon: FiCode
        }
      ]
    },
    {
      id: "quiz",
      route: "/quiz",
      icon: FiBookOpen,
      title: "Quiz Game",
      description: "Transform your notes into interactive quizzes",
      color: "#EEB6B3",
      features: [
        {
          title: "Note Upload",
          description: "Upload your lecture notes to create personalized quizzes",
          icon: FiFileText
        },
        {
          title: "Interactive Learning",
          description: "Gamified approach to reinforce your understanding",
          icon: FiPlayCircle
        },
        {
          title: "Discussion Forum",
          description: "Discuss questions and answers with peers",
          icon: FiMessageSquare
        }
      ]
    }
  ];

  const handleCategoryHover = (id) => {
    setActiveFeature(id);
  };

  const handleCategoryLeave = () => {
    setActiveFeature(null);
  };

  const getSuccessStories = () => {
    return [
      {
        id: 1,
        category: "Public Speaking",
        name: "Ananya Sharma",
        achievement: "Increased confidence score from 45% to 92% in 3 weeks",
        description: "The real-time feedback helped me understand my speaking patterns and improve dramatically."
      },
      {
        id: 2,
        category: "Coding Platform",
        name: "Rahul Verma",
        achievement: "Solved 120+ DSA problems in one month",
        description: "The structured approach to coding challenges helped me ace my technical interviews."
      },
      {
        id: 3,
        category: "Quiz Game",
        name: "Priya Patel",
        achievement: "Improved exam scores by 28% using quiz-based revision",
        description: "Converting my notes to quizzes made revision fun and effective. My retention improved significantly!"
      }
    ];
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-[10rem]">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#0e162b] mb-4">
              Upskill Your Way to Success
            </h1>
            <p className="text-xl text-[#0e162b] max-w-3xl mx-auto">
              Choose from our specialized training modules designed to enhance your professional and academic skills
            </p>
          </div>

          {/* Main Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {UPSKILL_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="relative bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.8rem] p-8 hover:border-[#d85981] transition-all duration-300 flex flex-col h-full"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="flex items-center mb-5">
                    <div 
                      className="p-3 rounded-md mr-3"
                      style={{ backgroundColor: category.color, color: "#fff" }}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0e162b]">{category.title}</h2>
                  </div>
                  
                  <p className="text-[#0e162b] mb-6">{category.description}</p>
                  
                  <button
                    onClick={() => navigate(category.route)}
                    className="mt-auto inline-flex items-center px-5 py-3 bg-[#d85981] text-[#0e162b] font-medium rounded-md hover:bg-[#EEB6B3] transition-colors text-lg self-start"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </button>

                  {/* Features Popup on Hover */}
                  {activeFeature === category.id && (
                    <div className="absolute left-full ml-4 top-0 bg-white shadow-xl rounded-lg p-6 z-10 w-64 border border-[#EEB6B3] hidden md:block">
                      <h3 className="text-lg font-bold text-[#0e162b] mb-4">Key Features</h3>
                      <div className="space-y-4">
                        {category.features.map((feature, index) => (
                          <div key={index} className="flex">
                            <feature.icon className="w-5 h-5 text-[#d85981] mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-[#0e162b]">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* How It Works Section */}
          <div className="bg-[#fff2ef80] rounded-lg p-10 mb-16 border-[#D85981] border-2">
            <h2 className="text-3xl font-bold text-[#0e162b] mb-8 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d85981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0e162b] mb-2">Choose Your Skill</h3>
                <p className="text-[#0e162b]">Select from our three specialized training modules based on your goals.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d85981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0e162b] mb-2">Practice Regularly</h3>
                <p className="text-[#0e162b]">Consistent practice with our AI-powered feedback systems builds mastery.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d85981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0e162b] mb-2">Track Your Progress</h3>
                <p className="text-[#0e162b]">Monitor your improvement with detailed analytics and performance metrics.</p>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0e162b] mb-8 text-center">Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getSuccessStories().map(story => (
                <div key={story.id} className="bg-[#fff0ec7c] border-2 border-[#d85981] rounded-lg p-6 hover:border-[#d85981] transition-colors">
                  <div className="flex items-center mb-4">
                    <FiAward className="w-6 h-6 text-[#d85981] mr-2" />
                    <span className="text-sm font-medium bg-[#EEB6B3] px-3 py-1 rounded-full text-[#0e162b]">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0e162b] mb-2">{story.name}</h3>
                  <p className="font-medium text-[#0e162b] mb-3">{story.achievement}</p>
                  <p className="text-[#0e162b] text-sm italic">"{story.description}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPSKILL_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => navigate(category.route)}
                className="flex items-center justify-between p-4 bg-[#ffeae5e7] rounded-md hover:bg-[#EEB6B3] transition-colors"
              >
                <div className="flex items-center">
                  <category.icon className="w-5 h-5 mr-3 text-[#0e162b]" />
                  <span className="font-medium text-[#0e162b]">{category.title}</span>
                </div>
                <FiChevronRight className="w-5 h-5 text-[#0e162b]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}