import { OmitKey } from "../lexicon/util";
import { Record } from "../lexicon/types/xyz/groundmist/library/content";
import { EditableContent } from "./automerge/editableContent";

import * as Article from "./lexicon/article";
import * as Book from "./lexicon/book";
import * as Movie from "./lexicon/movie";
import * as Podcast from "./lexicon/podcast";
import * as PodcastEpisode from "./lexicon/podcastEpisode";
import * as Thread from "./lexicon/thread";
import * as TvShow from "./lexicon/tvShow";
import * as Video from "./lexicon/video";
import * as Uri from "./lexicon/uri";

export { Article, Book, Movie, Podcast, PodcastEpisode, Thread, TvShow, Uri, Video };

/**
 * Type for managing content data of each content type
 * @type Content
 */
export type Content = Article.Type | Book.Type | Movie.Type | Podcast.Type | PodcastEpisode.Type | Thread.Type | TvShow.Type | Uri.Type | Video.Type;
export const $type = "xyz.groundmist.library.content";

/**
 * Type for UI display
 * @type DisplayContent
 */
export interface DisplayContent extends OmitKey<Record, '$type'> {
    isPublic: boolean;
    publishedBy?: string;
}

export type LexiconId = typeof Article.$type | typeof Book.$type | typeof Movie.$type | typeof Podcast.$type | typeof PodcastEpisode.$type | typeof Thread.$type | typeof TvShow.$type | typeof Uri.$type | typeof Video.$type;

/**
 * Type for lexicon records
 * @type LexiconRecord
 */
export type LexiconRecord = Record;

/**
 * Convert a lexicon record to a display content object
 * @param record lexicon record
 * @returns display content object
 */
export const lexiconToDisplay = (record: Record): DisplayContent => {
    return {
        id: record.id,
        createdAt: record.createdAt,
        content: record.content,
        isPublic: true
    }
}

/**
 * Convert a local-first editable content object to a lexicon record
 * @param entry editable content object
 * @returns lexicon record
 */
export const editableToLexicon = (entry: EditableContent): Record => {
    let record: Partial<Record> = {
        $type: $type,
        id: entry.id,
        createdAt: entry.createdAt,
    }
    switch (entry.content.$type) {
        case Article.$type:
            record.content = entry.content as Article.Type;
            break;
        case Book.$type:
            record.content = entry.content as Book.Type;
            break;
        case Movie.$type:
            record.content = entry.content as Movie.Type;
            break;
        case PodcastEpisode.$type:
            record.content = entry.content as PodcastEpisode.Type;
            break;
        case Thread.$type:
            record.content = entry.content as Thread.Type;
            break;
        case TvShow.$type:
            record.content = entry.content as TvShow.Type;
            break;
        case Uri.$type:
            record.content = entry.content as Uri.Type;
            break;
        case Video.$type:
            record.content = entry.content as Video.Type;
            break;
    }

    return record as Record;
}