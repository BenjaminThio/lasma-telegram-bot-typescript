export function GetRandomUniqueNumbersFromRange(count: number, start: number, ends?: number): number[] {
    const numbers: number[] = [];

    for (let i: number = (typeof ends === 'number' ? start : 1); i <= (typeof ends === 'number' ? ends : start); i++) {
        numbers.push(i);
    }

    for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

    return numbers.slice(0, count);
}

export function groupArray(arr: any[], groupSize: number): any[] {
    const result: any[] = [];

    for (let i: number = 0; i < arr.length; i += groupSize) {
        result.push(arr.slice(i, i + groupSize));
    }

    return result;
}

export const exists = (a: any[][], b: any[]): boolean =>
	a.some(
		(arr: any[]) =>
			arr.length === b.length &&
			arr.every((value, index) => value === b[index])
	);

export const isEqual = (a: any[], b: any[]): boolean => (a.length >= b.length ? a : b).every((value, index) => value === (a.length >= b.length ? b : a)[index]);

export const indexOf = (a: any[][], b: any[]): number => {
    for (let i: number = 0; i < a.length; i++) {
        if (a[i].length === b.length && a[i].every((value, index) => value === b[index])) return i;
    }
    return -1;
};