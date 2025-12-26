import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ user: data.user });
}
