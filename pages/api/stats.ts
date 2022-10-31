// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';

type ErrorResponse = {
  error: string
}

export type StatsResults = {
    num_families: number,
    num_students: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResults | ErrorResponse>
) {  
    const families: Family[] = await getFamilies();

    const students: Set<string> = new Set<string>();
    families.forEach(f => f.kids.concat(f.parents).forEach(x => students.add(x)))
    
    res.status(200).json({
        num_families: families.length,
        num_students: students.size
    })
}