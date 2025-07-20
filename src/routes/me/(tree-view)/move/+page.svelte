<script lang="ts">
    import TreeView, {type TreeItem, type ContextMenuEvent} from '$lib/components/ui/tree-view/tree-view.svelte';
    import {
        ContextMenu,
        ContextMenuContent,
        ContextMenuItem
    } from '$lib/components/ui/context-menu';
    import {Dialog, DialogContent, DialogHeader, DialogTitle} from '$lib/components/ui/dialog';
    import {tick} from 'svelte';
    import {moveItem, getMoveCandidates} from "./utils";

    let treeItems: TreeItem[] = [
        {id: '1', label: 'Folder 1', children: [{id: '1.1', label: 'File A'}]},
        {id: '2', label: 'Folder 2'}
    ];

    let contextTarget: TreeItem | null = null;
    let showMoveDialog = false;
    let moveCandidates: TreeItem[] = [];

    let contextMenuVisible = false;
    let contextMenuX = 0;
    let contextMenuY = 0;

    async function handleContextMenu(event: ContextMenuEvent) {
        contextTarget = event.item;
        moveCandidates = getMoveCandidates(treeItems, contextTarget.id);

        contextMenuX = event.event.clientX;
        contextMenuY = event.event.clientY;
        await tick();
        contextMenuVisible = true;
    }

    function openMoveDialog() {
        contextMenuVisible = false;
        showMoveDialog = true;
    }

    function moveTo(targetId: string) {
        if (!contextTarget) return;
        treeItems = moveItem(treeItems, contextTarget.id, targetId);
        showMoveDialog = false;
    }
</script>
<div class="bg-white">
    <TreeView items={treeItems} onContextMenu={handleContextMenu}/>

    <!-- Custom Context Menu using absolute position -->
    {#if contextMenuVisible}
        <ContextMenu open>
            <ContextMenuContent
                    class="absolute z-50"
                    style="top: {contextMenuY}px; left: {contextMenuX}px"
                    on:close={() => (contextMenuVisible = false)}
            >
                <ContextMenuItem on:select={openMoveDialog}>Move to...</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    {/if}

    <!-- Dialog to select target -->
    <Dialog open={showMoveDialog} on:close={() => (showMoveDialog = false)}>
        <DialogContent class="max-w-sm">
            <DialogHeader>
                <DialogTitle>Move "{contextTarget?.label}" to:</DialogTitle>
            </DialogHeader>
            <ul class="max-h-64 overflow-auto space-y-1 mt-2">
                {#each moveCandidates as item}
                    <li>
                        <button
                                class="text-sm hover:underline"
                                on:click={() => moveTo(item.id)}
                        >
                            {item.label}
                        </button>
                    </li>
                {/each}
            </ul>
        </DialogContent>
    </Dialog>

</div>