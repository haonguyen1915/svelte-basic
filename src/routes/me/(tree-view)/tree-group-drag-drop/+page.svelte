<script lang="ts">
    import {TreeNode} from '$lib/components/ui/tree-view';
    import type {TreeItem} from '$lib/components/ui/tree-view/types';

    // Sample data for tree view
    let group1Items = $state<TreeItem[]>([
        {
            id: 'g1-1',
            label: 'Folder 1',
            data: {type: 'folder'},
            children: [
                {id: 'g1-1.1', label: 'Report.pdf', data: {type: 'file', extension: 'pdf'}},
                {id: 'g1-1.2', label: 'Image.png', data: {type: 'file', extension: 'png'}},
                {id: 'g1-1.3', label: 'Script.js', data: {type: 'file', extension: 'js'}}
            ]
        },
        {
            id: 'g2-1',
            label: 'Folder 2',
            data: {type: 'folder'},
            children: [
                {id: 'g2-1.1', label: 'Document.txt', data: {type: 'file', extension: 'txt'}}
            ]
        }
    ]);

    // State management
    let expandedIds = $state(new Set(['g1-1', 'g2-1']));
    let draggedItem: TreeItem | null = $state(null);
    let dropTargetId = $state('');
    let dropPosition: 'above' | 'below' | 'inside' | null = $state(null);

    // Deep clone helper for TreeItem
    function deepCloneTreeItem(item: TreeItem): TreeItem {
        const cloned: TreeItem = {
            id: item.id,
            label: item.label,
            data: item.data ? { ...item.data } : undefined
        };
        
        if (item.children) {
            cloned.children = item.children.map(child => deepCloneTreeItem(child));
        }
        
        return cloned;
    }

    // Deep clone helper for TreeItem array
    function deepCloneTreeItems(items: TreeItem[]): TreeItem[] {
        return items.map(item => deepCloneTreeItem(item));
    }


    // Expand/collapse handler
    function handleExpand(item: TreeItem) {
        if (expandedIds.has(item.id)) {
            expandedIds = new Set([...expandedIds].filter(id => id !== item.id));
        } else {
            expandedIds = new Set([...expandedIds, item.id]);
        }
    }

    // Drag start handler
    function handleDragStart(event: DragEvent, item: TreeItem) {
        console.log("Drag started for item:", item);
        draggedItem = item;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', item.id);
        }
    }

    // Drag over handler
    function handleDragOver(event: DragEvent, item: TreeItem) {
        if (!draggedItem || draggedItem.id === item.id) return;

        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const y = event.clientY - rect.top;
        const height = rect.height;

        let position: 'above' | 'below' | 'inside' = 'inside';

        if (y < height * 0.3) position = 'above';
        else if (y > height * 0.7 && item.data?.type !== 'folder') position = 'below';

        // Check if drop is allowed
        if (canDrop(draggedItem, item, position)) {
            dropTargetId = item.id;
            dropPosition = position;
        }
    }

    // Drag leave handler
    function handleDragLeave(event: DragEvent) {
        const target = event.currentTarget as HTMLElement;
        const relatedTarget = event.relatedTarget as Node;
        if (!target.contains(relatedTarget)) {
            dropTargetId = '';
            dropPosition = null;
        }
    }

    // Drop handler
    function handleDrop(event: DragEvent, targetItem: TreeItem) {
        event.preventDefault();

        if (!draggedItem || !dropPosition) return;

        // Remove from source
        let newItems = removeItemFromTree(deepCloneTreeItems(group1Items), draggedItem.id);

        // Add to target
        newItems = insertItemIntoTree(
            newItems,
            deepCloneTreeItem(draggedItem),
            targetItem.id,
            dropPosition
        );

        // Update state
        group1Items = newItems;

        // Reset drag state
        draggedItem = null;
        dropTargetId = '';
        dropPosition = null;
    }

    // Check if drop is allowed
    function canDrop(draggedItem: TreeItem, targetItem: TreeItem, position: 'above' | 'below' | 'inside'): boolean {
        // Don't allow dropping onto itself
        if (draggedItem.id === targetItem.id) return false;

        // Only allow dropping inside folders
        if (position === 'inside' && targetItem.data?.type !== 'folder') return false;

        // Don't allow dropping a parent into its own descendant
        if (isDescendant(draggedItem, targetItem.id)) return false;

        return true;
    }

    // Check if targetId is a descendant of parent
    function isDescendant(parent: TreeItem, targetId: string): boolean {
        if (parent.children) {
            for (const child of parent.children) {
                if (child.id === targetId) return true;
                if (isDescendant(child, targetId)) return true;
            }
        }
        return false;
    }

    // Remove item from tree
    function removeItemFromTree(items: TreeItem[], targetId: string): TreeItem[] {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === targetId) {
                items.splice(i, 1);
                return items;
            }
            if (items[i].children) {
                items[i].children = removeItemFromTree(items[i].children!, targetId);
            }
        }
        return items;
    }

    // Insert item into tree
    function insertItemIntoTree(items: TreeItem[], itemToInsert: TreeItem, targetId: string, position: 'above' | 'below' | 'inside'): TreeItem[] {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === targetId) {
                if (position === 'above') {
                    items.splice(i, 0, itemToInsert);
                } else if (position === 'below') {
                    items.splice(i + 1, 0, itemToInsert);
                } else if (position === 'inside') {
                    if (!items[i].children) {
                        items[i].children = [];
                    }
                    items[i].children!.push(itemToInsert);
                    // Ensure parent is expanded
                    expandedIds = new Set([...expandedIds, targetId]);
                }
                return items;
            }
            if (items[i].children) {
                insertItemIntoTree(items[i].children!, itemToInsert, targetId, position);
            }
        }
        return items;
    }

</script>

<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">TreeView Drag & Drop Demo</h1>
    <p class="text-muted-foreground mb-8">
        Drag items to reorder them. You can drop items above, below, or inside folders.
    </p>

    <div class="border rounded-lg p-4">
            {#each group1Items as item}
                <TreeNode
                    {item}
                    {expandedIds}
                    {draggedItem}
                    {dropTargetId}
                    {dropPosition}
                    enableDragDrop
                    onToggle={handleExpand}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragEnd={() => {
                        draggedItem = null;
                        dropTargetId = '';
                        dropPosition = null;
                    }}
                />
            {/each}
    </div>

    <div class="mt-8 p-4 bg-muted rounded-lg">
        <h3 class="font-semibold mb-2">Instructions:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Drag any item to reorder it</li>
            <li>Drop items above or below other items to reorder</li>
            <li>Drop items onto folders to move them inside</li>
            <li>Visual indicators show where items will be dropped</li>
        </ul>
    </div>

    <!-- Debug Info -->
    <div class="mt-8 p-4 bg-muted rounded-lg">
        <h3 class="font-semibold mb-2">Debug Info:</h3>
        <pre class="overflow-auto">
<code class="language-json">{JSON.stringify({
    items: group1Items,
    expandedIds: Array.from(expandedIds),
    dropTargetId,
    dropPosition,
    draggedItem: draggedItem ? { id: draggedItem.id, label: draggedItem.label } : null
}, null, 2)}</code>
        </pre>
    </div>
</div>

