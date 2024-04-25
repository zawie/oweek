import { getAssociatedFamilies } from "./db";
import { Family } from "./family";
import { normalize } from "./name";


export async function inferCollege(name: string): Promise<string> {
    const families = await getAssociatedFamilies(name);

    for (const f of families) {
        if (f.kids.map(normalize).includes(normalize(name))) {
            return f.college
        }
    }

    for (const f of families) {
        if (f.parents.map(normalize).includes(normalize(name))) {
            return f.college
        }
     }
 
    return ""
}

export async function inferYear(name: string): Promise<string> {
    const families = await getAssociatedFamilies(name);

    for (const f of families) {
        if (f.kids.map(normalize).includes(normalize(name))) {
            return f.year
       }
    }

    for (const f of families) {
        if (f.parents.map(normalize).includes(normalize(name))) {
            return String(Number(f.year) + 1)
        }
     }
 
    return ""
}