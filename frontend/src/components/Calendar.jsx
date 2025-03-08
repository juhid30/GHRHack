import React, { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hobbies, setHobbies] = useState("");
  const [syllabus, setSyllabus] = useState(null);

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

      window.location.reload();

      // Convert to FullCalendar's required format

      setEvents(prasedData);
      localStorage.setItem("events", JSON.stringify(prasedData));
      setShowPopup(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="w-full h-full relative bg-purple-50 p-4 rounded-lg">
      <button
        onClick={() => setShowPopup(true)}
        className="mb-4 p-2 bg-purple-600 text-white rounded"
      >
        Get Events
      </button>

      {showPopup && (
        <div className="fixed top-0 left-0 z-40 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="mb-2">Enter Details</h2>
            <input
              type="text"
              placeholder="Hobbies"
              className="border p-2 w-full mb-2"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
            />
            <input
              type="file"
              accept="application/pdf"
              className="border p-2 w-full mb-2"
              onChange={handleSyllabusUpload}
            />
            <button
              onClick={fetchEventsFromGemini}
              className="p-2 bg-green-600 text-white rounded"
            >
              Submit
            </button>
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
    <div className="bg-purple-50 w-[92.5%] h-screen p-9 flex">
      <CalendarComponent />
    </div>
  );
}

export default Calendar;
