import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

    const { id } = await params;
    if(!id){
        return NextResponse.json({ success: false, error: "No id found"});
    }

    try{
        const event = await db.query.EventTable.findFirst({
            where: eq(EventTable.id, id),
        })

        if (!event){
            return NextResponse.json({success: false, error: "No event found"});
        }

        const bookingsCount = 10; //Replace after creating a booking count parameter

        return NextResponse.json({
            id: event.id,
            duration: event.durationInMinutes,
            bookings: bookingsCount,
            status: event.isActive ? 'Active' : 'Inactive'
        });
    }catch(error){
        console.error("Error: ", error);

        return NextResponse.json({error: "Error fetching details"},
            {status: 500}
        );
    }

}
