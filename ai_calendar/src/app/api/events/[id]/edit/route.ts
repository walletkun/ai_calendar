import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PUT(
    request: Request,
    { params } : { params: { id: string}},
){
    const { id } = await params; // Although it said it's not needed idk why it does not run without us putting await

    const body = await request.json(); // Gets the json format from the api fetch

    if (!id || !body){
        return NextResponse.json({success: false, error: "Invalid request"}, {status: 400});
    }

    try {
        const updated = await db.update(EventTable).set({
            name: body.name,
            description: body.description,
            durationInMinutes: body.duration,
            isActive: body.isActive,
        }).where(eq(EventTable.id, id));

        
        return NextResponse.json({success:true, updated});
    }

    catch(error){
        console.error("Error updating event: ", error);
        return NextResponse.json({success: false, error: error}, {status: 500});
    }



}