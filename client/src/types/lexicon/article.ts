import { $Typed } from "../../lexicon/util";
import * as Lexicon from "../../lexicon/types/xyz/groundmist/library/content/article";

type Type = $Typed<Lexicon.Main>
const isType = Lexicon.isMain;
const $type = "xyz.groundmist.library.content.article" as Type['$type'];

export { type Type, isType, $type };