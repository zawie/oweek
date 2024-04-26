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

export async function deleteFamily(familyName: string, kv=getClient(false), checkExistence=true) {

    const family = await getFamily(familyName);
    if (checkExistence && family == null) {
        throw new Error("Can't delete a non-existent family not found!")
    }

    const people = family?.kids.concat(family?.parents).map(normalize) || []
    // >>>>>>>> Start of transaction >>>>>>>>
    const transaction = kv.multi();
    const normalFamilyName = normalize(familyName)

    transaction.del(`_FAMILY:${normalFamilyName}`)
    transaction.srem(`_FAMILIES`, normalFamilyName);

    people.forEach(p => {
        transaction.srem(`_PERSON:${p}`, normalFamilyName)
    })

    await transaction.exec()
    // <<<<<<<<< End transaction <<<<<<<<<

    people.filter(async p => kv.smembers(`_PERSON:${p}`).then(res => res.length == 0))
          .map(p => kv.srem(`_PEOPLE`, p))
}

export async function getFamily(familyName: string, kv=getClient(false)): Promise<Family | null> {
    return kv.lindex(`_FAMILY:${familyName}`, 0)
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