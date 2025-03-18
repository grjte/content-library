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
  AppVercelContentarchiveContentArticle: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.article',
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
  AppVercelContentarchiveContentBook: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.book',
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
  AppVercelContentarchiveContent: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content',
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
                'lex:app.vercel.contentarchive.content.article',
                'lex:app.vercel.contentarchive.content.book',
                'lex:app.vercel.contentarchive.content.movie',
                'lex:app.vercel.contentarchive.content.paper',
                'lex:app.vercel.contentarchive.content.podcast',
                'lex:app.vercel.contentarchive.content.podcastEpisode',
                'lex:app.vercel.contentarchive.content.thread',
                'lex:app.vercel.contentarchive.content.tvShow',
                'lex:app.vercel.contentarchive.content.uri',
                'lex:app.vercel.contentarchive.content.video',
              ],
            },
          },
        },
      },
    },
  },
  AppVercelContentarchiveContentMovie: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.movie',
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
  AppVercelContentarchiveContentPaper: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.paper',
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
  AppVercelContentarchiveContentPodcast: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.podcast',
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
  AppVercelContentarchiveContentPodcastEpisode: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.podcastEpisode',
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
  AppVercelContentarchiveContentThread: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.thread',
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
  AppVercelContentarchiveContentTvShow: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.tvShow',
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
  AppVercelContentarchiveContentUri: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.uri',
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
  AppVercelContentarchiveContentVideo: {
    lexicon: 1,
    id: 'app.vercel.contentarchive.content.video',
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
  AppVercelContentarchiveContentArticle:
    'app.vercel.contentarchive.content.article',
  AppVercelContentarchiveContentBook: 'app.vercel.contentarchive.content.book',
  AppVercelContentarchiveContent: 'app.vercel.contentarchive.content',
  AppVercelContentarchiveContentMovie:
    'app.vercel.contentarchive.content.movie',
  AppVercelContentarchiveContentPaper:
    'app.vercel.contentarchive.content.paper',
  AppVercelContentarchiveContentPodcast:
    'app.vercel.contentarchive.content.podcast',
  AppVercelContentarchiveContentPodcastEpisode:
    'app.vercel.contentarchive.content.podcastEpisode',
  AppVercelContentarchiveContentThread:
    'app.vercel.contentarchive.content.thread',
  AppVercelContentarchiveContentTvShow:
    'app.vercel.contentarchive.content.tvShow',
  AppVercelContentarchiveContentUri: 'app.vercel.contentarchive.content.uri',
  AppVercelContentarchiveContentVideo:
    'app.vercel.contentarchive.content.video',
} as const
