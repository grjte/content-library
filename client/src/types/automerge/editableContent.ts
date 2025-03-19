import { AutomergeUrl } from "@automerge/automerge-repo";
import dayjs from "dayjs";
import { DisplayContent, Content } from "../content";

/**
 * Type for local-first editing
 * @type EditableContent
 */
export interface EditableContent extends DisplayContent {
    automergeUrl: AutomergeUrl;
}

/**
 * Create an editable content object for local-first editing
 * @param content content data
 * @param automergeUrl automerge url
 * @returns editable content object
 */
export const createEditableContent = (content: Content, automergeUrl: AutomergeUrl): EditableContent => {
    const createdAt = dayjs().toISOString();
    const id = generateTID(createdAt);
    return {
        id,
        createdAt,
        content,
        automergeUrl,
        isPublic: false
    }
}

/**
 * Generate a TID from an ISO date string
 * @param isoDate ISO date string
 * @returns TID
 */
const generateTID = (isoDate: string): string => {
    // Get current timestamp in microseconds (similar to TID) from the provided date
    const timestamp = BigInt(dayjs(isoDate).valueOf()) * 1000n + BigInt(Math.floor(Math.random() * 1000));

    // Convert to base32 string (similar to TID)
    const base32Chars = '234567abcdefghijklmnopqrstuvwxyz';
    let result = '';
    let value = timestamp;

    while (value > 0) {
        result = base32Chars[Number(value & 31n)] + result;
        value = value >> 5n;
    }

    // Pad to ensure consistent length
    return result.padStart(13, '2');
}