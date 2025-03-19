import { EditableContent } from "./editableContent";

/**
 * Index for editable entries managed by Automerge
 * @type IndexEntry
 */
export type IndexEntry = {
    type: EditableContent['content']['$type'];
    date: EditableContent['createdAt'];
    automergeUrl: EditableContent['automergeUrl'];
    isPublic: EditableContent['isPublic'];
}

/**
 * Index for editable entries managed by Automerge
 * @type IndexEntries
 */
export type IndexEntries = {
    [key: EditableContent['id']]: IndexEntry
}

/**
 * Index for editable entries managed by Automerge
 * @type IndexDoc
 */
export type IndexDoc = {
    entries: IndexEntries
}