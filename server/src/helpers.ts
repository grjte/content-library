import { Content } from '#/types/content';
export const ensureSecureUrl = (url: string) => {
    return url.replace('http://', 'https://')
}

export const cleanContentEntry = (entry: Content) => {
    return Object.fromEntries(
        Object.entries(entry).filter(([_, value]) => value != undefined)
    )
}