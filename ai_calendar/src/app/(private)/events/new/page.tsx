import EventForm from "@/components/forms/EventForms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEventPage(){
    return (
        <Card className='max-w-md mx-auto'>
            <CardHeader>
                <CardTitle className="">
                    New Event
                </CardTitle>
                <CardContent>
                    <EventForm/>
                </CardContent>
            </CardHeader>

        </Card>
    )
}