import 'dotenv/config';
import crypto from 'crypto';
import { Router } from 'express';

const router = Router();

router.get("/get/podcast", async (req, res) => {
    try {
        if (!process.env.PODCAST_API_KEY || !process.env.PODCAST_API_SECRET) {
            res.status(500).json({ error: 'PODCAST_API_KEY and PODCAST_API_SECRET must be set on the server' })
            return
        }

        // check the query parameter
        const id = req.query.id
        if (!id) {
            res.status(400).json({ error: 'The podcast feed id is required' })
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
        const url = `${process.env.PODCAST_API_URL}/episodes/byfeedid?id=${encodeURIComponent(id as string)}`;

        const response = await fetch(url, options);
        const data = await response.json();
        const results = data?.items.map((doc: any) => {
            return {
                type: 'podcast_episode',
                name: doc.title,
                author: doc.author ? [doc.author] : [],
                description: doc.description,
                duration: doc.duration ? `PT${Math.floor(doc.duration / 60)}M${doc.duration % 60}S` : undefined,
                episodeNumber: doc.episode,
                seasonNumber: doc.season,
                podcastName: doc.podcastName || '',
                datePublished: new Date(doc.datePublished * 1000).toISOString(),
                url: doc.link,
                thumbnailUrl: doc.image,
            }
        })

        console.log(results)

        res.json({ results: results || [] });
    } catch (error) {
        console.error("Failed to fetch podcast data:", error);
        res.status(500).json({ error: 'Failed to fetch podcast data' });
    }
});

router.get("/get/movie", async (req, res) => {
    try {
        if (!process.env.OMDB_API_URL || !process.env.OMDB_API_KEY) {
            res.status(500).json({ error: 'OMDB_API_URL and OMDB_API_KEY must be set on the server' })
            return
        }

        // check the query parameter
        const id = req.query.id
        if (!id) {
            res.status(400).json({ error: 'The IMDB id of the requested movie is required' })
            return
        }

        // forward the query
        const url = `${process.env.OMDB_API_URL}?i=${encodeURIComponent(id as string)}&type=movie&apikey=${process.env.OMDB_API_KEY}`
        const options = {
            method: "get",
            headers: {
                "User-Agent": `${process.env.USER_AGENT}`
            }
        };
        const response = await fetch(url, options)
        const data = await response.json()
        const entry = {
            type: data.Type === 'movie',
            name: data.Title,
            description: data.Plot,
            genre: data.Genre,
            actors: data.Actors.split(',').map((a: string) => a.trim()),
            director: data.Director.split(',').map((a: string) => a.trim()),
            writer: data.Writer.split(',').map((a: string) => a.trim()),
            datePublished: data.Year,
            imdbId: data.imdbID,
            url: `https://www.imdb.com/title/${data.imdbID}`,
            thumbnailUrl: data.Poster !== 'N/A' ? data.Poster : undefined,
        }
        // Remove any undefined values
        const result = Object.fromEntries(
            Object.entries(entry).filter(([_, value]) => value !== undefined)
        )

        res.json({ result: result || {} })
    } catch (error) {
        console.error("Failed to fetch movie data:", error)
        res.status(500).json({ error: 'Failed to fetch movie data' })
    }
})

router.get("/get/tv", async (req, res) => {
    try {
        if (!process.env.OMDB_API_URL || !process.env.OMDB_API_KEY) {
            res.status(500).json({ error: 'OMDB_API_URL and OMDB_API_KEY must be set on the server' })
            return
        }

        // check the query parameter
        const id = req.query.id
        if (!id) {
            res.status(400).json({ error: 'The IMDB id of the requested tv series is required' })
            return
        }

        // forward the query
        const url = `${process.env.OMDB_API_URL}?i=${encodeURIComponent(id as string)}&type=series&apikey=${process.env.OMDB_API_KEY}`
        const options = {
            method: "get",
            headers: {
                "User-Agent": `${process.env.USER_AGENT}`
            }
        };
        const response = await fetch(url, options)
        const data = await response.json()
        const entry = {
            type: data.Type === 'tv_show',
            name: data.Title,
            description: data.Plot,
            genre: data.Genre,
            actors: data.Actors.split(',').map((a: string) => a.trim()),
            director: data.Director.split(',').map((a: string) => a.trim()),
            writer: data.Writer.split(',').map((a: string) => a.trim()),
            datePublished: data.Year,
            imdbId: data.imdbID,
            url: `https://www.imdb.com/title/${data.imdbID}`,
            thumbnailUrl: data.Poster !== 'N/A' ? data.Poster : undefined,
        }
        // Remove any undefined values
        const result = Object.fromEntries(
            Object.entries(entry).filter(([_, value]) => value !== undefined)
        )

        res.json({ result: result || {} })
    } catch (error) {
        console.error("Failed to fetch tv series data:", error)
        res.status(500).json({ error: 'Failed to fetch tv series data' })
    }
});

export default router; 