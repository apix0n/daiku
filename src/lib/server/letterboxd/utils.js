export function extractBoxdId(url) {
    const regex = /\/film\/([^\/]+)(?:\/\d+)?\/$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export function makeBoxdCoverLinksFromUrl(link) {
    const dimensionsRegex = /(\d+)-(\d+)-(\d+)-(\d+)-crop/;

    const large = link.replace(dimensionsRegex, '0-1000-0-1500-crop');
    const medium = link.replace(dimensionsRegex, '0-600-0-900-crop');
    const small = link.replace(dimensionsRegex, '0-230-0-345-crop');

    return {
        large,
        medium,
        small
    };
}