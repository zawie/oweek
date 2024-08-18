// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getClient, getAllFamilies, getPeople } from '../../helper/db'

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
    const kv = getClient(true)
    const [families, students] = await Promise.all([getAllFamilies(kv), getPeople(kv)]) 

    res.status(200).json({
        num_families: families.length,
        num_students: students.length
    })
}