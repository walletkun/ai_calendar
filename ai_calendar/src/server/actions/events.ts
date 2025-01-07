"use server";

import { eventFormSchema } from "@/schema/events";
import { z } from "zod";
import "use-server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
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

        return {
            success: true,
            data: event[0]
        };
    } catch(error){
        console.error("Database error: ", error);
        return {error: "idk tripping probably"}
    }
}
