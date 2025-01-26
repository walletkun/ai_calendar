"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


interface EditEventForm{
    id: string; // Event ID
}

interface EventDetails{
    name: string;
    description?: string; //Optional
    duration: string;
    isActive: boolean;
}

// Explicity saying it's a string to prevent mutable data type
export default function EditEventForm({id}: EditEventForm){
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null); //Explicity say it must have those fields

    const router = useRouter(); // For redirection to pages

    useEffect(() => {
        const fetchEvent = async () => {
            try{
                
                const response = await fetch(`/api/events/${id}/details`,{
                    method: "GET" // For better understanding
                }); 
                const data = await response.json(); // await because it's async we gotta fetch it
                setEventDetails(data); 
                if (!response.ok){
                    console.error("Error: ", response.json);
                }
            }
            catch(error){
                console.error("Error fetching event details: ", error);
            }
        }
        fetchEvent();
    }, [id]);


    if (!eventDetails){
        return <p>Loading...</p>
    }


    // Handler to handle the update after the event details are loaded and we can now submit the changes
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 

        try{
            const response = await fetch(`/api/events/${id}/edit`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(eventDetails),
            });

            if (!response.ok){
                console.error("Failed to update the event.");
            }

            else{
                console.log("Event updated successfully");
                router.push("/events")
                
            }
        }catch(error){
            console.error("Error updating event: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Event name:
                <input
                    type="text"
                    value={eventDetails.name || ""} // Fallback for empty string
                    onChange={(e) => {
                        setEventDetails((prev) => ({...prev!, name: e.target.value}))
                    }}
                    />
            </label>

            <button type="submit">Save Changes</button>

        </form>
    )

}