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
import type * as XyzGroundmistLibraryContentArticle from './content/article.js'
import type * as XyzGroundmistLibraryContentBook from './content/book.js'
import type * as XyzGroundmistLibraryContentMovie from './content/movie.js'
import type * as XyzGroundmistLibraryContentPaper from './content/paper.js'
import type * as XyzGroundmistLibraryContentPodcast from './content/podcast.js'
import type * as XyzGroundmistLibraryContentPodcastEpisode from './content/podcastEpisode.js'
import type * as XyzGroundmistLibraryContentThread from './content/thread.js'
import type * as XyzGroundmistLibraryContentTvShow from './content/tvShow.js'
import type * as XyzGroundmistLibraryContentUri from './content/uri.js'
import type * as XyzGroundmistLibraryContentVideo from './content/video.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'xyz.groundmist.library.content'

export interface Record {
  $type: 'xyz.groundmist.library.content'
  id: string
  createdAt: string
  content:
    | $Typed<XyzGroundmistLibraryContentArticle.Main>
    | $Typed<XyzGroundmistLibraryContentBook.Main>
    | $Typed<XyzGroundmistLibraryContentMovie.Main>
    | $Typed<XyzGroundmistLibraryContentPaper.Main>
    | $Typed<XyzGroundmistLibraryContentPodcast.Main>
    | $Typed<XyzGroundmistLibraryContentPodcastEpisode.Main>
    | $Typed<XyzGroundmistLibraryContentThread.Main>
    | $Typed<XyzGroundmistLibraryContentTvShow.Main>
    | $Typed<XyzGroundmistLibraryContentUri.Main>
    | $Typed<XyzGroundmistLibraryContentVideo.Main>
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
