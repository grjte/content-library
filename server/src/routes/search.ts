import 'dotenv/config';
import crypto from 'crypto';
import { Router } from 'express';
import { Book, Movie, Podcast, TvShow } from '#/types/content';
import { ensureSecureUrl, cleanContentEntry } from '#/helpers';

const router = Router();

router.get("/search/book", async (req, res) => {
    try {
        if (!process.env.OPEN_LIBRARY_API_URL) {
            res.status(500).json({ error: 'OPEN_LIBRARY_API_URL must be set on the server' })
            return
        }

        // check the query parameter
        const query = req.query.q
        if (!query) {
            res.status(400).json({ error: 'Query parameter is required' })
            return
        }

        // forward the query
        const url = `${process.env.OPEN_LIBRARY_API_URL}/search.json?q=${encodeURIComponent(query as string)}`
        const options = {
            method: "get",
            headers: {
                "User-Agent": `${process.env.USER_AGENT}`
            }
        };
        const response = await fetch(url, options)
        const data = await response.json()

        const results = data?.docs.map((doc: any) => {
            const book = {
                $type: Book.$type,
                title: doc.title,
                author: doc.author_name?.map((a: string) => a.trim()) || [],
                datePublished: doc.first_publish_year?.toString(),
                publisher: doc.publisher?.[0],
                uri: `${process.env.OPEN_LIBRARY_API_URL}${doc.key}`,
                thumbnailUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : undefined
            } as Book.Type

            const result = cleanContentEntry(book)
            if (!Book.validate(result))
                throw Error("Retrieved book data is invalid")
            return result
        })

        res.json({ result: results || [] })
    } catch (error) {
        console.error("Failed to fetch book data:", error)
        res.status(500).json({ error: 'Failed to fetch book data' })
    }
});

router.get("/search/podcast", async (req, res) => {
    try {
        if (!process.env.PODCAST_API_KEY || !process.env.PODCAST_API_SECRET) {
            res.status(500).json({ error: 'PODCAST_API_KEY and PODCAST_API_SECRET must be set on the server' })
            return
        }

        // check the query parameter
        const query = req.query.q
        if (!query) {
            res.status(400).json({ error: 'Query parameter is required' })
            return;
        }

        // Hash the api key and timestamp to get the Authorization token
        const apiHeaderTime = Math.floor(Date.now() / 1000);
        const sha1Hash = crypto.createHash("sha1");
        const data4Hash = process.env.PODCAST_API_KEY + process.env.PODCAST_API_SECRET + apiHeaderTime;
        sha1Hash.update(data4Hash);
        const hash4Header = sha1Hash.digest('hex');

        // Forward the query and collect/show the results
        let options = {
            method: "get",
            headers: {
                // not needed right now, maybe in future:  "Content-Type": "application/json",
                "X-Auth-Date": "" + apiHeaderTime,
                "X-Auth-Key": process.env.PODCAST_API_KEY,
                "Authorization": hash4Header,
                "User-Agent": `${process.env.USER_AGENT}`,
            },
        };
        const url = `${process.env.PODCAST_API_URL}/search/byterm?q=${encodeURIComponent(query as string)}`;
        const response = await fetch(url, options);
        const data = await response.json();

        const results = data?.feeds.map((doc: any) => {
            const podcast = {
                $type: Podcast.$type,
                podcastIndexId: doc.id,
                title: doc.title,
                author: [doc.author],
                description: doc.description,
                thumbnailUrl: doc.image || undefined,
                uri: doc.link ? ensureSecureUrl(doc.link) : undefined,
            } as Podcast.Type

            const result = cleanContentEntry(podcast)
            if (!Podcast.validate(result))
                throw Error("Retrieved podcast data is invalid")
            return result
        })

        res.json({ result: results || [] });
    } catch (error) {
        console.error("Failed to fetch podcast data:", error);
        res.status(500).json({ error: 'Failed to fetch podcast data' });
    }
});

router.get("/search/movie", async (req, res) => {
    try {
        if (!process.env.OMDB_API_URL || !process.env.OMDB_API_KEY) {
            res.status(500).json({ error: 'OMDB_API_URL and OMDB_API_KEY must be set on the server' })
            return
        }

        // check the query parameter
        const query = req.query.q
        if (!query) {
            res.status(400).json({ error: 'Query parameter is required' })
            return
        }

        // forward the query
        const url = `${process.env.OMDB_API_URL}?s=${encodeURIComponent(query as string)}&type=movie&apikey=${process.env.OMDB_API_KEY}`
        const options = {
            method: "get",
            headers: {
                "User-Agent": `${process.env.USER_AGENT}`
            }
        };
        const response = await fetch(url, options)
        const data = await response.json()

        const results = data?.Search.map((doc: any) => {
            const movie = {
                $type: Movie.$type,
                title: doc.Title,
                imdbId: doc.imdbID,
                datePublished: doc.Year,
                uri: `https://www.imdb.com/title/${doc.imdbID}`,
                thumbnailUrl: doc.Poster !== 'N/A' ? ensureSecureUrl(doc.Poster) : undefined,
            } as Movie.Type

            const result = cleanContentEntry(movie)
            if (!Movie.validate(result))
                throw Error("Retrieved movie data is invalid")
            return result
        })

        res.json({ result: results || [] })
    } catch (error) {
        console.error("Failed to fetch movie data:", error)
        res.status(500).json({ error: 'Failed to fetch movie data' })
    }
});

router.get("/search/tv", async (req, res) => {
    try {
        if (!process.env.OMDB_API_URL || !process.env.OMDB_API_KEY) {
            res.status(500).json({ error: 'OMDB_API_URL and OMDB_API_KEY must be set on the server' })
            return
        }

        // check the query parameter
        const query = req.query.q
        if (!query) {
            res.status(400).json({ error: 'Query parameter is required' })
            return
        }

        // forward the query
        const url = `${process.env.OMDB_API_URL}?s=${encodeURIComponent(query as string)}&type=series&apikey=${process.env.OMDB_API_KEY}`
        const options = {
            method: "get",
            headers: {
                "User-Agent": `${process.env.USER_AGENT}`
            }
        };
        const response = await fetch(url, options)
        const data = await response.json()

        const results = data?.Search.map((doc: any) => {
            const tvShow = {
                type: TvShow.$type,
                title: doc.Title,
                imdbId: doc.imdbID,
                datePublished: doc.Year,
                uri: `https://www.imdb.com/title/${doc.imdbID}`,
                thumbnailUrl: doc.Poster !== 'N/A' ? ensureSecureUrl(doc.Poster) : undefined,
            } as TvShow.Type

            const result = cleanContentEntry(tvShow)
            if (!TvShow.validate(result))
                throw Error("Retrieved tv series data is invalid")
            return result
        })

        res.json({ result: results || [] })
    } catch (error) {
        console.error("Failed to fetch tv series data:", error)
        res.status(500).json({ error: 'Failed to fetch tv series data' })
    }
});

export default router; 