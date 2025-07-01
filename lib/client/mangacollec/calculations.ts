import type { BookGroup } from "$lib/types/media";

export function totalVolumes(bookList: BookGroup[]) {
    return bookList.reduce((sum, group) => sum + group.books.length, 0);
}