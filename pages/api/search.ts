// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { getSimilarNames, getRandomName} from '../../helper/name';

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    queryMade?: string,
    focusName: string,
    homeFamilies: Family[],
    newphewFamilies: Family[],
    parentFamilies: Family[],
    grandFamilies: Family[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {
    const {query}: {query? : string} = req.query
  
    const families: Family[] = await getFamilies();
    
    //Find closest name to query
    let name: string;
    if (query == undefined) {
      name = await getRandomName(families);
    } else {
      const simNames = await getSimilarNames(query, families);
      if (simNames.length > 0) {
        name = simNames[0];
      } else {
        name = query;
      }
    }

    //Find all families associated with this name
    const homeFamilies = families.filter(f => f.kids.includes(name));
    const parentFamilies = families.filter(f => f.parents.includes(name));

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