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
import type * as AppVercelContentarchiveContentArticle from './content/article.js'
import type * as AppVercelContentarchiveContentBook from './content/book.js'
import type * as AppVercelContentarchiveContentMovie from './content/movie.js'
import type * as AppVercelContentarchiveContentPaper from './content/paper.js'
import type * as AppVercelContentarchiveContentPodcastEpisode from './content/podcastEpisode.js'
import type * as AppVercelContentarchiveContentThread from './content/thread.js'
import type * as AppVercelContentarchiveContentTvShow from './content/tvShow.js'
import type * as AppVercelContentarchiveContentUri from './content/uri.js'
import type * as AppVercelContentarchiveContentVideo from './content/video.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.vercel.contentarchive.content'

export interface Record {
  $type: 'app.vercel.contentarchive.content'
  id: string
  createdAt: string
  content:
    | $Typed<AppVercelContentarchiveContentArticle.Main>
    | $Typed<AppVercelContentarchiveContentBook.Main>
    | $Typed<AppVercelContentarchiveContentMovie.Main>
    | $Typed<AppVercelContentarchiveContentPaper.Main>
    | $Typed<AppVercelContentarchiveContentPodcastEpisode.Main>
    | $Typed<AppVercelContentarchiveContentThread.Main>
    | $Typed<AppVercelContentarchiveContentTvShow.Main>
    | $Typed<AppVercelContentarchiveContentUri.Main>
    | $Typed<AppVercelContentarchiveContentVideo.Main>
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
