import overridesData from "$lib/overrides/data";
import { json } from "@sveltejs/kit";

export async function GET() {
    return json(overridesData);
}