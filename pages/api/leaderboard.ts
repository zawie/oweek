// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { computeTopology } from '../../helper/topology';
import { inferCollege, inferYear } from '../../helper/infer';

type ErrorResponse = {
  error: string
}

export type LeaderbaordEntry = {
    student: string,
    college?: string,
    year?: string,
    firstInCollege: boolean,
    descendentCount: number
}

export type LeaderboardResult = {
    ranking: LeaderbaordEntry[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResult | ErrorResponse>
) {
    const {name}: {name? : string} = req.query
  
    const families: Family[] = await getFamilies();
    const students: Set<string> = new Set<string>();
    families.forEach(f => f.kids.concat(f.parents).forEach(x => students.add(x)))

    let ranking = Array.from(students).map(student => {
        return {
            student: student, 
            firstInCollege: false,
            descendentCount: computeTopology(student, families).descendants.size
        } as LeaderbaordEntry
    })

    ranking = ranking.filter(e => e.descendentCount > 100)
    ranking.sort((a, b) => b.descendentCount - a.descendentCount)

    let colleges = new Set<string>()
    ranking.map( e => {
        e.college = inferCollege(e.student, families)
        e.year = inferYear(e.student, families)
        if (!colleges.has(e.college)) {
            e.firstInCollege = true
            colleges.add(e.college)
        }
        return e
    })


    res.status(200).json({
       ranking
    })
}

