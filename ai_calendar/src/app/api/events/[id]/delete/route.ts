import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// Create a DELETE Reuqest of the events
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Params received:", params);
  const { id } = await params;
  console.log("ID: ", id);
  if (!id) {
    return NextResponse.json(
      { success: false, error: "No ID Provided" },
      { status: 400 }
    );
  }

  try {
    await db.delete(EventTable).where(eq(EventTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting events: ", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
