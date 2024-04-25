// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Trie } from '../../helper/data_structures/trie';
import { getSimilarNames } from '../../helper/name'
import { getPeople } from '../../helper/db';
import { normalize } from 'path';

type ErrorResponse = {
  error: string
}

export type SuggestResult = {
    query?: string,
    suggestions: string[],
}

let cachedNames: Trie | undefined = undefined;
let people: string[] | undefined = undefined;
export const minQueyLength = 1;
const numSuggestions = 5;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestResult | ErrorResponse>
) {
    const {query}: {query? : string} = req.query
    
    if (query == undefined || query.length < minQueyLength) {
        res.status(400).json({
            error: "Query is too short."
        });
    }

    if (cachedNames == undefined) {
        cachedNames = new Trie();
        if (people == undefined) {
            people = await getPeople();
        }
        people.forEach(p => {
            cachedNames?.add(normalize(p));
        })
    }

    let suggestions = cachedNames.query(normalize(query as string))
                        .sort().reverse();
    if (suggestions.length < numSuggestions) {
        if (people == undefined) {
            people = await getPeople();
        }
        const simNames = await getSimilarNames(query as string, people, numSuggestions);
        suggestions = suggestions.concat(simNames.map(normalize))
        const used = new Set<string>();
        suggestions = suggestions.filter(x => {
            if (used.has(x))
                return false;
            used.add(x)
            return true;
        })
    }

    res.status(200).json({
        query,
        suggestions: suggestions.slice(0,numSuggestions)
    });
}