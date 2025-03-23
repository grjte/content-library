import { AutomergeUrl } from "@automerge/automerge-repo";


export type IndexItem = {
    automergeUrl: AutomergeUrl
    createdAt: string
    name: string
}

export type Index = {
    collections: {
        [key: AutomergeUrl]: IndexItem
    }
}