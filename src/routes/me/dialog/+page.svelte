<script lang="ts">
    import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogFooter
    } from '$lib/components/ui/dialog';
    import { Button } from '$lib/components/ui/button';
    import { Check, Folder, X } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';

    // Dummy data
    type Item = { id: string; label: string; children?: Item[] };
    let items: Item[] = [
        { id: '1', label: 'Documents' },
        { id: '2', label: 'Pictures' },
        { id: '3', label: 'Downloads' }
    ];

    let itemToMove: Item = { id: '999', label: 'CV.pdf' };
    let showDialog = false;
    let selectedTargetId: string | null = null;

    function openMoveDialog(item: Item) {
        itemToMove = item;
        selectedTargetId = null;
        showDialog = true;
    }

    function confirmMove() {
        if (!selectedTargetId) return;
        toast.success(`Moved "${itemToMove.label}" to "${getLabelById(selectedTargetId)}"`);
        showDialog = false;
    }

    function getLabelById(id: string) {
        return items.find((i) => i.id === id)?.label ?? '';
    }
</script>

<!-- Trigger Button -->
<Button variant="outline" onclick={() => openMoveDialog({ id: '999', label: 'CV.pdf' })}>
    Move "CV.pdf"
</Button>

<!-- Move Dialog -->
<Dialog open={showDialog} on:close={() => (showDialog = false)}>
    <DialogContent class="max-w-md">
        <DialogHeader>
            <DialogTitle>Move "{itemToMove.label}" to...</DialogTitle>
        </DialogHeader>

        <div class="space-y-2 max-h-64 overflow-auto py-2">
            {#each items as item}
                <button
                        class="w-full flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-muted data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition"
                        onclick={() => (selectedTargetId = item.id)}
                        data-selected={selectedTargetId === item.id}
                >
                    <div class="flex items-center gap-2">
                        <Folder class="size-4" />
                        <span>{item.label}</span>
                    </div>
                    {#if selectedTargetId === item.id}
                        <Check class="size-4" />
                    {/if}
                </button>
            {/each}
        </div>

        <DialogFooter class="mt-4">
            <Button variant="secondary" onclick={() => (showDialog = false)}>
                <X class="mr-1 size-4" /> Cancel
            </Button>
            <Button disabled={!selectedTargetId} onclick={confirmMove}>
                <Check class="mr-1 size-4" /> Move
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>