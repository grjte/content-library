import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/app/vercel/contentarchive/content/movie';

type Type = $Typed<Lexicon.Main>
const $type = "app.vercel.contentarchive.content.movie" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };