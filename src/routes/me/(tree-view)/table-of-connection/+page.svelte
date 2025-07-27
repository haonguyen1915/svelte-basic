<script lang="ts">
    import {TreeViewGroup, TreeViewItem} from '$lib/components/ui/tree-view';
    import {
        Table2,
        Folder,
        ChevronRight,
        ChevronDown, FolderOpen
    } from 'lucide-svelte';
    import type {TreeItem} from '$lib/components/ui/tree-view/types';

    interface TableData extends Record<string, unknown> {
        type: 'folder' | 'table';
    }

    // Simple two-level structure
    const databaseStructure: TreeItem<TableData>[] = [
        {
            id: 'tables',
            label: 'Tables',
            isExpandable: true,
            data: {type: 'folder'},
            children: [
                {
                    id: 'absent_requests',
                    label: 'absent_requests',
                    data: {type: 'table'}
                },
                {
                    id: 'academic_jobs',
                    label: 'academic_jobs',
                    data: {type: 'table'}
                },
                {
                    id: 'academic_working_sessions',
                    label: 'academic_working_sessions',
                    data: {type: 'table'}
                }
            ]
        },
        {
            id: 'tables 2',
            label: 'Tables',
            isExpandable: true,
            data: {type: 'folder'},
            children: [
                {
                    id: 'absent_requests',
                    label: 'absent_requests',
                    data: {type: 'table'}
                },
                {
                    id: 'academic_jobs',
                    label: 'academic_jobs',
                    data: {type: 'table'}
                },
                {
                    id: 'academic_working_sessions',
                    label: 'academic_working_sessions',
                    data: {type: 'table'}
                }
            ]
        }
    ];

    // State
    let expandedItems = $state<Set<string>>(new Set(['tables']));
    let selectedItem = $state<string | null>(null);

    function toggleExpanded(id: string) {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        expandedItems = newExpanded;
    }
</script>

<div class="h-screen flex flex-col bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-3 py-2">
        <span class="text-sm font-medium">Database Tables</span>
    </div>

    <!-- Tree View -->
    <div class="flex overflow-auto">
        <div class="border">
            {#each databaseStructure as folder}
                <TreeViewGroup
                        item={folder}
                        expanded={expandedItems.has(folder.id)}
                        onToggle={() => toggleExpanded(folder.id)}
                        indentSize={10}
                        class="text-xs"
                >
                    {#snippet label()}
                        <div class="text-sm">{folder.label}</div>
                    {/snippet}

                    {#snippet children()}
                        {#each folder.children || [] as table}
                            <TreeViewItem
                                    item={table}
                                    level={1}
                                    indentSize={1}
                                    selected={selectedItem === table.id}
                                    onclick={() => selectedItem = table.id}
                                    class="text-xs cursor-pointer hover:bg-accent/50 rounded"
                            >
                                {#snippet children()}
                                    <div class="flex items-center gap-1.5">
                                        <Table2 class="h-3.5 w-3.5 text-muted-foreground"/>
                                        <span class={selectedItem === table.id ? 'font-medium' : ''}>{table.label}</span>
                                    </div>
                                {/snippet}
                            </TreeViewItem>
                        {/each}
                    {/snippet}
                </TreeViewGroup>
            {/each}
        </div>
    </div>
</div>