import EditEventForm from "@/components/forms/EditEventForms";

interface PageProps{
    params: {id : string};
}

export default async function EditEventPage( {params}: PageProps){

    const {id} = await params;
    return <EditEventForm id={id} />
}