import type { ImageSize } from "$lib/types/letterboxd";

export const ua = "Letterboxd/6519 CFNetwork/3826.500.131 Darwin/24.5.0";

export async function getToken() {
    // extracted from the iOS app
    const response = await fetch('https://api.letterboxd.com/api/v0/auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': ua,
            'Origin': 'https://letterboxd.com',
            'accept-language': 'en-US,en;q=0.9',
        },
        body: new URLSearchParams({
            'client_id': "4f203301-9688-f722-9f4b-c59e90ad6fd6",
            'client_secret': "7d0356bd9e6a357a068f7c48b8557dbfe36b056331bdffc554720165f1620876",
            'grant_type': 'client_credentials',
            'scope': "",
        })
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return `${data.token_type} ${data.access_token}`;
}

export function selectBestImageUrls(images: ImageSize[]) {
    // Sort images by height ascending for efficient selection
    const sortedImages = [...images].sort((a, b) => a.height - b.height);

    // Find best matching image for a given target height
    const findBestMatch = (targetHeight: number) => {
        // Find first image that meets or exceeds target height
        const match = sortedImages.find(img => img.height >= targetHeight);
        // Return match if found, otherwise use largest available image
        return match ? match.url : sortedImages[sortedImages.length - 1]?.url || '';
    };

    return {
        small: findBestMatch(100),
        medium: findBestMatch(250),
        large: findBestMatch(500)
    };
}