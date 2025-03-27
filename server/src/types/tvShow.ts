import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/xyz/groundmist/library/content/tvShow';

type Type = $Typed<Lexicon.Main>
const $type = "xyz.groundmist.library.content.tvShow" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };