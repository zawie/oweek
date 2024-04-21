// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { getSimilarNames, getRandomName} from '../../helper/name';

type ErrorResponse = {
  error: string
}

export type TopologyResult = {
    root: string,
    descendantCount: number,
    generationsAfter: number,
}

type Topology = {
    descendants: Set<string>,
    generationsAfter: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TopologyResult | ErrorResponse>
) {
    const {name}: {name? : string} = req.query
  
    const families: Family[] = await getFamilies();
    
    const t = computeTopology(name || "", families)
    res.status(200).json({
        root: name || "",
        generationsAfter: t.generationsAfter,
        descendantCount: t.descendants.size
    })
}


let cachedTopology: Map<string, Topology> = new Map<string, Topology>();

function computeTopology(name: string, families :Family[]): Topology {
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