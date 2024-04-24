import { getAssociatedFamilies } from "./db";
import { Family } from "./family";


export async function inferCollege(name: string): Promise<string> {
    const families = await getAssociatedFamilies(name);

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

export async function inferYear(name: string): Promise<string> {
    const families = await getAssociatedFamilies(name);

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