import { Family } from "./family";
import { normalize } from "./name";

type Topology = {
    descendants: Set<string>,
    generationsAfter: number,
}
let cachedTopology: Map<string, Topology> = new Map<string, Topology>();

export function computeTopology(name: string, families: Family[]): Topology {
    if (cachedTopology.has(name)) {
        return cachedTopology.get(name) as Topology;
    }

    const topo: Topology = {
        descendants: new Set<string>(),
        generationsAfter: 0,
    }


     families.filter(f => f.parents.map(normalize).includes(normalize(name)))
            .map(f => f.kids)
            .flat()
            .forEach(k => {
                const t = computeTopology(k, families);
                topo.generationsAfter = Math.max(topo.generationsAfter, t.generationsAfter + 1);
                topo.descendants = new Set([...Array.from(topo.descendants), ...Array.from(t.descendants), k]);
            })

    cachedTopology.set(name, topo)
    return topo;
}