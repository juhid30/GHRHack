import { useEffect, useState } from "react";
import { Award, Coins, Download, Mail, Code2 } from "lucide-react";
import Navbar from "./Navbar"; // Added Navbar import
import { Bar, Line } from 'react-chartjs-2';
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
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

// Profile Header Component
export function ProfileHeader() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy user data
    const email = "dummy@example.com";
    const name = "John Doe";
    const profilePic = "https://via.placeholder.com/150";
    const resume = "https://example.com/resume.pdf";
    const wantsToBe = "Software Engineer";

    setProfile({ email, name, profilePic, resume, wantsToBe });
    setLoading(false);
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center">Loading profile...</div>;

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 border-2 border-[#55D6BE] rounded-full overflow-hidden">
          <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-xl text-[#7D5BA6]">{profile.wantsToBe}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>
            <a
              href={profile.resume}
              download
              className="bg-[#55D6BE] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7D5BA6]"
            >
              <Download className="h-4 w-4" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skills Section
export function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const skillsArray = ["JavaScript", "React", "Node.js", "CSS"];
    setSkills(skillsArray);
    setLoading(false);
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center">Loading skills...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-[#7D5BA6]" />
        <h2 className="text-xl font-semibold">Skills &amp; Expertise</h2>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {skills.length > 0 ? skills.map((skill, index) => (
          <span key={index} className="bg-[#55D6BE] text-white px-4 py-2 rounded-lg text-sm">
            {skill}
          </span>
        )) : <p>No skills listed</p>}
      </div>
    </div>
  );
}

// Dummy Graph components using placeholders
export function RewardsGraph() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Rewards Graph</h2>
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-600">[Dummy Rewards Graph]</span>
      </div>
    </div>
  );
}


// Updated Weekly Challenges Component as a clickable table
export function WeeklyChallenges() {
  const dummyChallenges = [
    "Complete 5 coding challenges",
    "Attend one webinar",
    "Read a tech article",
    "Submit one project update"
  ];
  const [challenges, setChallenges] = useState(
    dummyChallenges.map((challenge) => ({ text: challenge, done: false }))
  );

  const toggleChallenge = (index) => {
    setChallenges((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, done: !ch.done } : ch))
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">Weekly Challenges</h2>
      <table className="w-full">
        <tbody>
          {challenges.map((challenge, index) => (
            <tr
              key={index}
              className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleChallenge(index)}
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  readOnly
                  checked={challenge.done}
                  className="mr-2"
                />
                <span className={challenge.done ? "line-through text-gray-500" : ""}>
                  {challenge.text}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// New Bar Graph component using dummy data
export function BarGraph() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };
  const options = { maintainAspectRatio: false };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Bar Graph</h2>
      <div className="w-full h-48">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// New Line Graph component using dummy data
export function LineGraph() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Visitors",
        data: [5, 10, 15, 10, 20],
        fill: false,
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.3,
      },
    ],
  };
  const options = { maintainAspectRatio: false };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Line Graph</h2>
      <div className="w-full h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

// New Color Graph component (bar chart with red, yellow, green colors)
export function ColorGraph() {
  const data = {
    labels: ["Task 1", "Task 2", "Task 3"],
    datasets: [
      {
        label: "Progress",
        data: [30, 50, 80],
        backgroundColor: ["red", "yellow", "green"],
      },
    ],
  };
  const options = { maintainAspectRatio: false };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Progress Graph</h2>
      <div className="w-full h-48">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// Main revamped Profile Page with Navbar added
export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto pt-16 p-4">
        <div className="grid gap-8">
          <ProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkillsSection />
              <RewardsGraph />

              {/* New row for additional charts */}
              <BarGraph />
              <LineGraph />
            </div>
            <div>
              <WeeklyChallenges />
              {/* Placing the ColorGraph below WeeklyChallenges */}
              <div className="mt-8">
                <ColorGraph />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
