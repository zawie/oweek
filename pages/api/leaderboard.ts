// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { computeTopology, personToKids } from '../../helper/topology';
import { createdAssociatedFamiliesIndex, inferCollege, inferYear } from '../../helper/infer';
import { getAllFamilies, getPeople } from '../../helper/db';
import { denormalize } from '../../helper/name';
import { track } from '@vercel/analytics/server';

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
    const analyticsPromise = track("Leaderboard")
    const t0 = Date.now()
    const [people, families] = await Promise.all([getPeople(), getAllFamilies()])
    const t1 = Date.now()
    console.log("time to gather from db", t1 - t0)

    const chunkSize = 1;
    let ranking: LeaderbaordEntry[] = []
    let rankingMaxLength = 100
    const nameToKids = personToKids(families)
    for (let i = 0; i < people.length; i += chunkSize) {
        const batch = people.slice(i, i + chunkSize);
        let partialRanking = await Promise.all(batch.map(async student => {
            return {
                student: denormalize(student, families), 
                firstInCollege: false,
                descendentCount: (await computeTopology(student, nameToKids)).descendants.size
            } as LeaderbaordEntry
        }))
        
        ranking = ranking.concat(partialRanking)
        ranking.sort((a, b) => b.descendentCount - a.descendentCount)
        ranking = ranking.slice(0, rankingMaxLength);
    }
    const t2 = Date.now()
    console.log("time to get rankings", t2 - t1)

    console.log("rankings", ranking.length)
    let colleges = new Set<string>()
    const index = createdAssociatedFamiliesIndex(families)
    for (let i = 0; i < ranking.length; i++) {
        const e = ranking[i]
        e.college = inferCollege(e.student, index.get(e.student) || [])
        e.year = inferYear(e.student, index.get(e.student) || [])
        if (!colleges.has(e.college)) {
            e.firstInCollege = true
            colleges.add(e.college)
        }
   }
   const t3 = Date.now()
   console.log("time to finalize", t3 - t2)
   console.log("colleges", colleges)

    await analyticsPromise
    
    res.status(200).json({
       ranking
    })
}