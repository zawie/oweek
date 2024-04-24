export function parseNJson<T>(njson: string): T[] {
    return njson.split('\n')
        .filter(l => l.length > 0)
        .map(l => JSON.parse(l) as T)
}