import { $Typed } from "../../lexicon/util";
import * as Lexicon from "../../lexicon/types/app/lofisky/library/content/movie";

type Type = $Typed<Lexicon.Main>
const isType = Lexicon.isMain;
const $type = "app.lofisky.library.content.movie" as Type['$type'];

export { type Type, isType, $type };