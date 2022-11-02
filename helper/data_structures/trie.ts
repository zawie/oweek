

class TrieNode {
    children: (TrieNode | undefined)[];
    exists: boolean;

    constructor() {
        this.children = new Array<TrieNode | undefined>(256);
        this.exists = false;
    }
}

export class Trie {
    root: TrieNode

    constructor() {
        this.root = new TrieNode();
    }

    add(str: string) {
        const chars: Array<number> = Array.from(str).map(c => c.charCodeAt(0));
        let node: TrieNode = this.root;
        chars.forEach(c => {
            if (node.children[c] == undefined) {
                node.children[c] = new TrieNode();
            }
            node = node.children[c] as TrieNode;
        })
        node.exists = true;
    }

    query(prefix: string): string[] {
        const chars: Array<number> = Array.from(prefix).map(c => c.charCodeAt(0));
        let node: TrieNode | undefined = this.root;
        chars.forEach(c => {
            node = (node == undefined) ? undefined : node.children[c];
        })

        if (node == undefined)
            return [];

        const stack: [TrieNode, string][] = [[node, prefix]]
        const strings: string[] = []

        while (stack.length > 0) {
            const [n, s]: [TrieNode, string] = stack.pop() as [TrieNode, string];
            if (n.exists)
                strings.push(s);
            for(let c=0; c < n.children.length; c++) {
                const child: TrieNode | undefined = n.children[c];
                if (child != undefined)
                    stack.push([child, s + String.fromCharCode(c)]);
            }
        }

        return strings;
    }
}