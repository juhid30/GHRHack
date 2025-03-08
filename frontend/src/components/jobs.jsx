import React, { useState } from "react";
import { MapPin, Briefcase, IndianRupee, ExternalLink } from "lucide-react";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const jobData = [
    {
      title: "Front-End Developer",
      description:
        "Develop user-facing features using React and other front-end technologies.",
      location: "Mumbai, India",
      link: "https://www.naukri.com/softwere-developer-jobs-in-india",
      responsibilities: [
        "Develop new features",
        "Maintain existing codebase",
        "Collaborate with designers and product managers",
      ],
      skills: ["React", "CSS", "JavaScript"],
      payment: {
        amount: Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000,
        currency: "INR",
      },
    },
    {
      title: "Back-End Developer",
      description:
        "Build and maintain server-side applications using Node.js and Express.",
      location: "Pune, India",
      link: "https://www.naukri.com/softwere-developer-jobs-in-india",
      responsibilities: [
        "Develop new features",
        "Maintain existing codebase",
        "Collaborate with designers and product managers",
      ],
      skills: ["Node.js", "Express", "JavaScript"],
      payment: {
        amount: Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000,
        currency: "INR",
      },
    },
    {
      title: "Full-Stack Developer",
      description:
        "Work on both front-end and back-end technologies to deliver complete solutions.",
      location: "Nashik, India",
      link: "https://www.naukri.com/softwere-developer-jobs-in-india",
      responsibilities: [
        "Develop new features",
        "Maintain existing codebase",
        "Collaborate with designers and product managers",
      ],
      skills: ["React", "Node.js", "CSS", "JavaScript"],
      payment: {
        amount: Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000,
        currency: "INR",
      },
    },
    {
      title: "JavaScript Developer",
      description:
        "Write clean and efficient JavaScript code for web applications.",
      location: "Aurangabad, India",
      link: "https://www.naukri.com/softwere-developer-jobs-in-india",
      responsibilities: [
        "Develop new features",
        "Maintain existing codebase",
        "Collaborate with designers and product managers",
      ],
      skills: ["JavaScript"],
      payment: {
        amount: Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000,
        currency: "INR",
      },
    },
    {
      title: "MERN Stack Developer",
      description:
        "Develop applications using MongoDB, Express, React, and Node.js.",
      location: "Jalgaon, India",
      link: "https://www.naukri.com/softwere-developer-jobs-in-india",
      responsibilities: [
        "Develop new features",
        "Maintain existing codebase",
        "Collaborate with designers and product managers",
      ],
      skills: ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
      payment: {
        amount: Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000,
        currency: "INR",
      },
    },
  ];

  // Get unique locations for filter
  const locations = [...new Set(jobData.map((job) => job.location))];

  // Get unique skills for filter
  const allSkills = jobData.flatMap((job) => job.skills);
  const uniqueSkills = [...new Set(allSkills)];

  // Filter jobs based on search term and filters
  const filteredJobs = jobData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "" || job.location === locationFilter;

    const matchesSkill = skillFilter === "" || job.skills.includes(skillFilter);

    return matchesSearch && matchesLocation && matchesSkill;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#7D5BA6]">
        Job Listings
      </h1>

      {/* Search and Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div>
          <input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by location</option>
          <option value="all">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by skill</option>
          <option value="all">All Skills</option>
          {uniqueSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div
              key={index}
              className="h-full flex flex-col border border-gray-300 rounded-lg shadow-lg"
            >
              <div className="p-4">
                <h2 className="font-semibold text-xl text-[#7D5BA6]">
                  {job.title}
                </h2>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </p>
              </div>

              <div className="flex-grow p-4">
                <p className="mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-sm bg-[#55D6BE] text-white rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <IndianRupee className="h-4 w-4" />
                  <span>
                    {job.payment.amount.toLocaleString()} {job.payment.currency}
                    /year
                  </span>
                </div>
              </div>

              <div className="p-4 flex justify-between">
                <button
                  className="px-4 py-2 border border-gray-300 rounded text-[#7D5BA6]"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </button>
                <button className="px-4 py-2 bg-[#FC6471] text-white rounded">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Apply <ExternalLink className="h-4 w-4" />
                  </a>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-[#7D5BA6]">
              No jobs found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Job Details Dialog */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#7D5BA6]">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {selectedJob.location}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedJob.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-sm bg-[#55D6BE] text-white rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Compensation</h3>
              <p className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                <span>
                  {selectedJob.payment.amount.toLocaleString()}{" "}
                  {selectedJob.payment.currency}/year
                </span>
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-[#FC6471] text-white rounded">
                <a
                  href={selectedJob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Apply Now <ExternalLink className="h-4 w-4" />
                </a>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
