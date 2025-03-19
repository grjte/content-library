/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../util'
import type * as AppLofiskyLibraryContentArticle from './content/article.js'
import type * as AppLofiskyLibraryContentBook from './content/book.js'
import type * as AppLofiskyLibraryContentMovie from './content/movie.js'
import type * as AppLofiskyLibraryContentPaper from './content/paper.js'
import type * as AppLofiskyLibraryContentPodcast from './content/podcast.js'
import type * as AppLofiskyLibraryContentPodcastEpisode from './content/podcastEpisode.js'
import type * as AppLofiskyLibraryContentThread from './content/thread.js'
import type * as AppLofiskyLibraryContentTvShow from './content/tvShow.js'
import type * as AppLofiskyLibraryContentUri from './content/uri.js'
import type * as AppLofiskyLibraryContentVideo from './content/video.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.lofisky.library.content'

export interface Record {
  $type: 'app.lofisky.library.content'
  id: string
  createdAt: string
  content:
    | $Typed<AppLofiskyLibraryContentArticle.Main>
    | $Typed<AppLofiskyLibraryContentBook.Main>
    | $Typed<AppLofiskyLibraryContentMovie.Main>
    | $Typed<AppLofiskyLibraryContentPaper.Main>
    | $Typed<AppLofiskyLibraryContentPodcast.Main>
    | $Typed<AppLofiskyLibraryContentPodcastEpisode.Main>
    | $Typed<AppLofiskyLibraryContentThread.Main>
    | $Typed<AppLofiskyLibraryContentTvShow.Main>
    | $Typed<AppLofiskyLibraryContentUri.Main>
    | $Typed<AppLofiskyLibraryContentVideo.Main>
    | { $type: string }
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
