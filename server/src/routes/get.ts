import 'dotenv/config';
import crypto from 'crypto';
import { Router } from 'express';
import getHTML from 'html-get';
import createBrowser from 'browserless';
import metascraper from 'metascraper';
import metascraperAuthor from 'metascraper-author';
import metascraperDate from 'metascraper-date';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperPublisher from 'metascraper-publisher';
import metascraperTitle from 'metascraper-title';
import metascraperUrl from 'metascraper-url';
import { Movie, TvShow, PodcastEpisode, Uri } from '#/types/content'

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
            const podcastEpisode = {
                $type: PodcastEpisode.$type,
                title: doc.title,
                author: doc.author ? [doc.author] : [],
                description: doc.description,
                duration: doc.duration ? `PT${Math.floor(doc.duration / 60)}M${doc.duration % 60}S` : undefined,
                episodeNumber: doc.episode,
                seasonNumber: doc.season,
                podcastName: doc.podcastName || '',
                datePublished: new Date(doc.datePublished * 1000).toISOString(),
                uri: ensureSecureUrl(doc.link),
                thumbnailUrl: ensureSecureUrl(doc.image),
            } as PodcastEpisode.Type

            // Remove any undefined values
            const result = Object.fromEntries(
                Object.entries(podcastEpisode).filter(([_, value]) => value !== undefined)
            )
            if (!PodcastEpisode.validate(result))
                throw Error("Retrieved podcast episode data is invalid")
            return result
        })

        res.json({ result: results || [] });
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
            $type: Movie.$type,
            title: data.Title,
            description: data.Plot,
            genre: data.Genre,
            actors: data.Actors.split(',').map((a: string) => a.trim()),
            director: data.Director.split(',').map((a: string) => a.trim()),
            writer: data.Writer.split(',').map((a: string) => a.trim()),
            datePublished: data.Year,
            imdbId: data.imdbID,
            uri: `https://www.imdb.com/title/${data.imdbID}`,
            thumbnailUrl: data.Poster !== 'N/A' ? ensureSecureUrl(data.Poster) : undefined,
        } as Movie.Type

        // Remove any undefined values
        const result = Object.fromEntries(
            Object.entries(entry).filter(([_, value]) => value !== undefined)
        )
        if (!Movie.validate(result))
            throw Error("Retrieved movie data is invalid")

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
            $type: TvShow.$type,
            title: data.Title,
            description: data.Plot,
            genre: data.Genre,
            actors: data.Actors.split(',').map((a: string) => a.trim()),
            director: data.Director.split(',').map((a: string) => a.trim()),
            writer: data.Writer.split(',').map((a: string) => a.trim()),
            datePublished: data.Year,
            imdbId: data.imdbID,
            uri: `https://www.imdb.com/title/${data.imdbID}`,
            thumbnailUrl: data.Poster !== 'N/A' ? ensureSecureUrl(data.Poster) : undefined,
        } as TvShow.Type

        // Remove any undefined values
        const result = Object.fromEntries(
            Object.entries(entry).filter(([_, value]) => value !== undefined)
        )
        if (!TvShow.validate(result))
            throw Error("Retrieved tv series data is invalid")

        res.json({ result: result || {} })
    } catch (error) {
        console.error("Failed to fetch tv series data:", error)
        res.status(500).json({ error: 'Failed to fetch tv series data' })
    }
});

interface UrlMetadata {
    author?: string;
    date?: string;
    description?: string;
    image?: string;
    publisher?: string;
    title?: string;
    url?: string;
}

router.get("/get/url", async (req, res) => {
    try {
        const url = req.query.url as string;
        if (!url) {
            res.status(400).json({ error: 'URL parameter is required' });
            return;
        }

        const browser = createBrowser();
        const browserContext = browser.createContext();

        const { html } = await getHTML(url, {
            getBrowserless: () => browserContext
        });

        const scraper = metascraper([
            metascraperAuthor(),
            metascraperDate(),
            metascraperDescription(),
            metascraperImage(),
            metascraperPublisher(),
            metascraperTitle(),
            metascraperUrl()
        ]);

        const metadata: UrlMetadata = await scraper({ html, url });

        // Clean up browser resources
        // TODO: the docs claim this is required, but it gives an error
        // browserContext.destroyContext()
        await browser.close()

        let entry = {
            $type: 'app.vercel.contentarchive.content.uri',
            author: metadata.author?.split(',').map((a: string) => a.trim()),
            title: metadata.title,
            description: metadata.description,
            publicationDate: metadata.date,
            publisher: metadata.publisher,
            uri: ensureSecureUrl(metadata.url || url),
            thumbnailUrl: metadata.image ? ensureSecureUrl(metadata.image) : undefined,
        } as Uri.Type

        // TODO: add content type handling
        // infer granular content subtype from url
        // if (url.includes('x.com') || url.includes('twitter.com') || url.includes('bsky.app') || url.includes('mastodon.social')) {
        //     entry = {
        //         ...entry,
        //         $type: 'app.vercel.contentarchive.content.thread'
        //     } as ThreadData
        // } else if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('tiktok.com') || url.includes('vimeo.com') || url.includes('twitch.tv')) {
        //     entry = {
        //         ...entry,
        //         $type: 'app.vercel.contentarchive.content.video'
        //     } as VideoData
        // } else if (url.includes('arxiv.org') || url.includes('eprint.iacr.org')) {
        //     entry = {
        //         ...entry,
        //         $type: 'app.vercel.contentarchive.content.paper'
        //     } as PaperData
        //     // TODO: add article type handling
        //     // TODO: add code type
        //     // } else if (url.includes('github.com') || url.includes('gitlab.com') || url.includes('bitbucket.org')) {
        //     //     entry.type = 'code'
        //     //     entry = entry as CodeData
        // } else {
        //     entry = entry as UriData
        // }

        // Remove any undefined values
        const result = Object.fromEntries(
            Object.entries(entry).filter(([_, value]) => value !== undefined)
        )
        if (!Uri.validate(result))
            throw Error("Retrieved URI data is invalid")

        res.json({ result: result });
    } catch (error) {
        console.error("Failed to fetch URL metadata:", error);
        res.status(500).json({ error: 'Failed to fetch URL metadata' });
    }
});

const ensureSecureUrl = (url: string) => {
    url.replace('http://', 'https://')
    return url
}

export default router; 