function min(a: number, b:number): number {
    return a < b ? a : b;
}

function jacardSimilarity<T>(set0: Set<T>, set1: Set<T>): number {
        const intersection = new Set<T>();
        set0.forEach(x => set1.has(x) && intersection.add(x));
        if (intersection.size == 0)
            return 0;
        const union= new Set<T>();
        [set0, set1].forEach(s => s.forEach(x => union.add(x)));
        return intersection.size / union.size;
}

function grammify(str: string, k: number = 3): Set<string> {
    const grams = new Set<string>();
    for (let i = 0; i <= str.length - k; i++) 
        grams.add(str.substring(i,i+k));
    return grams;
}

export function stringSimilarity(str0: string, str1: string): number {
    if (str0.length*str1.length == 0) {
        return str0.length+str1.length > 0 ? 0 : 1;
    }
    const k = min(3, min(str0.length, str1.length))
    return jacardSimilarity(grammify(str0, k),grammify(str1,k));
}
