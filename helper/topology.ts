import { Family } from "./family";

type Topology = {
    descendants: Set<string>,
    generationsAfter: number,
}
let cachedTopology: Map<string, Topology> = new Map<string, Topology>();

export function computeTopology(name: string, families :Family[]): Topology {
    if (cachedTopology.has(name)) {
        return cachedTopology.get(name) as Topology;
    }

    const parentFamilies = families.filter(f => f.parents.includes(name));
    const topo: Topology = {
        descendants: new Set<string>(),
        generationsAfter: 0,
    }

    parentFamilies.forEach(f => {
        f.kids.forEach(k => {
            const t = computeTopology(k, families);
            topo.generationsAfter = Math.max(topo.generationsAfter, t.generationsAfter + 1);
            topo.descendants = new Set([...Array.from(topo.descendants), ...Array.from(t.descendants), k]);
        })
    });


    cachedTopology.set(name, topo)
    return topo;
}