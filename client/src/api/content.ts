import { Content, Movie, TvShow, PodcastEpisode, Uri, LexiconId } from "../types/content"

export const searchContent = async (contentType: LexiconId, query: string): Promise<Content[]> => {
    // get the API path from the end of the lexicon id
    let path = contentType.split('.').pop()
    if (path === "podcastEpisode") {
        path = "podcast"
    } else if (path === "tvShow") {
        path = "tv"
    }

    // search the API for the query
    const url = `https://${import.meta.env.VITE_APP_SERVER_URL}/api/search/${path}?q=${encodeURIComponent(query)}`
    const options = {
        method: "get",
    }
    const response = await fetch(url, options);
    const data = await response.json();

    return data?.results || []
}

export const getOmdbRecord = async (contentType: typeof Movie.$type | typeof TvShow.$type, imdbID: string): Promise<Movie.Type | TvShow.Type> => {
    const type = Movie.isType(contentType) ? "movie" : "tv"
    const url = `https://${import.meta.env.VITE_APP_SERVER_URL}/api/get/${type}?id=${encodeURIComponent(imdbID)}`
    const options = {
        method: "get",
    }
    const response = await fetch(url, options);
    const data = await response.json();

    return data?.result || {}
}

export const getPodcastEpisodes = async (podcastId: string): Promise<PodcastEpisode.Type[]> => {
    const url = `https://${import.meta.env.VITE_APP_SERVER_URL}/api/get/podcast?id=${encodeURIComponent(podcastId)}`
    const options = {
        method: "get",
    }
    const response = await fetch(url, options);
    const data = await response.json();

    return data?.results || []
}

export const getUrlContent = async (urlInput: string, urlTitle: string): Promise<Uri.Type> => {
    const url = `https://${import.meta.env.VITE_APP_SERVER_URL}/api/get/url?url=${encodeURIComponent(urlInput)}`
    const options = {
        method: "get",
    }
    const response = await fetch(url, options);
    let content = await response.json();

    if (urlTitle !== "") {
        content.result.name = urlTitle;
    }

    return content.result;
}