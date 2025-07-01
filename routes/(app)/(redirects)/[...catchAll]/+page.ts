import { redirect, error } from '@sveltejs/kit';

export const prerender = false;

export function load({ params }) {
    const path = params.catchAll;

    switch (path) {
        case 'collection': redirect(302, '/books')
        case 'collection/next': redirect(302, '/books/next')
        case 'planning/notreleased': redirect(302, '/planning/season')
        default: error(404, 'Not found')
    }
}