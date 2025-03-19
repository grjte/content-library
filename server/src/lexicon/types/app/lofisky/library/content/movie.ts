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
const id = 'app.lofisky.library.content.movie'

/** Movie type extending CreativeWork. */
export interface Main {
  $type?: 'app.lofisky.library.content.movie'
  author?: string[]
  datePublished?: string
  description?: string
  title: string
  thumbnailUrl?: string
  uri?: string
  actors?: string[]
  director?: string[]
  genre?: string
  imdbId?: string
  writer?: string[]
}

const hashMain = 'main'

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain)
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain)
}
