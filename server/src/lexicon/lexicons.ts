/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  XyzGroundmistLibraryContentArticle: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.article',
    defs: {
      main: {
        type: 'object',
        description:
          'Article type extending CreativeWork with a required URL override.',
        required: ['uri'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentBook: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.book',
    defs: {
      main: {
        type: 'object',
        description: 'Book type extending CreativeWork.',
        required: ['title'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
          publisher: {
            type: 'string',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContent: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content',
    description:
      'Schema for content records of various CreativeWork types (Article, Book, PodcastEpisode, Movie, TvShow, etc.)',
    defs: {
      main: {
        type: 'record',
        key: 'id',
        record: {
          type: 'object',
          required: ['id', 'createdAt', 'content'],
          properties: {
            id: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
            content: {
              type: 'union',
              refs: [
                'lex:xyz.groundmist.library.content.article',
                'lex:xyz.groundmist.library.content.book',
                'lex:xyz.groundmist.library.content.movie',
                'lex:xyz.groundmist.library.content.paper',
                'lex:xyz.groundmist.library.content.podcast',
                'lex:xyz.groundmist.library.content.podcastEpisode',
                'lex:xyz.groundmist.library.content.thread',
                'lex:xyz.groundmist.library.content.tvShow',
                'lex:xyz.groundmist.library.content.uri',
                'lex:xyz.groundmist.library.content.video',
              ],
            },
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentMovie: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.movie',
    defs: {
      main: {
        type: 'object',
        description: 'Movie type extending CreativeWork.',
        required: ['title'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
          actors: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          director: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          genre: {
            type: 'string',
          },
          imdbId: {
            type: 'string',
          },
          writer: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentPaper: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.paper',
    defs: {
      main: {
        type: 'object',
        description:
          'Paper type extending CreativeWork with a required URL override.',
        required: ['title', 'uri'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentPodcast: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.podcast',
    defs: {
      main: {
        type: 'object',
        description:
          'Podcast type extending CreativeWork with additional podcast fields.',
        required: ['title', 'podcastIndexId'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          podcastIndexId: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentPodcastEpisode: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.podcastEpisode',
    defs: {
      main: {
        type: 'object',
        description:
          'PodcastEpisode type extending CreativeWork with additional podcast fields.',
        required: ['title', 'podcastName'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
          duration: {
            type: 'string',
          },
          episodeNumber: {
            type: 'integer',
          },
          podcastName: {
            type: 'string',
          },
          seasonNumber: {
            type: 'integer',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentThread: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.thread',
    defs: {
      main: {
        type: 'object',
        description:
          'Thread type extending CreativeWork with a required URL override.',
        required: ['title', 'uri'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentTvShow: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.tvShow',
    defs: {
      main: {
        type: 'object',
        description: 'TvShow type extending CreativeWork.',
        required: ['title'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
          actors: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          director: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          imdbId: {
            type: 'string',
          },
          genre: {
            type: 'string',
          },
          writer: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentUri: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.uri',
    defs: {
      main: {
        type: 'object',
        description:
          'Url type extending CreativeWork with a required URL override.',
        required: ['title', 'uri'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
  XyzGroundmistLibraryContentVideo: {
    lexicon: 1,
    id: 'xyz.groundmist.library.content.video',
    defs: {
      main: {
        type: 'object',
        description:
          'Video type extending CreativeWork with a required URL override.',
        required: ['title', 'uri'],
        properties: {
          author: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          datePublished: {
            type: 'string',
            format: 'datetime',
          },
          description: {
            type: 'string',
            maxLength: 256,
          },
          title: {
            type: 'string',
          },
          thumbnailUrl: {
            type: 'string',
          },
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  XyzGroundmistLibraryContentArticle: 'xyz.groundmist.library.content.article',
  XyzGroundmistLibraryContentBook: 'xyz.groundmist.library.content.book',
  XyzGroundmistLibraryContent: 'xyz.groundmist.library.content',
  XyzGroundmistLibraryContentMovie: 'xyz.groundmist.library.content.movie',
  XyzGroundmistLibraryContentPaper: 'xyz.groundmist.library.content.paper',
  XyzGroundmistLibraryContentPodcast: 'xyz.groundmist.library.content.podcast',
  XyzGroundmistLibraryContentPodcastEpisode:
    'xyz.groundmist.library.content.podcastEpisode',
  XyzGroundmistLibraryContentThread: 'xyz.groundmist.library.content.thread',
  XyzGroundmistLibraryContentTvShow: 'xyz.groundmist.library.content.tvShow',
  XyzGroundmistLibraryContentUri: 'xyz.groundmist.library.content.uri',
  XyzGroundmistLibraryContentVideo: 'xyz.groundmist.library.content.video',
} as const
