import { Row, getGoogleSheetsRows } from "./sheets";
import { stringSimilarity } from './similarity';

export type Family = {
    name: string,
    parents: string[],
    kids: string[],
    year: string,
    college: string
}

async function fetchFamilies(): Promise<Family[]> {
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
        };
    })
}

let cachedFamilies: Family[]
let lastRefresh: number = 0
const TLT = 3*60*1000 //Time to live: 3 minutes

export async function getFamilies(): Promise<Family[]> {
    const t = new Date().getTime();
    if (cachedFamilies == undefined) {
        console.log("No families cached. Fetching and awaiting.")
        // Nothing is cached, so we have to wait to fetch a family.
        lastRefresh = t;
        cachedFamilies = await fetchFamilies();
    } else if (lastRefresh + TLT < t) {
        console.log("Family cache out of data. Asynchronously updating (not awaiting).")
        // Cache is out of date, trigger async refresh
        lastRefresh = t; // Assumes refreshing takes less than TLT
        fetchFamilies().then(families => {
            lastRefresh = new Date().getTime();
            cachedFamilies = families
            console.log("Family cache refreshed!")
        });
    } 
    return cachedFamilies;
}