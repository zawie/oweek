export class topK<T> {
    elements: ([T, number] | undefined)[]
    k: number

    constructor(k: number) {
        this.k = k;
        this.elements = new Array<[T, number] | undefined>(k);
    }

    add(element: T, weight: number) {
        let evicted: number | undefined = undefined;
        let evicted_weight: number = weight;

        for(let i = 0; i < this.k; i++) {
            const entry = this.elements[i];

            if (entry == undefined) {
                this.elements[i] = [element, weight];
                return;
            }

            const [_, w] = entry;
            if (w < evicted_weight) {
                evicted = i;
                evicted_weight = w;
            }
        }

        if (evicted != undefined) {
            this.elements[evicted] = [element,weight];
        }
    }

    retrieve(): T[] {
        this.elements.sort((a,b) => {
            if (a == undefined)
                return 1;
            if (b == undefined)
                return -1;
            return b[1] - a[1];
        });

        return this.elements
            .filter(x => x != undefined)
            .map(x => (x as [T, number])[0]);
    }
}