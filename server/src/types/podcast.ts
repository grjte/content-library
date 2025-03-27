import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/xyz/groundmist/library/content/podcast';

type Type = $Typed<Lexicon.Main>
const $type = "xyz.groundmist.library.content.podcast" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };