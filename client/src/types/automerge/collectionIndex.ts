import { AutomergeUrl } from "@automerge/automerge-repo";
import { EditableContent } from "./editableContent";

/**
 * Index for editable entries managed by Automerge
 * @type CollectionItem
 */
type CollectionItem = {
    type: EditableContent['content']['$type'];
    date: EditableContent['createdAt'];
    automergeUrl: EditableContent['automergeUrl'];
    isPublic: EditableContent['isPublic'];
}

/**
 * Index for editable entries managed by Automerge
 * @type CollectionIndex
 */
export type CollectionIndex = {
    entries: {
        [key: EditableContent['id']]: CollectionItem
    }
}