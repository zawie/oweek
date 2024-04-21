// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { computeTopology } from '../../helper/topology';

type ErrorResponse = {
  error: string
}

export type TopologyResult = {
    root: string,
    descendantCount: number,
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