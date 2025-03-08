import { useEffect, useState } from "react";
import { Award, Coins, Download, Mail, Code2 } from "lucide-react";

// Profile Section
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

    setProfile({
      email,
      name,
      profilePic,
      resume,
      wantsToBe,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-32 h-32 border-2 border-[#55D6BE] rounded-full overflow-hidden">
          <img
            src={profile.profilePic}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-xl text-[#7D5BA6]">{profile.wantsToBe}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
            <a
              href={profile.resume}
              download
              className="bg-[#55D6BE] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7D5BA6]"
            >
              <Download className="h-4 w-4" />
              Download Resume
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
    // Dummy skills data
    const skillsArray = ["JavaScript", "React", "Node.js", "CSS"];

    setSkills(skillsArray);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-[#7D5BA6]" />
        <h2 className="text-xl font-semibold">Skills & Expertise</h2>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[#55D6BE] text-white px-4 py-2 rounded-lg text-sm"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-muted-foreground">No skills listed</p>
        )}
      </div>
    </div>
  );
}

// Coins Chart Section
export function CoinsChart({ data }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold">Coins Chart</h2>
      <div className="mt-4 relative h-60">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex justify-between">
            {data.map((monthData, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-6 h-24 bg-[#55D6BE] rounded-t-lg"
                  style={{ height: `${monthData.earned}%` }}
                ></div>
                <div className="text-xs text-[#7D5BA6]">{monthData.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Rewards Chart Section
export function RewardsChart({ data }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold">Rewards Chart</h2>
      <div className="mt-4 relative h-60">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex justify-between">
            {data.map((rewardData, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-6 h-24 bg-[#FC6471] rounded-t-lg"
                  style={{ height: `${rewardData.amount}%` }}
                ></div>
                <div className="text-xs text-[#7D5BA6]">{rewardData.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Graph Section (Performance Metrics)
export function GraphSection() {
  const [data, setData] = useState({
    rewards: [],
    coins: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy chart data
    const mockData = getMockData();
    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        Loading charts...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold">Performance Metrics</h2>
      <div className="mt-4">
        <div className="flex justify-between">
          <button className="bg-[#55D6BE] text-white px-4 py-2 rounded-lg">
            Rewards
          </button>
          <button className="bg-[#FC6471] text-white px-4 py-2 rounded-lg">
            Coins
          </button>
        </div>
        <div className="mt-4">
          <div className="h-60">
            <RewardsChart data={data.rewards} />
          </div>
          <div className="h-60 mt-6">
            <CoinsChart data={data.coins} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getMockData() {
  return {
    rewards: [
      { date: "2025-01-01", amount: 70 },
      { date: "2025-02-01", amount: 60 },
      { date: "2025-03-01", amount: 80 },
    ],
    coins: [
      { month: "Jan", earned: 60, spent: 20 },
      { month: "Feb", earned: 50, spent: 30 },
      { month: "Mar", earned: 90, spent: 40 },
    ],
  };
}

// Main Profile Page
export default function ProfilePage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="grid gap-8">
        <ProfileHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkillsSection />
          <GraphSection />
        </div>
      </div>
    </main>
  );
}
