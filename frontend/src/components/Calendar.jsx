import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const getStudentDetails = async (studentId) => {
  try {
    const studentDocRef = doc(db, "Student", studentId);
    const studentSnapshot = await getDoc(studentDocRef);

    if (studentSnapshot.exists()) {
      return studentSnapshot.data();
    } else {
      console.error("No student found with the given ID");
      return null;
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    return null;
  }
};

const getAssignmentsForStudent = async () => {
  try {
    const assignmentsRef = collection(db, "AssignmentRecord");
    const querySnapshot = await getDocs(assignmentsRef);

    const allAssignments = [];
    querySnapshot.forEach((doc) => {
      allAssignments.push({ id: doc.id, ...doc.data() });
    });

    return allAssignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

const getEvents = async () => {
  try {
    const eventsRef = collection(db, "EventScheduling");
    const querySnapshot = await getDocs(eventsRef);

    const allEvents = [];
    querySnapshot.forEach((doc) => {
      allEvents.push({ id: doc.id, ...doc.data() });
    });

    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export function CalendarComponent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAssignmentsAndStudentData = async () => {
      const studentId = localStorage.getItem("studentId");

      if (studentId) {
        try {
          const studentDetails = await getStudentDetails(studentId);
          if (studentDetails) {
            const studentYear = Number(studentDetails.year);

            const allAssignments = await getAssignmentsForStudent();

            const filteredAssignments = allAssignments
              .filter((assignment) => Number(assignment.year) === studentYear)
              .map((assignment) => ({
                title: assignment.topic,
                start: assignment.dos.toDate().toISOString(),
                end: assignment.dos.toDate().toISOString(),
              }));

            const allEvents = await getEvents();

            const filteredEvents = allEvents.map((event) => ({
              title: event.title,
              start: event.start,
              end: event.end,
            }));

            setEvents([...filteredAssignments, ...filteredEvents]);
          }
        } catch (error) {
          console.error(
            "Error fetching assignments or student details:",
            error
          );
        }
      }
    };

    fetchAssignmentsAndStudentData();
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
          // Add any other buttons you want to customize here
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
