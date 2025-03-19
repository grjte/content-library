import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/app/lofisky/library/content/podcast';

type Type = $Typed<Lexicon.Main>
const $type = "app.lofisky.library.content.podcast" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };