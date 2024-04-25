import { colleges } from "./rice";
import { Row, getGoogleSheetsRows } from "./sheets";
import { stringSimilarity } from './similarity';

export type Family = {
    name: string,
    parents: string[],
    kids: string[],
    year: string,
    college: string,
    createdAt: Date,
    uuid?: string,
}

export async function fetchFamilies(): Promise<Family[]> {
    let rows: Row[] = await getGoogleSheetsRows();

    // Filter out duplicate names (keep first instance)
    const usedNames: Set<string> = new Set<string>();
    rows = rows.reverse().filter((row: Row) => {
        const name = row.name.toLowerCase().replace(/&/, 'and'); 
        let isUsed: boolean = usedNames.has(name);
        if (!isUsed) {
            //@ts-ignore
            for (const u of usedNames.values()) {
                const sim = stringSimilarity(u, name); 
                //Consider very similar oweek group names as the same
                // console.log(u, name, sim);
                if (sim > 0.7) {
                    isUsed = true;
                    break;
                }
            }
        }
        usedNames.add(name);
        return !isUsed;
    })

    // Turn Rows into Families
    return rows.map(r => {
        return {
            name: r.name,
            year: r.year,
            parents: r.parents.split(/,+/).map(s=> s.trim()).filter(s => s.length > 0),
            kids: r.kids.split(/,+/).map(s=> s.trim()).filter(s => s.length > 0),
            college: r.college,
            createdAt: r.timestamp,
        };
    })
}


type ValidateResponse = {
    valid: boolean,
    errors: string[]
}

export function validate(family: Family): ValidateResponse {

    let valid = true
    let errors: string[] = []

    if (!colleges.includes(family.college)) {
        valid = false
        errors.push("Invalid college")
     }

     if (family.name.length == 0) {
        valid = false
        errors.push("Family must have a name")
     }

     if (family.parents.length == 0) {
        valid = false
        errors.push("Family must have at least one parent")
     }

     if (family.kids.length == 0) {
        valid = false
        errors.push("Family must have at least one kid")
     }

     return {
        valid, errors
     }
}