import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/xyz/groundmist/library/content/book';

type Type = $Typed<Lexicon.Main>
const $type = "xyz.groundmist.library.content.book" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };