import { AutomergeUrl } from "@automerge/automerge-repo";


export type IndexItem = {
    automergeUrl: AutomergeUrl
    name: string
    createdAt: string
}

export type Index = {
    collections: {
        [key: AutomergeUrl]: IndexItem
    }
}