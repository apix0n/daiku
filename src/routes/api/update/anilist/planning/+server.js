import { fetchPlannedData } from "$lib/server/anilist/planned";
import { json } from '@sveltejs/kit';
import { accounts } from "$lib/server/config.js";
import { setValue } from "$lib/server/redisInteractions";

export async function GET() {
    try {
        let data = await fetchPlannedData(accounts.anilistId);
        await setValue("planning", data)
        return json({ success: true });
    } catch (error) {
        return json({
            success: false
        }, { status: 500 });
    }
}