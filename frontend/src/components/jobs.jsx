import React, { useState } from "react";
import { MapPin, Briefcase, IndianRupee, ExternalLink } from "lucide-react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
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
    <>
      <Navbar />
      <div
        className="container mx-auto py-8 px-4 pt-[7rem]"
        // style={{ backgroundColor: "#F6D8D1" }}
      >
        <h1
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "#20397F" }}
        >
          Top 5 Job Listings
        </h1>

        {/* Search and Filters */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div>
            <input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                borderColor: "#EEB6B3",
                // backgroundColor: "#F6D8D1",
                color: "#20397F",
              }}
            />
          </div>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full p-2 border rounded"
            style={{
              borderColor: "#EEB6B3",
              // backgroundColor: "#F6D8D1",
              color: "#20397F",
            }}
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
            className="w-full p-2 border rounded"
            style={{
              borderColor: "#EEB6B3",
              // backgroundColor: "#F6D8D1",
              color: "#20397F",
            }}
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col border border-[#EEB6B3] rounded-2xl shadow-lg overflow-hidden bg-white"
              >
                {/* Job Title & Location */}
                <div className="p-5 bg-[#EEB6B3]">
                  <h2 className="font-bold text-2xl text-white">{job.title}</h2>
                  <p className="flex items-center gap-2 text-white mt-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </p>
                </div>

                {/* Job Description & Skills */}
                <div className="flex-grow p-5">
                  <p className="text-[#1c2c59] mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm font-medium rounded-full shadow-sm border border-[#CD6D8B] bg-[#FFEBEC] text-[#CD6D8B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[#20397F] font-medium">
                    <IndianRupee className="h-4 w-4" />
                    <span>
                      {job.payment.amount.toLocaleString()}{" "}
                      {job.payment.currency}/year
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 flex justify-between bg-gradient-to-r from-[#EEB6B3] to-[#CD6D8B]">
                  <button
                    className="px-5 py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#CD6D8B] transition-all"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </button>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-[#20397F] text-white rounded-lg flex items-center gap-2 shadow-md hover:bg-[#1c2c59] transition-all"
                  >
                    Apply <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-semibold text-[#20397F]">
                No jobs found
              </h3>
              <p className="mt-2 text-[#000000]">
                Try adjusting your search or filters.
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
              className="p-6 rounded-lg max-w-lg w-full bg-white"
              // style={{ backgroundColor: "#F6D8D1" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold" style={{ color: "#20397F" }}>
                {selectedJob.title}
              </h2>
              <p
                className="flex items-center gap-1"
                style={{ color: "#000000" }}
              >
                <MapPin className="h-4 w-4" />
                {selectedJob.location}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold" style={{ color: "#20397F" }}>
                  Responsibilities
                </h3>
                <ul
                  className="list-disc pl-5 space-y-1"
                  style={{ color: "#000000" }}
                >
                  {selectedJob.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold" style={{ color: "#20397F" }}>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-sm rounded-full"
                      style={{ backgroundColor: "#CD6D8B", color: "#F6D8D1" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold" style={{ color: "#20397F" }}>
                  Compensation
                </h3>
                <p
                  className="flex items-center gap-1"
                  style={{ color: "#000000" }}
                >
                  <IndianRupee className="h-4 w-4" />
                  <span>
                    {selectedJob.payment.amount.toLocaleString()}{" "}
                    {selectedJob.payment.currency}/year
                  </span>
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: "#20397F", color: "#F6D8D1" }}
                >
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
    </>
  );
}
