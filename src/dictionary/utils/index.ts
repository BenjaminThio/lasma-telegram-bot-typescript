import fs from 'fs';

export interface Definition {
    id: number | string;
    partOfSpeech: string;
    meaning: string;
    examples: string[];
    synonyms: string[];
};

export interface Word {
    word: string;
    definitions: Definition[];
};

function searchInCorrespondingDatabase(word: string, firstLetter: string) {
    const filename = /[a-z]/.test(firstLetter) ? firstLetter + '.json' : '#.json';
    const filePath = `./dictionary/data/${filename}`;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    return data[word];
}

function search(searchText: string): Word | undefined {
    const word = searchText.trim().toLowerCase();
    const firstLetter: string = word.charAt(0);

    return searchInCorrespondingDatabase(word, firstLetter);
}

async function searchAsync(searchText: string): Promise<Word | undefined> {
    return new Promise((resolve) => {
        resolve(search(searchText));
    });
}

function listAllWords(): string[] {
    const result: string[] = [];
    const dirs = fs.readdirSync('./data', 'utf-8');

    dirs.map((dir: string) => {
        const raw = fs.readFileSync(`./data/${dir}`, 'utf-8');
        const data = JSON.parse(raw);

        result.push(...Object.keys(data));
    });

    return result;
}

async function listAllWordsAsync(): Promise<string[]> {
    return new Promise((resolve) => {
        resolve(listAllWords());
    });
}

function isExist(searchText: string): boolean {
    const word = searchText.trim().toLowerCase();
    const firstLetter: string = word.charAt(0);
    const filename = /[a-z]/.test(firstLetter) ? firstLetter + '.json' : '#.json';
    const filePath = `./data/${filename}`;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    return Boolean(data[word]);
}

async function isExistAsync(searchText: string): Promise<boolean> {
    return new Promise((resolve) => {
        resolve(isExist(searchText));
    });
}

export { search, searchAsync, listAllWords, listAllWordsAsync, isExist, isExistAsync };
