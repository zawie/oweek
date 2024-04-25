import { getAssociatedFamilies } from "./db";
import { Family } from "./family";

type Topology = {
    descendants: Set<string>,
    generationsAfter: number,
}
let cachedTopology: Map<string, Topology> = new Map<string, Topology>();

export async function computeTopology(name: string): Promise<Topology> {
    if (cachedTopology.has(name)) {
        return cachedTopology.get(name) as Topology;
    }

    const topo: Topology = {
        descendants: new Set<string>(),
        generationsAfter: 0,
    }

    const children = await getAssociatedFamilies(name).then(families => 
        families.filter(f => f.parents.includes(name))
            .map(f => f.kids)
            .flat()
    )
    
    for (let k of children) {
        const t = await computeTopology(k);
        topo.generationsAfter = Math.max(topo.generationsAfter, t.generationsAfter + 1);
        topo.descendants = new Set([...Array.from(topo.descendants), ...Array.from(t.descendants), k]);
    }

    cachedTopology.set(name, topo)
    return topo;
}