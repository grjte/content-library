import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/app/vercel/contentarchive/content/podcastEpisode';

type Type = $Typed<Lexicon.Main>
const $type = "app.vercel.contentarchive.content.podcastEpisode" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };