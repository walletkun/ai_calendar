"use server";

import { eventFormSchema } from "@/schema/events";
import { z } from "zod";
import "use-server";
import { db } from "@/drizzle/db";
import { BookingsTable, EventTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createEvent(unsafeData: z.infer<typeof eventFormSchema>) {
   const { userId } = await auth();
    if(!userId){
        console.log("No userId found in auth");
        return { error: "Authenticated Required"}
    }

    const result = eventFormSchema.safeParse(unsafeData);
    if(!result.success){
        console.error("Form validation failed", result.error);
        return {error: "Invalid form"}
    }

    try{
        const event = await db.insert(EventTable).values({
            ...result.data,
            clerkUserId: userId,
        }).returning();

        const initialBookings = result.data.bookings;

        if (initialBookings > 0) {
            const bookings = Array.from({ length: initialBookings}).map(() => ({
                eventId: event[0].id,
                clerkUserId: userId
            }));

        await db.insert(BookingsTable).values(bookings);
        }

        return {
            success: true,
            data: event[0]
        };
    } catch(error){
        console.error("Database error: ", error);
        return {error: "idk tripping probably"}
    }
}
