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
  AppLofiskyLibraryContentArticle: {
    lexicon: 1,
    id: 'app.lofisky.library.content.article',
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
  AppLofiskyLibraryContentBook: {
    lexicon: 1,
    id: 'app.lofisky.library.content.book',
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
  AppLofiskyLibraryContent: {
    lexicon: 1,
    id: 'app.lofisky.library.content',
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
                'lex:app.lofisky.library.content.article',
                'lex:app.lofisky.library.content.book',
                'lex:app.lofisky.library.content.movie',
                'lex:app.lofisky.library.content.paper',
                'lex:app.lofisky.library.content.podcast',
                'lex:app.lofisky.library.content.podcastEpisode',
                'lex:app.lofisky.library.content.thread',
                'lex:app.lofisky.library.content.tvShow',
                'lex:app.lofisky.library.content.uri',
                'lex:app.lofisky.library.content.video',
              ],
            },
          },
        },
      },
    },
  },
  AppLofiskyLibraryContentMovie: {
    lexicon: 1,
    id: 'app.lofisky.library.content.movie',
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
  AppLofiskyLibraryContentPaper: {
    lexicon: 1,
    id: 'app.lofisky.library.content.paper',
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
  AppLofiskyLibraryContentPodcast: {
    lexicon: 1,
    id: 'app.lofisky.library.content.podcast',
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
  AppLofiskyLibraryContentPodcastEpisode: {
    lexicon: 1,
    id: 'app.lofisky.library.content.podcastEpisode',
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
  AppLofiskyLibraryContentThread: {
    lexicon: 1,
    id: 'app.lofisky.library.content.thread',
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
  AppLofiskyLibraryContentTvShow: {
    lexicon: 1,
    id: 'app.lofisky.library.content.tvShow',
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
  AppLofiskyLibraryContentUri: {
    lexicon: 1,
    id: 'app.lofisky.library.content.uri',
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
  AppLofiskyLibraryContentVideo: {
    lexicon: 1,
    id: 'app.lofisky.library.content.video',
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
  AppLofiskyLibraryContentArticle: 'app.lofisky.library.content.article',
  AppLofiskyLibraryContentBook: 'app.lofisky.library.content.book',
  AppLofiskyLibraryContent: 'app.lofisky.library.content',
  AppLofiskyLibraryContentMovie: 'app.lofisky.library.content.movie',
  AppLofiskyLibraryContentPaper: 'app.lofisky.library.content.paper',
  AppLofiskyLibraryContentPodcast: 'app.lofisky.library.content.podcast',
  AppLofiskyLibraryContentPodcastEpisode:
    'app.lofisky.library.content.podcastEpisode',
  AppLofiskyLibraryContentThread: 'app.lofisky.library.content.thread',
  AppLofiskyLibraryContentTvShow: 'app.lofisky.library.content.tvShow',
  AppLofiskyLibraryContentUri: 'app.lofisky.library.content.uri',
  AppLofiskyLibraryContentVideo: 'app.lofisky.library.content.video',
} as const
