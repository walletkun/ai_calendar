import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EventsPage() {
    const { userId } = await auth();
    console.log("User: ", userId);

    if(!userId){
        redirect("/sign-in")
    }


    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId } , { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    })
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 items-baseline mb-8">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold">
            Events
          </h1>
          <Button asChild>
            <Link href="/events/new">
              <CalendarPlus className="mr-2 size-6" />
              New Event
            </Link>
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600">{event.description}</p>
                {/* Add more event details as needed */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-4 mt-12">
            <CalendarRange className="size-16 text-gray-400" />
            <p className="text-lg text-gray-600">
              You do not have any events set up yet. Create your first event to
              get started!
            </p>
            <Button size="lg" className="text-lg" asChild>
              <Link href="/events/new">
                <CalendarPlus className="mr-4 size-6" />
                New Event
              </Link>
            </Button>
          </div>
        )}
      </div>
    );

}
