import type {TreeItem} from "$components/ui/tree-view/types";

export function getMoveCandidates(items: TreeItem[], excludeId: string): TreeItem[] {
    const result: TreeItem[] = [];

    function walk(nodes: TreeItem[]) {
        for (const node of nodes) {
            if (node.id !== excludeId && !isDescendant(node, excludeId)) {
                result.push(node);
                if (node.children) walk(node.children);
            }
        }
    }

    walk(items);
    return result;
}

export function isDescendant(node: TreeItem, childId: string): boolean {
    if (!node.children) return false;
    for (const child of node.children) {
        if (child.id === childId || isDescendant(child, childId)) return true;
    }
    return false;
}

export function moveItem(items: TreeItem[], sourceId: string, targetId: string): TreeItem[] {
    let dragged: TreeItem | null = null;

    function remove(nodes: TreeItem[]): TreeItem[] {
        return nodes.flatMap((node) => {
            if (node.id === sourceId) {
                dragged = node;
                return [];
            }
            if (node.children) {
                node.children = remove(node.children);
            }
            return [node];
        });
    }

    const withoutSource = remove(items);

    function insert(nodes: TreeItem[]): TreeItem[] {
        return nodes.map((node) => {
            if (node.id === targetId) {
                node.children = node.children ? [...node.children, dragged!] : [dragged!];
            } else if (node.children) {
                node.children = insert(node.children);
            }
            return node;
        });
    }

    return insert(withoutSource);
}