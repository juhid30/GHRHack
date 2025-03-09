import { useEffect, useState } from "react";
import {
  FiUser,
  FiAward,
  FiDownload,
  FiMail,
  FiCode,
  FiTrendingUp,
  FiCheckCircle,
  FiCalendar,
  FiCpu,
  FiTarget,
  FiBarChart2,
  FiStar,
  FiBookOpen,
} from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "./Navbar";
import { Download } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

// Profile Header Component (Redesigned)
export function ProfileHeader() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Dummy user data
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const { email, displayName, profilePic, resume, wantsToBe, uid } = user;
      setProfile({ email, displayName, profilePic, resume, wantsToBe });
      setLoading(false);

      // Fetch coins from Firestore
      if (uid) {
        getCoins(uid);
      }
    }
  }, []);

  const getCoins = async (userId) => {
    try {
      const userCoinsRef = doc(db, "coins", userId);
      const userCoinsDoc = await getDoc(userCoinsRef);

      if (userCoinsDoc.exists()) {
        setCoins(userCoinsDoc.data().coins);
      } else {
        setCoins(0);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
      setCoins(0);
    }
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center bg-[#fff7f5] rounded-lg animate-pulse">
        <p className="text-[#20397F]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fff7f5]  rounded-[1.2rem] p-6  transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#CD6D8B]">
            {profile.displayName === "Nishant Patil" ? (
              <img
                src="https://avatar.iran.liara.run/public/boy"
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://avatar.iran.liara.run/public/girl"
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#CD6D8B] text-white rounded-full p-2 border-2 border-white">
            <FiStar className="h-5 w-5" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#20397F]">
                {profile.displayName}
              </h1>
              <p className="text-lg text-[#20397F] opacity-80">Student</p>
            </div>
            <div className="mt-3 md:mt-0 bg-[#ffeeed] px-4 py-2 rounded-full flex items-center justify-center md:justify-start space-x-2">
              <FiAward className="h-5 w-5 text-[#20397F]" />
              <span className="font-semibold text-[#20397F]">
                {coins} Coins
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#EEB6B3]">
              <FiMail className="h-4 w-4 text-[#CD6D8B]" />
              <span className="text-[#20397F]">{profile.email}</span>
            </div>
            <a
              href={profile.resume}
              download
              className="bg-[#CD6D8B] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#20397F] transition-all duration-300"
            >
              <FiDownload className="h-4 w-4" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skills Section (Redesigned)
export function SkillsSection() {
  const skills = [
    { name: "JavaScript", level: 85 },
    { name: "React", level: 78 },
    { name: "Node.js", level: 70 },
    { name: "CSS", level: 90 },
    { name: "TypeScript", level: 65 },
    { name: "Next.js", level: 60 },
  ];

  return (
    <div className=" border-2 border-[#EEB6B3] rounded-[1.2rem] p-6 shadow-sm hover:border-[#CD6D8B] transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[#CD6D8B] rounded-md">
          <FiCode className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#20397F]">
          Skills &amp; Expertise
        </h2>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#20397F]">{skill.name}</span>
              <span className="text-sm text-[#20397F]">{skill.level}%</span>
            </div>
            <div className="w-full bg-[#ffeeed] rounded-full h-2">
              <div
                className="bg-[#CD6D8B] h-2 rounded-full"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["UI/UX", "Git", "Figma", "MongoDB", "GraphQL"].map((tag, index) => (
          <span
            key={index}
            className="bg-white border border-[#EEB6B3] text-[#20397F] px-3 py-1 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// Rewards Component (Redesigned)
export function RewardsGraph() {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.uid) {
      getCoins(user.uid);
    }
  }, []);

  const getCoins = async (userId) => {
    try {
      const userCoinsRef = doc(db, "coins", userId);
      const userCoinsDoc = await getDoc(userCoinsRef);

      if (userCoinsDoc.exists()) {
        setCoins(userCoinsDoc.data().coins);
      } else {
        setCoins(0);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
      setCoins(0);
    }
  };

  // Progress levels with descriptions
  const progressLevels = [
    { level: "Novice", range: "0-100", current: coins <= 100 },
    {
      level: "Apprentice",
      range: "101-300",
      current: coins > 100 && coins <= 300,
    },
    { level: "Expert", range: "301-600", current: coins > 300 && coins <= 600 },
    { level: "Master", range: "601+", current: coins > 600 },
  ];

  // Calculate percentage for progress bar (max 1000 coins)
  const progressPercentage = Math.min((coins / 1000) * 100, 100);

  return (
    <div className="bg-[#fff7f5]  rounded-[1.2rem] p-6 shadow-sm hover:border-[#CD6D8B] transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[#CD6D8B] rounded-md">
          <FiAward className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#20397F]">Rewards Status</h2>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-white rounded-full p-4 border-4 border-[#CD6D8B] mb-3">
          <span className="text-4xl font-bold text-[#20397F]">{coins}</span>
        </div>
        <p className="text-[#20397F] opacity-80">Total Coins Earned</p>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#20397F]">
            Progress to next level
          </span>
          <span className="text-sm text-[#20397F]">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-[#ffeeed] rounded-full h-3">
          <div
            className="bg-[#CD6D8B] h-3 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-[#EEB6B3]">
        <h3 className="font-medium text-[#20397F] mb-3">Achievement Levels</h3>
        <div className="space-y-3">
          {progressLevels.map((level, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded-md ${
                level.current ? "bg-[#ffeeed] border border-[#CD6D8B]" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {level.current && <FiStar className="h-4 w-4 text-[#CD6D8B]" />}
                <span
                  className={`font-medium ${
                    level.current
                      ? "text-[#20397F]"
                      : "text-[#20397F] opacity-70"
                  }`}
                >
                  {level.level}
                </span>
              </div>
              <span className="text-sm text-[#20397F] opacity-80">
                {level.range} coins
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Weekly Challenges (Redesigned)
export function WeeklyChallenges() {
  const [challenges, setChallenges] = useState([
    { id: 1, text: "Complete 5 coding challenges", done: true },
    { id: 2, text: "Attend one webinar", done: false },
    { id: 3, text: "Read a tech article", done: true },
    { id: 4, text: "Submit one project update", done: false },
    { id: 5, text: "Practice interview questions", done: false },
  ]);

  const toggleChallenge = (id) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, done: !ch.done } : ch))
    );
  };

  // Calculate progress
  const completedCount = challenges.filter((c) => c.done).length;
  const totalCount = challenges.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className=" border-2 border-[#CD6D8B] rounded-[1.2rem] p-6 shadow-sm hover:border-[#CD6D8B] transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#CD6D8B] rounded-md">
            <FiTarget className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#20397F]">
            Weekly Challenges
          </h2>
        </div>
        <div className="bg-white border border-[#EEB6B3] text-[#20397F] px-3 py-1 rounded-full text-sm font-medium">
          {completedCount}/{totalCount} Completed
        </div>
      </div>

      <div className="w-full bg-[#ffeeed] rounded-full h-2 mb-6">
        <div
          className="bg-[#CD6D8B] h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`flex items-start p-4 rounded-lg cursor-pointer transition-all ${
              challenge.done
                ? "bg-white border border-[#EEB6B3] opacity-80"
                : "bg-white border border-[#EEB6B3]"
            }`}
            onClick={() => toggleChallenge(challenge.id)}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded border ${
                challenge.done
                  ? "bg-[#CD6D8B] border-[#CD6D8B] flex items-center justify-center"
                  : "border-[#CD6D8B]"
              } mr-3 mt-0.5`}
            >
              {challenge.done && (
                <FiCheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span
              className={`text-[#20397F] ${
                challenge.done ? "line-through opacity-70" : ""
              }`}
            >
              {challenge.text}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-[#CD6D8B] text-white rounded-lg py-3 hover:bg-[#20397F] transition-all duration-300 font-medium">
        View All Challenges
      </button>
    </div>
  );
}

// Bar Graph (Redesigned)
export function ActivityBarGraph() {
  const data = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    datasets: [
      {
        label: "Coins Earned",
        data: [32, 35, 27, 37, 28],
        backgroundColor: "#CD6D8B",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(238, 182, 179, 0.2)",
        },
        ticks: {
          color: "#20397F",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#20397F",
        },
      },
    },
  };

  return (
    <div className="bg-[#fff7f5]  rounded-[1.2rem] p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#CD6D8B] rounded-md">
            <FiBarChart2 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#20397F]">Daily Activity</h2>
        </div>
        <span className="bg-white border border-[#EEB6B3] text-[#20397F] px-3 py-1 rounded-full text-sm font-medium">
          This Week
        </span>
      </div>

      <div className="h-60">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#EEB6B3] rounded-lg p-4">
          <p className="text-sm text-[#20397F] opacity-80 mb-1">
            Daily Average
          </p>
          <p className="text-2xl font-bold text-[#20397F]">31.8</p>
        </div>
        <div className="bg-white border border-[#EEB6B3] rounded-lg p-4">
          <p className="text-sm text-[#20397F] opacity-80 mb-1">Best Day</p>
          <p className="text-2xl font-bold text-[#20397F]">Wednesday</p>
        </div>
      </div>
    </div>
  );
}

// Quiz Line Graph (Redesigned)
export function QuizLineGraph() {
  const data = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    datasets: [
      {
        label: "Correct Answers",
        data: [5, 10, 15, 10, 20],
        fill: false,
        borderColor: "#CD6D8B",
        tension: 0.3,
        pointBackgroundColor: "#CD6D8B",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(238, 182, 179, 0.2)",
        },
        ticks: {
          color: "#20397F",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#20397F",
        },
      },
    },
  };

  return (
    <div className="bg-[#fff7f5] border-2 border-[#CD6D8B] rounded-[1.2rem] p-6 shadow-sm hover:border-[#CD6D8B] transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#CD6D8B] rounded-md">
            <FiBookOpen className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#20397F]">Quiz Performance</h2>
        </div>
        <div className="flex space-x-1">
          <span className="bg-white border border-[#EEB6B3] text-[#20397F] px-3 py-1 rounded-full text-sm font-medium">
            78% Accuracy
          </span>
        </div>
      </div>

      <div className="h-60">
        <Line data={data} options={options} />
      </div>

      <div className="mt-6 bg-white border border-[#EEB6B3] rounded-lg p-4">
        <h3 className="font-medium text-[#20397F] mb-2">
          Performance Insights
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <FiTrendingUp className="h-4 w-4 text-[#CD6D8B] mt-0.5 mr-2" />
            <span className="text-sm text-[#20397F]">
              Your accuracy has improved by 12% this week
            </span>
          </li>
          <li className="flex items-start">
            <FiTarget className="h-4 w-4 text-[#CD6D8B] mt-0.5 mr-2" />
            <span className="text-sm text-[#20397F]">
              Try focusing on Data Structures topics
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Yoga Performance Bar Graph (Redesigned)
export function YogaPerformanceGraph() {
  const data = {
    labels: ["Tree", "Warrior", "Cobra"],
    datasets: [
      {
        label: "Progress",
        data: [12, 6, 22],
        backgroundColor: ["#CD6D8B", "#20397F", "#EEB6B3"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(238, 182, 179, 0.2)",
        },
        ticks: {
          color: "#20397F",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#20397F",
        },
      },
    },
  };

  return (
    <div className="bg-[#fff7f5] border-2 border-[#EEB6B3] rounded-[1.2rem] p-6 shadow-sm hover:border-[#CD6D8B] transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#CD6D8B] rounded-md">
            <FiTarget className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#20397F]">Yoga Performance</h2>
        </div>
        <span className="bg-white border border-[#EEB6B3] text-[#20397F] px-3 py-1 rounded-full text-sm font-medium">
          This Month
        </span>
      </div>

      <div className="h-48">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-6 flex items-center justify-between bg-white border border-[#EEB6B3] rounded-lg p-4">
        <div>
          <h3 className="font-medium text-[#20397F]">Best Pose</h3>
          <p className="text-[#CD6D8B] font-bold">Cobra</p>
        </div>
        <div className="bg-[#ffeeed] h-12 w-12 rounded-lg flex items-center justify-center">
          <span className="font-bold text-[#20397F]">A+</span>
        </div>
      </div>
    </div>
  );
}

// Upcoming Events Component (New)
export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Mock Interview",
      date: "10 Mar",
      time: "2:00 PM",
      category: "Career",
    },
    {
      id: 2,
      title: "Data Structures Workshop",
      date: "15 Mar",
      time: "6:30 PM",
      category: "Technical",
    },
    {
      id: 3,
      title: "Team Project Meeting",
      date: "12 Mar",
      time: "1:00 PM",
      category: "Project",
    },
  ];

  return (
    <div className="bg-[#fff7f5] border-2 border-[#EEB6B3] rounded-[1.2rem] p-6 shadow-sm hover:border-[#CD6D8B] transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[#CD6D8B] rounded-md">
          <FiCalendar className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#20397F]">Upcoming Events</h2>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-[#EEB6B3] rounded-lg p-4 hover:border-[#CD6D8B] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-[#20397F]">{event.title}</h3>
                <div className="flex items-center text-sm text-[#20397F] opacity-80 mt-1">
                  <FiCalendar className="h-3 w-3 mr-1" />
                  <span>
                    {event.date} · {event.time}
                  </span>
                </div>
              </div>
              <span className="bg-[#ffeeed] text-[#20397F] px-2 py-1 rounded text-xs font-medium">
                {event.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-[#CD6D8B] text-white rounded-lg py-3 hover:bg-[#20397F] transition-all duration-300 font-medium">
        View Calendar
      </button>
    </div>
  );
}

// Main Profile Page (Completely Redesigned)
export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#20397F]">
              Profile Dashboard
            </h1>
            <p className="text-[#20397F] opacity-80 mt-2">
              Track your progress, manage skills, and monitor your achievements
            </p>
          </div>

          {/* Profile Header Section */}
          <div className="mb-8">
            <ProfileHeader />
          </div>

          {/* Main Content - Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-8">
              <SkillsSection />
              <button
                className="w-full bg-[#CD6D8B] text-white rounded-lg py-3 hover:bg-[#20397F] transition-all duration-300 font-medium"
                onClick={() => {
                  const pdfUrl =
                    "https://firebasestorage.googleapis.com/v0/b/librarymanagementmpr.appspot.com/o/WEEKLYREPORT.pdf?alt=media&token=58ec4f07-ce16-4a88-aec9-5c404b211d43";

                  // Open the PDF in a new tab directly
                  window.open(pdfUrl, "_blank");
                }}
              >
                <Download className="h-5 w-5 inline-block mr-2" />
                View Weekly Report
              </button>

              <RewardsGraph />
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-6 space-y-8">
              <ActivityBarGraph />
              <QuizLineGraph />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-8">
              <WeeklyChallenges />

              <UpcomingEvents />
              <YogaPerformanceGraph />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
