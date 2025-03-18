/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.vercel.contentarchive.content.podcast'

/** Podcast type extending CreativeWork with additional podcast fields. */
export interface Main {
  $type?: 'app.vercel.contentarchive.content.podcast'
  author?: string[]
  description?: string
  podcastIndexId: string
  title: string
  thumbnailUrl?: string
  uri?: string
}

const hashMain = 'main'

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain)
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain)
}
