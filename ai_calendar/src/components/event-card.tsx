"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Link as LinkIcon,
  MoreVertical,
  Trash,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  duration: number;
  bookings: number;
  status: string;
  onDelete: (id: number) => void;
  onCopyLink: (id: number) => void;
}

export function EventCard({ id, title, description }: EventCardProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [bookings, setBookings] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleDelete = async () => {
    try {
      setIsDeleted(true);
      const response = await fetch(`/api/events/${id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Erorr deleting event: ", error);
      alert("Error Deleting Event");
    }
  };

  //Fetch event detail on mount
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch(`/api/events/${id}/details`);
        const data = await response.json();
        console.log(data);

        setDuration(data.duration);
        setBookings(data.bookings);
        setStatus(data.status);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchEventDetail();
  }, [id]);

  return (
    <Card
      className={`group hover:shadow-lg transition-shadow ${
        isDeleted ? "animate-slideAway" : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Link href={`/events/${id}`} className="flex-1">
            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
              {title}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCopyLink(id)}>
                <LinkIcon className="mr-2 size-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete()}
                className="text-red-600"
              >
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="size-4 text-gray-400" />
          <span className="text-sm text-gray-500">{duration ? `${duration} minutes` : "Loading..."}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4">{description ? `${description}` : "Loading..."}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-gray-400" />
            <span className="text-sm text-gray-600">{bookings ? `${bookings} Attending` : "No bookings"}</span>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              status
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
