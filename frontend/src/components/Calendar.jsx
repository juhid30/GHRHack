import React, { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Navbar from "./Navbar";
import { FiCalendar, FiUpload, FiX, FiClock } from "react-icons/fi";

export function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hobbies, setHobbies] = useState("");
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const storedEvents = localStorage.getItem("rawEvents");
    if (storedEvents) {
      console.log(storedEvents);
      setEvents(JSON.parse(storedEvents));
      console.log(events);
    }
  }, []);

  const handleSyllabusUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSyllabus(file);
    } else {
      alert("Please upload a valid PDF file.");
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
    if (file && file.type === "application/pdf") {
      setSyllabus(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const fetchEventsFromGemini = async () => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User data not found!");

    const formData = new FormData();
    formData.append("knows", user.knows);
    formData.append("wantsToBe", user.wantsToBe);
    formData.append("hobbies", hobbies);
    if (syllabus) {
      formData.append("syllabus", syllabus);
    }

    try {
      const response = await fetch("http://localhost:5000/get-events", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Raw response data:", data);

      let prasedData = data.events;
      prasedData = prasedData.replace(/```json|```/g, "").trim();
      console.log("Raw response data after parsing:", prasedData);

      localStorage.setItem("rawEvents", prasedData);

      // Parse the events string to JSON
      const parsedEvents = JSON.parse(prasedData);
      setEvents(parsedEvents);
      localStorage.setItem("events", JSON.stringify(parsedEvents));
      setShowPopup(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#20397F]">
          Your Personal Calendar
        </h1>
        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-3 bg-[#bf3964] text-[#ffffff] rounded-md font-medium text-lg transition-all duration-300 hover:bg-[#EEB6B3] flex items-center"
        >
          <FiCalendar className="w-5 h-5 mr-2" />
          Generate Events
        </button>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 z-40 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px] relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-[#20397F] hover:text-[#000000] transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold text-[#20397F] mb-6">
              Personalize Your Calendar
            </h2>

            <div className="mb-5">
              <label className="block text-lg font-medium text-[#20397F] mb-2">
                Your Hobbies & Interests
              </label>
              <input
                type="text"
                placeholder="e.g., Reading, Swimming, Coding..."
                className="border border-[#EEB6B3] p-3 w-full rounded-lg focus:ring-2 focus:ring-[#CD6D8B] focus:border-[#CD6D8B] bg-[#F6D8D1] text-[#20397F] text-lg outline-none"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-[#20397F] mb-2">
                Upload Your Syllabus
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-[#F6D8D1] transition-colors ${
                  isDragging
                    ? "border-[#CD6D8B]"
                    : "border-[#EEB6B3] hover:border-[#CD6D8B]"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-12 h-12 mb-3 text-[#20397F]" />
                  <p className="mb-2 text-lg text-[#20397F]">
                    {syllabus ? (
                      <span className="font-semibold">
                        File uploaded: {syllabus.name}
                      </span>
                    ) : (
                      <span className="font-semibold">
                        Click to upload or drag and drop
                      </span>
                    )}
                  </p>
                  <p className="text-base text-[#20397F]">
                    PDF files only (Max: 5MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleSyllabusUpload}
                />
              </div>
            </div>

            <button
              onClick={fetchEventsFromGemini}
              className="w-full p-4 bg-[#CD6D8B] text-[#20397F] rounded-lg font-medium text-lg transition-all duration-300 hover:bg-[#EEB6B3] focus:outline-none flex items-center justify-center"
            >
              <FiClock className="w-5 h-5 mr-2" />
              Generate My Calendar
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <div
              className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-[#CD6D8B] border-solid rounded-full"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-lg font-medium text-[#20397F]">
              Creating your personalized schedule...
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#fff9f7af] p-6 rounded-lg shadow-md">
        <Fullcalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="700px"
          events={events}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          eventColor="#CD6D8B"
          eventTextColor="#ffffff"
          eventBorderColor="#ffffff"
          dayMaxEvents={true}
          themeSystem="standard"
        />
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <>
      <Navbar />
      <div className="bg-white w-full min-h-screen pt-24 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-[#172858] mb-3">
              Schedule Planner
            </h1>
            <p className="text-xl text-[#20397F]">
              Manage your time effectively with AI-generated schedule based on
              your interests
            </p>
          </div>
          <CalendarComponent />
        </div>
      </div>
    </>
  );
}

export default Calendar;
