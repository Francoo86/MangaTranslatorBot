import { Translator } from "./interfaces";

const TRANSLATORS : Translator[] = [
    {name: "Google Translate", value: "google"},
    {name: "DeepL", value: "deepl"},
    //{name: "GPT-3.5", value: "gpt3.5"},
    {name: "M2M-100", value: "m2m100"},
    {name: "M2M-100 Big", value: "m2m100_big"},
    {name: "Sugoi (only English supported)", value: "sugoi"},
    //maybe i will add bing
]

export { TRANSLATORS };