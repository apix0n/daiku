import { version } from '$app/environment';
import { json } from '@sveltejs/kit';

export function GET() {
    return json(version);
}