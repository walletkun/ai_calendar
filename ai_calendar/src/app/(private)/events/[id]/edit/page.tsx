"use client";

import { useEffect, useState, use} from "react";
import EventForm from "@/components/forms/EventForms";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${id}/details`);
        const data = await response.json();

        console.log("Data: ", data);
        setEventData(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [id]);

  if (!eventData) return <p>Loading...</p>;

  return (
    <>
    </>
  );
}
