import { getAssociatedFamilies } from "./db";
import { Family } from "./family";
import { normalize } from "./name";


export function inferCollege(name: string, candidateFamiles: Family[]): string {
    for (const f of candidateFamiles) {
        if (f.kids.map(normalize).includes(normalize(name))) {
            return f.college
        }
    }

    for (const f of candidateFamiles) {
        if (f.parents.map(normalize).includes(normalize(name))) {
            return f.college
        }
     }
 
    return ""
}

export function inferYear(name: string, candidateFamiles: Family[]): string {
    for (const f of candidateFamiles) {
        if (f.kids.map(normalize).includes(normalize(name))) {
            return f.year.toString()
       }
    }

    for (const f of candidateFamiles) {
        if (f.parents.map(normalize).includes(normalize(name))) {
            return String(Number(f.year) + 1)
        }
     }
 
    return ""
}

export function createdAssociatedFamiliesIndex(families: Family[]): Map<string, Family[]> {
    const nameToFamilies = new Map<string, Family[]>()
    families.forEach(f => [f.parents, f.kids].flat().map(normalize).map(x => {
        if (nameToFamilies.get(x) == undefined) {
            nameToFamilies.set(x, [f])
        } else {
            nameToFamilies.get(x)?.push(f)
        }
     }))
    return nameToFamilies
}