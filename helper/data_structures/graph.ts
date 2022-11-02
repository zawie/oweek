type Node = number;

export class Graph<T> {
    elementToNode: Map<T, Node>
    nodeToElement: T[]
    nodeToNeighbors: Set<Node>[]

    constructor() {
        this.elementToNode = new Map<T, Node>();
        this.nodeToNeighbors = []
        this.nodeToElement = []
    }

    addNode(element: T): Node {
        this.nodeToElement.push(element);
        this.nodeToNeighbors.push(new Set<Node>());
        const node = this.nodeToElement.length;
        this.elementToNode.set(element, node);
        return node;
    }

    addUndirectedEdge(u: T, v: T) {
        const n1 = this.elementToNode.get(u) || this.addNode(u);
        const n2 = this.elementToNode.get(v) || this.addNode(v);;
        this.nodeToNeighbors[n1].add(n2);
        this.nodeToNeighbors[n2].add(n1);
    }

    addDirectedEdge(u: T, v: T) {
        const n1 = this.elementToNode.get(u) || this.addNode(u);
        const n2 = this.elementToNode.get(v) || this.addNode(v);;
        this.nodeToNeighbors[n1].add(n2);
    }
    
    getNeighbors(node: Node): Set<Node> {
        return this.nodeToNeighbors[node];
    }

    getElement(node: Node): T {
        return this.nodeToElement[node];
    }

    getNode(element: T): Node | undefined {
        return this.elementToNode.get(element);
    }
}
