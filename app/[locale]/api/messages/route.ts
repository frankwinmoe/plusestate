// app/[locale]/api/messages/route.ts
import { createClient } from "@/lib/supabase/server";
import ListingMessagesService from "@/lib/services/listing-messages";

export async function POST(req: Request) {
    const supabase = await createClient();
    const service = new ListingMessagesService(supabase);

    const body = await req.json();
    const message = await service.send(body);

    return Response.json(message, { status: 201 });
}
