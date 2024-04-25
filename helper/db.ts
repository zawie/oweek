import { createClient, VercelKV } from '@vercel/kv';
import { Family } from './family';
import { normalize } from './name';

export function getClient(readOnly=true): VercelKV {
    return createClient({
        url: process.env.KV_REST_API_URL as string,
        token: readOnly 
            ? process.env.KV_REST_API_READ_ONLY_TOKEN as string
            : process.env.KV_REST_API_TOKEN as string,
    });
}

export async function insertFamily(family: Family, kv=getClient(false)){
    const people = family.kids.concat(family.parents).map(normalize)

    // >>>>>>>> Start of transaction >>>>>>>>
    const transaction = kv.multi();
    const normalFamilyName = normalize(family.name)

    transaction.lpush(`_FAMILY:${normalFamilyName}`, JSON.stringify(family));
    transaction.sadd(`_FAMILIES`, normalFamilyName);

    people.forEach(p => {
        transaction.sadd(`_PERSON:${p}`, normalFamilyName)
    })
    transaction.sadd(`_PEOPLE`, ...people);

    await transaction.exec()
    // <<<<<<<<< End transaction <<<<<<<<<
}

export async function getAssociatedFamilies(person: string, kv=getClient(true)): Promise<Family[]> {
    const familyNames = kv.smembers(`_PERSON:${normalize(person)}`)

    const families = familyNames.then(res => 
        res.map(async (name) => 
            await kv.lindex(`_FAMILY:${name}`, 0) as Family
        )
    ).then(res => Promise.all(res))

    return families
}

export async function getAllFamilies(kv=getClient(true)): Promise<Family[]> {
    return getFamilyNames(kv).then(res => 
        res.map(async (name) => 
            await kv.lindex(`_FAMILY:${name}`, 0) as Family
        )
    ).then(res => Promise.all(res))
}   

export async function getPeople(kv=getClient(true)): Promise<string[]> {
    return kv.smembers('_PEOPLE')
}

export async function getRandomPerson(kv=getClient(true)): Promise<string> {
    return kv.srandmember('_PEOPLE') as Promise<string>
}

export async function getFamilyNames(kv=getClient(true)): Promise<string[]> {
    return kv.smembers('_FAMILIES')
}