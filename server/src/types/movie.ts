import { $Typed } from "#/lexicon/util";
import * as Lexicon from '#/lexicon/types/app/lofisky/library/content/movie';

type Type = $Typed<Lexicon.Main>
const $type = "app.lofisky.library.content.movie" as Type['$type'];
const validate = Lexicon.validateMain

export { Type, $type, validate };