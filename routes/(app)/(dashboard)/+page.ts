import { redirect } from '@sveltejs/kit';

export function load() {
    const lastPage = typeof localStorage !== 'undefined' ? localStorage.getItem('lastPage') : null;
    return redirect(302, lastPage || "/anime");
}
