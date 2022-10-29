// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { Trie } from '../../helper/trie';

type ErrorResponse = {
  error: string
}

export type CompleteNameResult = {
    partial_name?: string,
    names: string[],
}


let cachedNames: Trie | undefined = undefined;
const minPartialLength = 1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompleteNameResult | ErrorResponse>
) {
    const {partial_name}: {partial_name? : string} = req.query
    
    if (partial_name == undefined || partial_name.length <= minPartialLength) {
        res.status(200).json({
            partial_name,
            names: []
        });
    }

    if (cachedNames == undefined) {
        cachedNames = new Trie();
        const families: Family[] = await getFamilies();
        families.forEach(f => {
            f.kids.concat(f.parents).forEach(p => {
                cachedNames?.add(p.toLowerCase());
            })
        })
    }

    const completeByPrefix = cachedNames.query((partial_name as string).toLowerCase());

    res.status(200).json({
        partial_name,
        names: completeByPrefix.splice(0,5)
    });
}