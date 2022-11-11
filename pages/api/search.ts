// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { getSimilarNames, getRandomName, getNameSimilarity} from '../../helper/name';

export type SearchRequest = {
  query?: string,
  exact?: boolean,
  random?: boolean,
}

export type SearchResult = {
    queryMade?: string,
    focusName: string,
    homeFamilies: Family[],
    newphewFamilies: Family[],
    parentFamilies: Family[],
    grandFamilies: Family[],
}

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {
    const {query, exact, random}: SearchRequest = req.query
  
    const families: Family[] = await getFamilies();
    
    //Find closest name to query
    let name: string;
    if (random) {
      name = await getRandomName(families);
    } else {
      if (query == undefined) 
        return res.status(400).json({
            error: "Expected query, but none provided!"
        });
      const simNames = await getSimilarNames(query, families);
      if (simNames.length > 0) {
        name = simNames[0];
      } else {
        name = query;
      }
      console.log(query.toLowerCase(), name.toLowerCase())
      if (getNameSimilarity(query.toLowerCase(), name.toLowerCase()) <= 0.1) {
        console.log("not similar")
        return res.status(200).json({
          focusName: name, 
          queryMade: query,
          homeFamilies: [],
          newphewFamilies: [],
          parentFamilies: [],
          grandFamilies: [],
       })
      }
    }

    //Find all families associated with this name
    const homeFamilies = families.filter(f => f.kids.map(s => s.toLowerCase()).includes(name));
    const parentFamilies = families.filter(f => f.parents.map(s => s.toLowerCase()).includes(name));

    let kids: string[] = [];
    parentFamilies.forEach(f => kids = kids.concat(f.kids));
    const grandFamilies = families.filter(f => 
      f.parents.some(p => kids.includes(p))
    );

    let siblings: string[] = [];
    homeFamilies.forEach(f => siblings = siblings.concat(f.kids));
    const newphewFamilies = families.filter(f => 
      f.parents.some(p => siblings.includes(p))
    );
    
    res.status(200).json({
        focusName: name, 
        queryMade: query,
        homeFamilies,
        newphewFamilies,
        parentFamilies, 
        grandFamilies
    })
}