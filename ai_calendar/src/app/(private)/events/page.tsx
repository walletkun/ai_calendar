import { Button } from "@/components/ui/button";
import { Calendar, CalendarPlus, Users } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { SearchEvents } from "@/components/search-events";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookingsTable, EventTable } from "@/drizzle/schema";
import { and, eq, like, desc, gte } from "drizzle-orm";


interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function EventsPage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  } 

  const whereConditions = [eq(EventTable.clerkUserId, userId)];

  // Calculate the dates from the week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyWhereConditions = [eq(BookingsTable.clerkUserId, userId), gte(BookingsTable.bookedAt,oneWeekAgo)];


  const params = await searchParams;

  if (params.search) {
    whereConditions.push(like(EventTable.name, `%${params.search}%`));
  }

  // Events from db
  const events = await db.query.EventTable.findMany({
    where: and(...whereConditions),
    orderBy: [desc(EventTable.createdAt)],
  });

  // bookings count from db
  const eventsWithBookings: Array<{ id: string; name: string; description: string | null; durationInMinutes: number; clerkUserId: string; isActive: boolean; createdAt: Date; updatedAt: Date; bookings: number }> = await Promise.all(
    // Using Promise.all to ensures that parallel asynchronous calls to retrieve the data from database
    events.map(async (event) => {

      const bookingsCount = await db.query.BookingsTable.findMany({
        where: eq(BookingsTable.eventId, event.id),
      }).then((rows) => rows.length);

      return {
        ...event,
        bookings: bookingsCount,
      };
    })
  );

  const weeklyBookingsCount = await db.query.BookingsTable.findMany({
    where: and(...weeklyWhereConditions),
  }).then((rows) =>  rows.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Stats Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Your Events</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium">Upcoming</p>
                  <p className="text-gray-500">{events.length} meetings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium">This Week</p>
                  <p className="text-gray-500">
                    {weeklyBookingsCount} bookings
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/events/new">
                  <CalendarPlus className="mr-2 size-5" />
                  New Event
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <SearchEvents />
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventsWithBookings.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.name}
              description={event.description || ""}
              duration={event.durationInMinutes}
              bookings={event.bookings}
              status="active"
            />
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first event to start accepting bookings
            </p>
            <Button asChild>
              <Link href="/events/new">
                <CalendarPlus className="mr-2 size-5" />
                Create Event
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
