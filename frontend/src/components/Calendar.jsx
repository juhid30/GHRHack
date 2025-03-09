import React, { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Navbar from "./Navbar";

export function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hobbies, setHobbies] = useState("");
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading

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

  const fetchEventsFromGemini = async () => {
    setLoading(true); // Set loading to true when the fetch starts

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
      setLoading(false); // Set loading to false after the fetch is done
    }
  };

  return (
    <div className="w-full h-full relative bg-purple-50 p-4 rounded-lg">
      <button
        onClick={() => setShowPopup(true)}
        className="mb-4 p-2 bg-purple-600 text-black rounded border border-black hover:text-white hover:bg-black"
      >
        Get Events
      </button>

      {showPopup && (
        <div className="fixed top-0 left-0 z-40 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Enter Details
            </h2>

            <input
              type="text"
              placeholder="Hobbies"
              className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
            />

            <div className="flex items-center justify-center w-full mb-4">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    {syllabus ? (
                      <span className="font-semibold">File uploaded</span>
                    ) : (
                      <span className="font-semibold">Click to upload</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
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
              </label>
            </div>

            <button
              onClick={fetchEventsFromGemini}
              className="w-full p-3 bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-transparent border-solid rounded-full text-purple-600"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <Fullcalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="100%"
        events={events}
        buttonText={{
          today: "Today",
          prev: "<",
          next: ">",
        }}
        className="bg-purple-100 text-purple-800"
        eventColor="#c4b5e4"
      />
    </div>
  );
}

function Calendar() {
  return (
    <>
      {/* Minimal Navbar */}
      <Navbar />
      <div className="bg-purple-50 w-full h-screen pt-16 p-9 flex">
        <CalendarComponent />
      </div>
    </>
  );
}

export default Calendar;
