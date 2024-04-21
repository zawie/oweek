import { Family } from "./family";


export function inferCollege(name: string, families: Family[]): string {
    for (const f of families) {
        if (f.kids.map(k => k.toLowerCase()).includes(name.toLowerCase())) {
            return f.college
        }
    }

    for (const f of families) {
        if (f.parents.map(p => p.toLowerCase()).includes(name.toLowerCase())) {
            return f.college
        }
     }
 
    return ""
}

export function inferYear(name: string, families: Family[]): string {
    for (const f of families) {
        if (f.kids.map(k => k.toLowerCase()).includes(name.toLowerCase())) {
            return f.year
       }
    }

    for (const f of families) {
        if (f.parents.map(p => p.toLowerCase()).includes(name.toLowerCase())) {
            return String(Number(f.year) + 1)
        }
     }
 
    return ""
}