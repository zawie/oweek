import {StudentFamily, StudentRecord, ID, RelationRecord} from "../model/types";

enum QueryType {
    name,
    netid
}

type QueryError = {
    err?: String
}

const distance = (a: string, b: string): number => {
    // levenshtein distance
    if (a.length == 0) return b.length
    if (b.length == 0) return a.length

    if (a[0] == b[0]) return distance(a.substring(1), b.substring(1))

    return 1 + Math.min(
        distance(a, b.substring(1)),
        distance(a.substring(1), b),
        distance(a.substring(1), b.substring(1))
    )
}

class searchEngine {

    recordMap: Map<ID, StudentRecord>
    records: RelationRecord[]

    constructor(message: string) {
        this.recordMap = new Map<ID, StudentRecord>();
        this.records = [];
    }

    search(query: string): StudentFamily | QueryError {

        //Parse query
        const type: QueryType = this.parseQueryType(query);
        const id: ID | null = type == QueryType.netid ? query as ID: this.inferId(query);
        if (id == null || !this.recordMap.has(id))
            return {err: `No student record found using query ${query}.`}

        const focusRecord: StudentRecord = this.recordMap.get(id) as StudentRecord

        //Get parents
        return {err: "Not implemented."};
    }

    parseQueryType(query: string): QueryType {
        // A query is a probably a netid if and only if it contains a digit
        if (/\d/.test(query))
            return QueryType.netid;
        return QueryType.name;
    }

    inferId(queryName: string) : ID | null {
        // Return the ID with name that is minimum distance to queryName.
        const currBest: number = Number.MAX_VALUE;
        const bestID: ID : null = null;
        for (const k in this.recordMap.keys()) {
            const record: StudentRecord = this.recordMap.get(id)
            if (record.name != null) {
                const dist = distance(queryName, record.name)
                if (dist < currBest) {
                    currBest = dist;
                    bestID = record.id;
                }
            }
        }

        return bestID;
    }


    idsToRecord(Set<ID> ids): StudentRecord[] {

    }

    getFamily(focusId: ID) : StudentFamily {
        const parents: Set<ID> = new Set<ID>();
        const kids: Set<ID> = new Set<ID>();
        const siblings: Set<ID> = new Set<ID>();

        this.records.forEach((r: RelationRecord) => {
            // If someone has focus as a kid, they are focuses' parent.
            if (r.kids.includes(focusId))
                parents.add(r.id);

            // If someone has focus as a parent, they are focus's kid.
            if (r.parents.includes(focusId))
                kids.add(r.id);

            // Add focus's enteries
            if (r.id == focusId) {
                r.parents.forEach(parents.add, parents);
                r.kids.forEach(kids.add, kids);
                r.siblings.forEach(siblings.add, siblings);
            }
        })

        return {
            focus:  this.recordMap.get(focusId),
            parents: idsToRecord(parents),
            siblings: idsToRecord(siblings),
            kids: idsToRecord(kids)
        };
    }
}
