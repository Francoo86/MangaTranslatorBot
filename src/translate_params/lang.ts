interface Language {
    name: string;
    value: string;
}

const LANG_MAP: Language[] = [
    { name: "简体中文", value: "CHS" },
    { name: "繁體中文", value: "CHT" },
    { name: "日本語", value: "JPN" },
    { name: "English", value: "ENG" },
    { name: "한국어", value: "KOR" },
    { name: "Tiếng Việt", value: "VIN" },
    { name: "čeština", value: "CSY" },
    { name: "Nederlands", value: "NLD" },
    { name: "français", value: "FRA" },
    { name: "Deutsch", value: "DEU" },
    { name: "magyar nyelv", value: "HUN" },
    { name: "italiano", value: "ITA" },
    { name: "polski", value: "PLK" },
    { name: "português", value: "PTB" },
    { name: "limba română", value: "ROM" },
    { name: "русский язык", value: "RUS" },
    { name: "español", value: "ESP" },
    { name: "Türk dili", value: "TRK" },
    { name: "Indonesia", value: "IND" }
];

// Export the LANG_MAP
export { LANG_MAP };
