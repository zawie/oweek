// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { computeTopology } from '../../helper/topology';
import { inferCollege, inferYear } from '../../helper/infer';
import { getPeople } from '../../helper/db';

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
    const people: string[] = await getPeople();

    let ranking = [] 
    for (const student of people) {
        ranking.push({
            student: student, 
            firstInCollege: false,
            descendentCount: (await computeTopology(student)).descendants.size
        } as LeaderbaordEntry)
    }   

    ranking = ranking.filter(e => e.descendentCount > 100)
    ranking.sort((a, b) => b.descendentCount - a.descendentCount)

    let colleges = new Set<string>()
    await Promise.all(ranking.map(async e => {
        e.college = await inferCollege(e.student)
        e.year = await inferYear(e.student)
        if (!colleges.has(e.college)) {
            e.firstInCollege = true
            colleges.add(e.college)
        }
        return e
    }))

    res.status(200).json({
       ranking
    })
}

