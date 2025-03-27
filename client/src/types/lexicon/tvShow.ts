import { $Typed } from "../../lexicon/util";
import * as Lexicon from "../../lexicon/types/xyz/groundmist/library/content/tvShow";

type Type = $Typed<Lexicon.Main>
const isType = Lexicon.isMain;
const $type = "xyz.groundmist.library.content.tvShow" as Type['$type'];

export { type Type, isType, $type };