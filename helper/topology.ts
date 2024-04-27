import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { Family } from "./family";
import { normalize } from "./name";

type Topology = {
    descendants: Set<string>,
    generationsAfter: number,
}
let cachedTopology: Map<string, Topology> = new Map<string, Topology>();

export async function computeTopology(name: string, families: Family[]): Promise<Topology> {
    const normalName = normalize(name);
    if (cachedTopology.has(normalName)) {
        return cachedTopology.get(normalName) as Topology;
    }

    const kids = families.filter(f => f.parents.map(normalize).includes(normalName))
            .map(f => f.kids)
            .flat()

    const topo =  await Promise.all(
        kids.map(async k => computeTopology(k, families)))
        .then((results) => 
            results.reduce((acc, r) => {
                r.descendants.forEach(d => acc.descendants.add(d))
                acc.generationsAfter = Math.max(acc.generationsAfter, r.generationsAfter + 1)
                return acc;
            }, { descendants: new Set<string>(kids), generationsAfter: 0 } as Topology)
        )       

    cachedTopology.set(normalName, topo)
    return topo;
}