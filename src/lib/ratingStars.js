export function ratingStars(rating) {
    return Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(rating / 2)
        ? `<svg class="star" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"><path d="M8.50006 14.2L4.31257 16.725C4.13757 16.8333 3.95632 16.8792 3.76882 16.8625C3.58132 16.8458 3.41673 16.7833 3.27507 16.675C3.1334 16.5667 3.02507 16.4292 2.95007 16.2625C2.87507 16.0958 2.86256 15.9125 2.91256 15.7125L4.02507 10.95L0.325065 7.75001C0.166732 7.60835 0.0667318 7.44793 0.0250651 7.26876C-0.0166016 7.0896 -0.00826823 6.91668 0.0500651 6.75001C0.108398 6.58335 0.206315 6.44168 0.343815 6.32501C0.481315 6.20835 0.654232 6.13751 0.862565 6.11251L5.73757 5.68751L7.63757 1.20001C7.7209 1.00835 7.84173 0.866679 8.00006 0.775012C8.1584 0.683346 8.32506 0.637512 8.50006 0.637512C8.67506 0.637512 8.84173 0.683346 9.00006 0.775012C9.1584 0.866679 9.27923 1.00835 9.36257 1.20001L11.2626 5.68751L16.1376 6.11251C16.3459 6.13751 16.5188 6.20835 16.6563 6.32501C16.7938 6.44168 16.8917 6.58335 16.9501 6.75001C17.0084 6.91668 17.0167 7.0896 16.9751 7.26876C16.9334 7.44793 16.8334 7.60835 16.6751 7.75001L12.9751 10.95L14.0876 15.7125C14.1376 15.9125 14.1251 16.0958 14.0501 16.2625C13.9751 16.4292 13.8667 16.5667 13.7251 16.675C13.5834 16.7833 13.4188 16.8458 13.2313 16.8625C13.0438 16.8792 12.8626 16.8333 12.6876 16.725L8.50006 14.2Z"></path></svg>`
        : (i < rating / 2 ? `<svg class="star half" viewBox="0 0 8.5 17" xmlns="http://www.w3.org/2000/svg"><path d="m 8.5,0.63671875 c -0.1749998,0 -0.3416602,0.047006 -0.5,0.13867187 C 7.8416702,0.86705753 7.7200487,1.0075589 7.6367188,1.1992188 L 5.7382812,5.6875 0.86328125,6.1132812 C 0.65494846,6.1382812 0.48124986,6.2075589 0.34375,6.3242188 0.20625014,6.4408886 0.10911409,6.5833402 0.05078125,6.75 -0.00755202,6.9166698 -0.01627603,7.0903714 0.02539063,7.2695312 0.06705728,7.4487011 0.16588591,7.6083401 0.32421875,7.75 l 3.70117185,3.199219 -1.1132812,4.763672 c -0.05,0.199999 -0.037891,0.382128 0.037109,0.548828 0.075,0.1667 0.184502,0.305762 0.3261718,0.414062 0.1416599,0.1083 0.3066408,0.1708 0.4941406,0.1875 0.1874999,0.0167 0.367969,-0.03037 0.5429688,-0.138672 L 8.5,14.199219 Z"/></svg>` : ``)
).join('')
}