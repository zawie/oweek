import { Family } from "./family";
import { normalize } from "./name";

type Topology = {
    descendants: Set<string>,
    generationsAfter: number,
}
let cachedTopology = new Map<string, Promise<Topology>>();

export async function computeTopology(name: string, nameToKids: Map<string, string[]>): Promise<Topology> {
    if (cachedTopology.has(name)) {
        return cachedTopology.get(name) as Promise<Topology>;
    }
    return cachedTopology.set(name, new Promise<Topology>(async (resolve) => {
        const topo: Topology = {
            descendants: new Set<string>(),
            generationsAfter: 0,
        }
        
        const kids = nameToKids.get(normalize(name)) || []
        await Promise.all(kids.map(k => {
            computeTopology(k, nameToKids).then(t => {
                topo.generationsAfter = Math.max(topo.generationsAfter, t.generationsAfter + 1);
                topo.descendants = new Set([...Array.from(topo.descendants), ...Array.from(t.descendants), k]);
            })
        }))
          
        resolve(topo);
    })).get(name) as Promise<Topology>
}

export function personToKids(families: Family[]): Map<string, string[]> {
    const nameToKids = new Map<string, string[]>();
    families.forEach(f => f.parents.map(normalize).map(p => {
        nameToKids.set(p, f.kids.map(normalize).concat(nameToKids.get(p) || []))
     })
    )
    return nameToKids
}