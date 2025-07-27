<script lang="ts">
    import {TreeViewGroup, TreeViewItem} from './index.js';
    import type {TreeItem} from './types.js';
    import {Folder, FolderOpen, File, FileText, Image, Code} from 'lucide-svelte';
    import TreeNode from './tree-node.svelte';

    type Props = {
        item: TreeItem;
        level?: number;
        expandedIds: Set<string>;
        draggedItem?: TreeItem | null;
        dropTargetId?: string;
        dropPosition?: 'above' | 'below' | 'inside' | null;
        onToggle?: (item: TreeItem) => void;
        onDragStart?: (event: DragEvent, item: TreeItem) => void;
        onDragOver?: (event: DragEvent, item: TreeItem) => void;
        onDragLeave?: (event: DragEvent) => void;
        onDrop?: (event: DragEvent, item: TreeItem) => void;
        onDragEnd?: () => void;
        enableDragDrop?: boolean;
        getIcon?: (item: TreeItem, isExpanded?: boolean) => typeof Folder;
        class?: string;
    };

    let { 
        item, 
        level = 0,
        expandedIds,
        draggedItem = null,
        dropTargetId = '',
        dropPosition = null,
        onToggle,
        onDragStart,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        enableDragDrop = false,
        getIcon = defaultGetIcon,
        class: className = ''
    }: Props = $props();

    // Default icon helper
    function defaultGetIcon(item: TreeItem, isExpanded?: boolean): typeof Folder {
        const type = item.data?.type;
        const ext = item.data?.extension;

        if (type === 'folder') {
            return isExpanded ? FolderOpen : Folder;
        }

        if (ext === 'pdf' || ext === 'txt') return FileText;
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') return Image;
        if (ext === 'js' || ext === 'ts' || ext === 'jsx' || ext === 'tsx' || ext === 'css' || ext === 'scss') return Code;

        return File;
    }

    const isExpanded = $derived(expandedIds.has(item.id));
    const isDragging = $derived(draggedItem?.id === item.id);
    const isDropTarget = $derived(dropTargetId === item.id);
    const currentDropPosition = $derived(isDropTarget ? dropPosition : null);
</script>

{#if item.data?.type === 'folder'}
    <TreeViewGroup
        {item}
        expanded={isExpanded}
        onToggle={() => onToggle?.(item)}
        {enableDragDrop}
        dragging={isDragging}
        dropTarget={isDropTarget}
        dropPosition={currentDropPosition}
        onDragStart={(e) => onDragStart?.(e, item)}
        onDragOver={(e) => onDragOver?.(e, item)}
        {onDragLeave}
        onDrop={(e) => onDrop?.(e, item)}
        {onDragEnd}
        class="mb-1 {className}"
    >
        {#snippet icon(expanded)}
            {@const Icon = getIcon(item, expanded)}
            <Icon class="h-4 w-4 text-muted-foreground"/>
        {/snippet}

        {#snippet label()}
            <span>{item.label}</span>
        {/snippet}

        {#snippet children()}
            {#if item.children && isExpanded}
                <div class="ml-4 space-y-1 mt-1">
                    {#each item.children as child}
                        <TreeNode
                            item={child}
                            level={level + 1}
                            {expandedIds}
                            {draggedItem}
                            {dropTargetId}
                            {dropPosition}
                            {onToggle}
                            {onDragStart}
                            {onDragOver}
                            {onDragLeave}
                            {onDrop}
                            {onDragEnd}
                            {enableDragDrop}
                            {getIcon}
                            class={className}
                        />
                    {/each}
                </div>
            {/if}
        {/snippet}
    </TreeViewGroup>
{:else}
    <TreeViewItem
        {item}
        {level}
        {enableDragDrop}
        dragging={isDragging}
        dropTarget={isDropTarget}
        dropPosition={currentDropPosition}
        onDragStart={(e) => onDragStart?.(e, item)}
        onDragOver={(e) => onDragOver?.(e, item)}
        {onDragLeave}
        onDrop={(e) => onDrop?.(e, item)}
        {onDragEnd}
        class={className}
    >
        {#snippet children()}
            {@const Icon = getIcon(item, false)}
            <div class="flex items-center gap-2">
                <Icon class="h-4 w-4 text-muted-foreground"/>
                <span>{item.label}</span>
            </div>
        {/snippet}
    </TreeViewItem>
{/if}