import { parse } from "cookie"

export function createHeaders(headers) {
    let headersFinal = new Headers()

    const cookies = parse(headers.get('cookie') || '');
    const forwardedCookies = ['_vercel_jwt'];

    const cookieHeader = forwardedCookies
        .filter(name => cookies[name])
        .map(name => `${name}=${cookies[name]}`)
        .join('; ') ?? null;

    if (cookieHeader) {
        headersFinal.append("Cookie", cookieHeader)
    }

    const authHeader = headers.get('authorization')
    if (authHeader) {
        headersFinal.append("Authorization", authHeader)
    }

    return headersFinal
} 