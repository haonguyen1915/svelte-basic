<script lang="ts">
    import {TreeViewGroup, TreeViewItem} from '$lib/components/ui/tree-view';
    import {Button} from '$lib/components/ui/button';
    import {
        FolderOpen,
        Folder,
        Database,
        Zap,
        Layers,
        CheckCircle2,
        XCircle,
        AlertCircle,
        MoreHorizontal
    } from 'lucide-svelte';
    import type {TreeItem, DragDropData} from '$lib/components/ui/tree-view/types';
    import {cn} from '$lib/utils';

    interface ConnectionData {
        type: 'postgresql' | 'mysql' | 'redis' | 'mongodb';
        status: 'connected' | 'disconnected' | 'error';
        host: string;
        port: number;
        database?: string;
        tags: string[];
    }

    // Tree data structure
    const treeData: TreeItem<ConnectionData>[] = [
        {
            id: 'production',
            label: 'Production',
            isExpandable: true,
            children: [
                {
                    id: 'prod-pg',
                    label: 'Production PostgreSQL',
                    data: {
                        type: 'postgresql',
                        status: 'connected',
                        host: 'prod-db.company.com',
                        port: 5432,
                        database: 'main_db',
                        tags: ['production', 'critical']
                    }
                },
                {
                    id: 'prod-redis',
                    label: 'Redis Cache',
                    data: {
                        type: 'redis',
                        status: 'connected',
                        host: 'cache.company.com',
                        port: 6379,
                        tags: ['cache', 'production']
                    }
                }
            ]
        },
        {
            id: 'development',
            label: 'Development',
            isExpandable: true,
            children: [
                {
                    id: 'dev-mysql',
                    label: 'Dev MySQL',
                    data: {
                        type: 'mysql',
                        status: 'disconnected',
                        host: 'localhost',
                        port: 3306,
                        database: 'dev_db',
                        tags: ['development']
                    }
                }
            ]
        },
        {
            id: 'analytics',
            label: 'Analytics',
            isExpandable: true,
            children: [
                {
                    id: 'analytics-mongo',
                    label: 'MongoDB Analytics',
                    data: {
                        type: 'mongodb',
                        status: 'error',
                        host: 'analytics.company.com',
                        port: 27017,
                        database: 'analytics',
                        tags: ['analytics', 'nosql']
                    }
                }
            ]
        }
    ];

    // State management
    let expandedItems = $state<Set<string>>(new Set(['production', 'development', 'analytics']));
    let selectedItem = $state<string | null>('dev-mysql');
    let dragDropItems = $state(JSON.parse(JSON.stringify(treeData)));
    let dragStartItem: TreeItem<ConnectionData> | null = $state(null);
    let dropTargetId = $state('');
    let dropPosition: 'above' | 'below' | 'inside' | null = $state(null);

    function toggleExpanded(id: string) {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        expandedItems = newExpanded;
    }

    function getIcon(type: ConnectionData['type']) {
        switch (type) {
            case 'postgresql':
            case 'mysql':
                return Database;
            case 'redis':
                return Zap;
            case 'mongodb':
                return Layers;
            default:
                return Database;
        }
    }

    function getStatusIcon(status: ConnectionData['status']) {
        switch (status) {
            case 'connected':
                return CheckCircle2;
            case 'disconnected':
                return XCircle;
            case 'error':
                return AlertCircle;
            default:
                return AlertCircle;
        }
    }

    function getStatusColor(status: ConnectionData['status']) {
        switch (status) {
            case 'connected':
                return 'text-green-500';
            case 'disconnected':
                return 'text-gray-400';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-400';
        }
    }

    function getChildCount(item: TreeItem<ConnectionData>): number {
        return item.children?.length || 0;
    }

    function handleDragStart(item: TreeItem<ConnectionData>) {
        dragStartItem = item;
    }

    function handleDragEnd() {
        dragStartItem = null;
        dropTargetId = '';
        dropPosition = null;
    }

    function handleDrop(data: DragDropData<ConnectionData>) {
        // Deep clone the items to avoid mutations
        const newItems = JSON.parse(JSON.stringify(dragDropItems));

        // Find and remove the dragged item from its current location
        function removeItem(items: TreeItem<ConnectionData>[], targetId: string): TreeItem<ConnectionData> | null {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === targetId) {
                    const [removed] = items.splice(i, 1);
                    return removed;
                }
                if (items[i].children) {
                    const removed = removeItem(items[i].children!, targetId);
                    if (removed) return removed;
                }
            }
            return null;
        }

        // Insert the item at the new location
        function insertItem(items: TreeItem<ConnectionData>[], targetId: string, itemToInsert: TreeItem<ConnectionData>, position: 'above' | 'below' | 'inside'): boolean {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === targetId) {
                    if (position === 'above') {
                        items.splice(i, 0, itemToInsert);
                        return true;
                    } else if (position === 'below') {
                        items.splice(i + 1, 0, itemToInsert);
                        return true;
                    } else if (position === 'inside') {
                        if (!items[i].children) {
                            items[i].children = [];
                        }
                        items[i].children!.push(itemToInsert);
                        // Ensure the parent is expanded to show the dropped item
                        expandedItems = new Set([...expandedItems, targetId]);
                        return true;
                    }
                }
                if (items[i].children) {
                    const inserted = insertItem(items[i].children!, targetId, itemToInsert, position);
                    if (inserted) return true;
                }
            }
            return false;
        }

        // Remove the dragged item
        const draggedItem = removeItem(newItems, data.draggedItem.id);
        if (!draggedItem) return;

        // Insert it at the new location
        insertItem(newItems, data.targetItem.id, draggedItem, data.position);

        // Update the items
        dragDropItems = newItems;
    }

    function canDrop(draggedItem: TreeItem<ConnectionData>, targetItem: TreeItem<ConnectionData>, position: 'above' | 'below' | 'inside'): boolean {
        // Don't allow dropping an item onto itself
        if (draggedItem.id === targetItem.id) {
            return false;
        }

        // Only allow dropping inside expandable items (folders)
        if (position === 'inside' && !targetItem.isExpandable) {
            return false;
        }

        // Don't allow dropping a parent into its own descendant
        function isDescendant(parent: TreeItem<ConnectionData>, targetId: string): boolean {
            if (parent.children) {
                for (const child of parent.children) {
                    if (child.id === targetId) return true;
                    if (isDescendant(child, targetId)) return true;
                }
            }
            return false;
        }

        if (isDescendant(draggedItem, targetItem.id)) {
            return false;
        }

        return true;
    }
</script>

<div class="mx-auto max-w-4xl p-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Database Connections</h1>
        <p class="text-muted-foreground mt-2">Manage and monitor your database connections</p>
    </div>

    <div class="rounded-lg border shadow-sm">
        <div class="border-b px-6 py-4">
            <h2 class="text-lg font-semibold">Connection Explorer</h2>
        </div>

        <div class="p-4">
            <div class="space-y-1">
                {#snippet renderDragDropTree(items: TreeItem<ConnectionData>[], level = 0)}
                    {#each items as item (item.id)}
                        <div
                                class="relative"
                                draggable="true"
                                role="treeitem"
                                tabindex="-1"
                                aria-selected={selectedItem === item.id}
                                ondragstart={(e) => {
								if (e.dataTransfer) {
									e.dataTransfer.effectAllowed = 'move';
									e.dataTransfer.setData('text/plain', item.id);
								}
								handleDragStart(item);
							}}
                                ondragend={handleDragEnd}
                                ondragover={(e) => {
								e.preventDefault();
								if (e.dataTransfer) {
									e.dataTransfer.dropEffect = 'move';
								}
								const target = e.currentTarget;
								const rect = target.getBoundingClientRect();
								const y = e.clientY - rect.top;
								const height = rect.height;
								let position: 'above' | 'below' | 'inside' = 'inside';

								if (y < height * 0.3) position = 'above';
								else if (y > height * 0.7 && !item.isExpandable) position = 'below';

								if (dragStartItem && canDrop(dragStartItem, item, position)) {
									dropTargetId = item.id;
									dropPosition = position;
								}
							}}
                                ondragleave={(e) => {
								const target = e.currentTarget;
								const relatedTarget = e.relatedTarget;
								if (relatedTarget instanceof Node && !target.contains(relatedTarget)) {
									dropTargetId = '';
									dropPosition = null;
								}
							}}
                                ondrop={(e) => {
								e.preventDefault();
								if (dragStartItem && dropTargetId === item.id && dropPosition) {
									handleDrop({ draggedItem: dragStartItem, targetItem: item, position: dropPosition });
								}
								dropTargetId = '';
								dropPosition = null;
							}}
                                style="cursor: move;"
                        >
                            {#if dropTargetId === item.id && dropPosition === 'above'}
                                <div class="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10"></div>
                            {/if}

                            <TreeViewGroup
                                    {item}
                                    expanded={expandedItems.has(item.id)}
                                    onToggle={() => toggleExpanded(item.id)}
                                    class={cn(
									"mb-1",
									dragStartItem?.id === item.id && "opacity-50",
									dropTargetId === item.id && dropPosition === 'inside' && "ring-2 ring-primary ring-opacity-50 rounded-lg"
								)}
                                    {level}
                            >
                                {#snippet icon(expanded)}
                                    {#if expanded}
                                        <FolderOpen class="h-4 w-4 text-muted-foreground"/>
                                    {:else}
                                        <Folder class="h-4 w-4 text-muted-foreground"/>
                                    {/if}
                                {/snippet}

                                {#snippet label()}
                                    <div class="flex items-center justify-between w-full">
                                        <span class="font-medium">{item.label}</span>
                                        <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            {getChildCount(item)}
                                        </span>
                                    </div>
                                {/snippet}

                                {#snippet children()}
                                    {#if item.children}
                                        <div class="ml-4 space-y-1 mt-1">
                                            {#each item.children as child}
                                                {#if level === 0}
                                                    <TreeViewItem
                                                            item={child}
                                                            level={1}
                                                            selected={selectedItem === child.id}
                                                            onclick={() => selectedItem = child.id}
                                                            class="group rounded-lg transition-all duration-200 hover:bg-accent/50 cursor-pointer"
                                                            variant={selectedItem === child.id ? 'default' : 'ghost'}
                                                    >
                                                        {#snippet children()}
                                                            {@const Icon = getIcon(child.data?.type || 'postgresql')}
                                                            <div class="flex items-start gap-3 p-3">
                                                                {#if child.data}
                                                                    {@const
                                                                        StatusIcon = getStatusIcon(child.data.status)}
                                                                    {@const
                                                                        statusColor = getStatusColor(child.data.status)}
                                                                    <div class="relative mt-0.5">
                                                                        <Icon class="h-5 w-5 text-muted-foreground"/>
                                                                        <StatusIcon
                                                                                class={`absolute -bottom-1 -right-1 h-3 w-3 ${statusColor}`}/>
                                                                    </div>
                                                                {:else}
                                                                    <div class="relative mt-0.5">
                                                                        <Icon class="h-5 w-5 text-muted-foreground"/>
                                                                    </div>
                                                                {/if}

                                                                <div class="flex-1 min-w-0">
                                                                    <div class="flex items-center gap-2 mb-1">
                                                                        <h4 class="font-medium text-sm truncate">{child.label}</h4>
                                                                        <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                onclick={(e) => {
																				e.stopPropagation();
																				console.log('Options for', child.id);
																			}}
                                                                        >
                                                                            <MoreHorizontal class="h-3 w-3"/>
                                                                        </Button>
                                                                    </div>

                                                                    {#if child.data}
                                                                        <p class="text-xs text-muted-foreground truncate mb-2">
                                                                            {child.data.host}:{child.data.port}
                                                                            {#if child.data.database}
                                                                                / {child.data.database}
                                                                            {/if}
                                                                        </p>

                                                                        <div class="flex flex-wrap gap-1">
                                                                            {#each child.data.tags as tag}
																				<span class="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium">
																					{tag}
																				</span>
                                                                            {/each}
                                                                        </div>
                                                                    {/if}
                                                                </div>

                                                                {#if child.data?.status === 'connected'}
                                                                    <div class="mt-1">
                                                                        <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                                    </div>
                                                                {/if}
                                                            </div>
                                                        {/snippet}
                                                    </TreeViewItem>
                                                {:else}
                                                    {@render renderDragDropTree([child], level + 1)}
                                                {/if}
                                            {/each}
                                        </div>
                                    {/if}
                                {/snippet}
                            </TreeViewGroup>

                            {#if dropTargetId === item.id && dropPosition === 'below'}
                                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10"></div>
                            {/if}
                        </div>
                    {/each}
                {/snippet}
                {@render renderDragDropTree(dragDropItems, 2)}
            </div>
        </div>
    </div>
</div>