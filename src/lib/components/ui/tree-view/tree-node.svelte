<!-- TreeNode.svelte -->
<script lang="ts" generics="T extends Record<string, any>">
    import { cn } from "$lib/utils.js";
    import { ChevronRight, Folder, FolderOpen, File } from "lucide-svelte";
    import { treeItemVariants, treeIconVariants } from "./tree-view.svelte";
    import type { TreeItem, TreeItemVariant } from "./tree-view.svelte";

    interface TreeNodeProps<T extends Record<string, any>> {
        item: TreeItem<T>;
        level: number;
        expandedSet: Set<string>;
        selectedSet: Set<string>;
        selectedId: string | undefined;
        multiSelect: boolean;
        indentSize: number;
        draggedItemId: string | null;
        dropPosition: { itemId: string; position: 'above' | 'below' | 'inside' } | null;
        enableDragDrop: boolean;
        renderIcon?: (item: TreeItem<T>, isExpanded?: boolean) => any;
        renderLabel?: (item: TreeItem<T>) => string | { render: () => any };
        getItemVariant?: (item: TreeItem<T>) => TreeItemVariant;
        canDrop?: (draggedItem: TreeItem<T>, targetItem: TreeItem<T>, position: 'above' | 'below' | 'inside') => boolean;
        defaultGetItemVariant: (item: TreeItem<T>) => TreeItemVariant;
        handleItemClick: (item: TreeItem<T>, event: MouseEvent) => void;
        handleContextMenu: (item: TreeItem<T>, event: MouseEvent) => void;
        handleKeyDown: (item: TreeItem<T>, event: KeyboardEvent) => void;
        handleDragStart: (item: TreeItem<T>, event: DragEvent) => void;
        handleDragOver: (item: TreeItem<T>, event: DragEvent, position: 'above' | 'below' | 'inside') => void;
        handleDragLeave: (event: DragEvent) => void;
        handleDrop: (item: TreeItem<T>, event: DragEvent, position: 'above' | 'below' | 'inside') => void;
        handleDragEnd: () => void;
    }

    let {
        item,
        level,
        expandedSet,
        selectedSet,
        selectedId,
        multiSelect,
        indentSize,
        draggedItemId,
        dropPosition,
        enableDragDrop,
        renderIcon,
        renderLabel,
        getItemVariant,
        canDrop,
        defaultGetItemVariant,
        handleItemClick,
        handleContextMenu,
        handleKeyDown,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd
    }: TreeNodeProps<T> = $props();

    let dragOverPosition: 'above' | 'below' | 'inside' | null = $state(null);
    let itemElement: HTMLDivElement | null = $state(null);

    function defaultRenderIcon(item: TreeItem<T>, isExpanded = false) {
        if (item.icon) {
            return item.icon;
        }

        if (item.children?.length) {
            return isExpanded ? FolderOpen : Folder;
        }
        return File;
    }

    function defaultRenderLabel(item: TreeItem<T>) {
        return item.label;
    }

    function getDragOverPosition(event: DragEvent): 'above' | 'below' | 'inside' {
        if (!itemElement) return 'inside';

        const rect = itemElement.getBoundingClientRect();
        const y = event.clientY - rect.top;
        const height = rect.height;

        if (y < height * 0.25) return 'above';
        if (y > height * 0.75 && !item.children?.length) return 'below';
        if (y > height * 0.75 && item.children?.length) return 'inside';
        return 'inside';
    }

    function onDragOver(event: DragEvent) {
        event.preventDefault();
        const position = getDragOverPosition(event);
        dragOverPosition = position;
        handleDragOver(item, event, position);
    }

    function onDragLeave(event: DragEvent) {
        // Only clear if we're leaving the entire item area
        if (itemElement && !itemElement.contains(event.relatedTarget as Node)) {
            dragOverPosition = null;
            handleDragLeave(event);
        }
    }

    function onDrop(event: DragEvent) {
        event.preventDefault();
        const position = dragOverPosition || 'inside';
        dragOverPosition = null;
        handleDrop(item, event, position);
    }

    // Determine if this item should show drop indicators
    const isDropTarget = $derived(
        dropPosition?.itemId === item.id && draggedItemId && draggedItemId !== item.id
    );

    const isDragged = $derived(draggedItemId === item.id);
</script>

<div
    role="treeitem"
    aria-expanded={item.children?.length ? expandedSet.has(item.id) : undefined}
    aria-selected={multiSelect ? selectedSet.has(item.id) : selectedId === item.id}
    aria-disabled={item.disabled}
    class="relative"
>
    <!-- Drop indicator above -->
    {#if isDropTarget && dropPosition?.position === 'above'}
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10" style="left: {level * indentSize + 0.5}rem"></div>
    {/if}

    <div
        bind:this={itemElement}
        class={cn(
            treeItemVariants({
                variant: getItemVariant ? getItemVariant(item) : defaultGetItemVariant(item),
                disabled: item.disabled
            }),
            isDragged && "opacity-50",
            isDropTarget && dropPosition?.position === 'inside' && "ring-2 ring-primary",
            "group"
        )}
        style="padding-left: {level * indentSize + 0.5}rem"
        draggable={enableDragDrop && !item.disabled}
        onclick={(e) => handleItemClick(item, e)}
        oncontextmenu={(e) => handleContextMenu(item, e)}
        onkeydown={(e) => handleKeyDown(item, e)}
        ondragstart={enableDragDrop ? (e) => handleDragStart(item, e) : undefined}
        ondragover={enableDragDrop ? onDragOver : undefined}
        ondragleave={enableDragDrop ? onDragLeave : undefined}
        ondrop={enableDragDrop ? onDrop : undefined}
        ondragend={enableDragDrop ? handleDragEnd : undefined}
        tabindex={item.disabled ? -1 : 0}
        role="button"
        aria-label={item.label}
    >
        <!-- Expand/Collapse Icon -->
        {#if item.children?.length}
            {@const isExpanded = expandedSet.has(item.id)}
            <ChevronRight
                class={cn(treeIconVariants({ expanded: isExpanded }), "size-4")}
            />
        {:else}
            <div class="size-4"></div>
        {/if}

        <!-- Item Icon -->
        {#if renderIcon || item.icon || item.children?.length}
            {@const iconRenderer = renderIcon || defaultRenderIcon}
            {@const isExpanded = expandedSet.has(item.id)}
            {@const IconComponent = iconRenderer(item, isExpanded)}

            {#if IconComponent}
                {#if typeof IconComponent === 'string'}
                    <span class="size-4 shrink-0 flex items-center justify-center text-xs">
                        {IconComponent}
                    </span>
                {:else}
                    <svelte:component this={IconComponent} class="size-4 shrink-0" />
                {/if}
            {/if}
        {/if}

        <!-- Item Label -->
        <span class="truncate flex-1">
            {#if renderLabel}
                {@const labelContent = renderLabel(item)}
                {#if typeof labelContent === 'string'}
                    {labelContent}
                {:else if labelContent && typeof labelContent === 'object' && 'render' in labelContent}
                    {labelContent.render()}
                {:else}
                    {item.label}
                {/if}
            {:else}
                {item.label}
            {/if}
        </span>

        <!-- Drag handle (optional visual indicator) -->
        {#if enableDragDrop && !item.disabled}
            <div class="opacity-0 group-hover:opacity-50 text-xs">⋮⋮</div>
        {/if}
    </div>

    <!-- Drop indicator below -->
    {#if isDropTarget && dropPosition?.position === 'below'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-10" style="left: {level * indentSize + 0.5}rem"></div>
    {/if}

    <!-- Children -->
    {#if item.children?.length && expandedSet.has(item.id)}
        <div>
            {#each item.children as child}
                <svelte:self
                    item={child}
                    level={level + 1}
                    {expandedSet}
                    {selectedSet}
                    {selectedId}
                    {multiSelect}
                    {indentSize}
                    {draggedItemId}
                    {dropPosition}
                    {enableDragDrop}
                    {renderIcon}
                    {renderLabel}
                    {getItemVariant}
                    {canDrop}
                    {defaultGetItemVariant}
                    {handleItemClick}
                    {handleContextMenu}
                    {handleKeyDown}
                    {handleDragStart}
                    {handleDragOver}
                    {handleDragLeave}
                    {handleDrop}
                    {handleDragEnd}
                />
            {/each}
        </div>
    {/if}
</div>