// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { stringSimilarity } from './similarity';
import { Family } from './family';
import { topK } from './data_structures/topk';

export function getNameSimilarity(name0: string, name1: string): number {
      if (name0 == name1)
        return 1;

      //Compute entire similarity
      const totalSim = stringSimilarity(name0, name1);

      //Compute partial similarity
      const parts0 = name0.split(/ /);
      const parts1 = name1.split(/ /);

      let partialSim = 0;
      parts0.forEach(p0 => {
        parts1.forEach(p1 => {
            partialSim += stringSimilarity(p0, p1)/(parts0.length+parts1.length)
        })
      })
      
      return totalSim*0.5 + partialSim*0.5;
}

export async function getSimilarNames(
        query: string, 
        names: string[], 
        amount: number = 1
    ): Promise<string[]> {

    const query_lower = query.toLowerCase();
    const best: topK<string> = new topK<string>(amount);
    const observed = new Set<string>();

    names.forEach((name: string) => {
        const lower_name = name.toLowerCase();
        if (!observed.has(lower_name)) {
            observed.add(lower_name)
            const sim = getNameSimilarity(lower_name, query_lower);
            if (sim > 0) {
                best.add(name, sim)   
            }
        }
    });

    return best.retrieve();
}

export function normalize(str: string): string {
    return str.toLowerCase().trim()
}


export function denormalize(name: string, families: Family[]): string {
    const candidateNames = families.map(f => f.kids.concat(f.parents)).flat().filter(x => normalize(x) == normalize(name))
    return candidateNames.length > 0 && candidateNames[0] || name;
}