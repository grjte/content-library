import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/xyz/groundmist/library/content/movie';

type Type = $Typed<Lexicon.Main>
const $type = "xyz.groundmist.library.content.movie" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };