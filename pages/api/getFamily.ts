// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { stringSimilarity } from '../../helper/similarity';
import { Family, getFamilies } from '../../helper/family';

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    focusName: string,
    homeFamilies: Family[],
    advisingFamilies:Family[]
}

async function getClosestName(query: string): Promise<string> {
    let bestMatch: string = query;
    let best: number = 0;

    const q = query.toLowerCase();

    if (q == "zawie") 
        return "Adam Zawierucha"

    const families: Family[] = await getFamilies();
    console.log("Num families", families.length);

    families.forEach(f =>
        f.kids.concat(f.parents).forEach((name: string) => {
            const n = name.toLowerCase();
            if (n == q) {
                best = 1
                bestMatch = name
            } else {
                //Compute entire similarity
                const totalSim = stringSimilarity(q, n);

                //Compute partial similarity
                let partialSim = 0;
                const parts = n.split(/ /);
                parts.forEach(p => partialSim += stringSimilarity(p, q)/parts.length);
                
                const sim = totalSim*0.5 + partialSim*0.5
                if (sim > best) {
                    best = sim;
                    bestMatch = name;
                }
            }
            
                
        })
    );

    // console.log(best, bestMatch, query)
    if (best < 0.15)
        return query
    return bestMatch;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {
    const {query}: {query? : string} = req.query

    if (query == undefined) {
        res.status(400).json({
            error: "no query not specified"
        });
        return;
    }

    const name:string = await getClosestName(query);

    //Get all families from sheets
    const families: Family[] = await getFamilies();
    const homeFamilies = families.filter(f => f.kids.includes(name));
    const advisingFamilies = families.filter(f => f.parents.includes(name));

    res.status(200).json({
        focusName: name, advisingFamilies, homeFamilies
    })
}