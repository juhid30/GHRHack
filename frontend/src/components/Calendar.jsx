import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Dummy Events Data including all-day events
const getEvents = async () => {
  return [
    // New dummy all-day events
    { title: "Hackathon Kickoff", start: "2025-03-05", allDay: true },
    { title: "Team Building Day", start: "2025-03-12", allDay: true },
    { title: "Project Deadline", start: "2025-03-05", allDay: true },
  ];
};

export function CalendarComponent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await getEvents();
      // Set the events directly to the state
      setEvents(allEvents);
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full h-full relative bg-purple-50 p-4 rounded-lg">
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
        eventColor="#c4b5e4" // Light purple for events
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
