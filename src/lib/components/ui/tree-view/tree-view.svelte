<!-- TreeView.svelte -->
<script lang="ts" module>
    import { cn, type WithElementRef } from "$lib/utils.js";
    import type { HTMLAttributes } from "svelte/elements";
    import { type VariantProps, tv } from "tailwind-variants";

    export const treeViewVariants = tv({
        base: "select-none text-sm",
        variants: {
            size: {
                sm: "text-xs",
                default: "text-sm",
                lg: "text-base",
            },
        },
        defaultVariants: {
            size: "default",
        },
    });

    export const treeItemVariants = tv({
        base: "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        variants: {
            variant: {
                default: "",
                selected: "bg-primary text-primary-foreground",
                active: "bg-accent text-accent-foreground",
            },
            disabled: {
                true: "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    });

    export const treeIconVariants = tv({
        base: "transition-transform duration-200 shrink-0",
        variants: {
            expanded: {
                true: "rotate-90",
                false: "rotate-0",
            },
        },
        defaultVariants: {
            expanded: false,
        },
    });

    export type TreeItem<T = Record<string, any>> = {
        id: string;
        label: string;
        icon?: any; // Component constructor or string
        children?: TreeItem<T>[];
        disabled?: boolean;
        data?: T; // Generic data payload
    };

    export type TreeViewSize = VariantProps<typeof treeViewVariants>["size"];
    export type TreeItemVariant = VariantProps<typeof treeItemVariants>["variant"];

    export type ContextMenuEvent<T = Record<string, any>> = {
        item: TreeItem<T>;
        event: MouseEvent;
    };

    export type DragDropData<T = Record<string, any>> = {
        draggedItem: TreeItem<T>;
        targetItem: TreeItem<T>;
        position: 'above' | 'below' | 'inside';
    };

    export type TreeViewProps<T = Record<string, any>> = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
        items: TreeItem<T>[];
        size?: TreeViewSize;
        selectedId?: string;
        expandedIds?: Set<string> | string[];
        multiSelect?: boolean;
        selectedIds?: Set<string> | string[];
        indentSize?: number;
        enableDragDrop?: boolean;
        onSelect?: (item: TreeItem<T>, selected: boolean) => void;
        onExpand?: (item: TreeItem<T>, expanded: boolean) => void;
        onContextMenu?: (event: ContextMenuEvent<T>) => void;
        onDragStart?: (item: TreeItem<T>) => void;
        onDragEnd?: () => void;
        onDrop?: (data: DragDropData<T>) => void;
        canDrop?: (draggedItem: TreeItem<T>, targetItem: TreeItem<T>, position: 'above' | 'below' | 'inside') => boolean;
        renderIcon?: (item: TreeItem<T>, isExpanded?: boolean) => any;
        renderLabel?: (item: TreeItem<T>) => string | { render: () => any };
        getItemVariant?: (item: TreeItem<T>) => TreeItemVariant;
    };
</script>

<script lang="ts" generics="T extends Record<string, any>">
    import TreeNode from "./tree-node.svelte";

    let {
        class: className,
        items = [],
        size = "default",
        selectedId = $bindable(),
        expandedIds = $bindable(new Set()),
        multiSelect = false,
        selectedIds = $bindable(new Set()),
        indentSize = 1.5,
        enableDragDrop = false,
        onSelect,
        onExpand,
        onContextMenu,
        onDragStart,
        onDragEnd,
        onDrop,
        canDrop,
        renderIcon,
        renderLabel,
        getItemVariant,
        ref = $bindable(null),
        ...restProps
    }: TreeViewProps<T> = $props();

    // Drag and drop state
    let draggedItemId: string | null = $state(null);
    let draggedItem: TreeItem<T> | null = $state(null);
    let dropPosition: { itemId: string; position: 'above' | 'below' | 'inside' } | null = $state(null);

    // Normalize expandedIds and selectedIds to Sets
    const expandedSet = $derived(expandedIds instanceof Set ? expandedIds : new Set(expandedIds));
    const selectedSet = $derived(selectedIds instanceof Set ? selectedIds : new Set(selectedIds));

    function updateExpandedIds(newSet: Set<string>) {
        if (expandedIds instanceof Set) {
            expandedIds = newSet;
        } else if (Array.isArray(expandedIds)) {
            expandedIds = Array.from(newSet);
        }
    }

    function updateSelectedIds(newSet: Set<string>) {
        if (selectedIds instanceof Set) {
            selectedIds = newSet;
        } else if (Array.isArray(selectedIds)) {
            selectedIds = Array.from(newSet);
        }
    }

    function findItemById(items: TreeItem<T>[], id: string): TreeItem<T> | null {
        for (const item of items) {
            if (item.id === id) {
                return item;
            }
            if (item.children) {
                const found = findItemById(item.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    function handleItemClick(item: TreeItem<T>, event: MouseEvent) {
        if (item.disabled) return;

        // Handle expansion for items with children
        if (item.children?.length) {
            const isExpanded = expandedSet.has(item.id);
            const newExpandedSet = new Set(expandedSet);

            if (isExpanded) {
                newExpandedSet.delete(item.id);
            } else {
                newExpandedSet.add(item.id);
            }

            updateExpandedIds(newExpandedSet);
            onExpand?.(item, !isExpanded);
        }

        // Handle selection
        if (multiSelect) {
            const newSelectedSet = new Set(selectedSet);
            const isSelected = newSelectedSet.has(item.id);

            if (event.ctrlKey || event.metaKey) {
                if (isSelected) {
                    newSelectedSet.delete(item.id);
                } else {
                    newSelectedSet.add(item.id);
                }
            } else {
                newSelectedSet.clear();
                newSelectedSet.add(item.id);
            }

            updateSelectedIds(newSelectedSet);
            onSelect?.(item, newSelectedSet.has(item.id));
        } else {
            selectedId = item.id;
            onSelect?.(item, true);
        }
    }

    function handleContextMenu(item: TreeItem<T>, event: MouseEvent) {
        if (item.disabled) return;

        event.preventDefault();
        onContextMenu?.({ item, event });
    }

    function handleKeyDown(item: TreeItem<T>, event: KeyboardEvent) {
        if (item.disabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                handleItemClick(item, event as any);
                break;
            case 'ArrowRight':
                if (item.children?.length && !expandedSet.has(item.id)) {
                    event.preventDefault();
                    const newExpandedSet = new Set(expandedSet);
                    newExpandedSet.add(item.id);
                    updateExpandedIds(newExpandedSet);
                    onExpand?.(item, true);
                }
                break;
            case 'ArrowLeft':
                if (item.children?.length && expandedSet.has(item.id)) {
                    event.preventDefault();
                    const newExpandedSet = new Set(expandedSet);
                    newExpandedSet.delete(item.id);
                    updateExpandedIds(newExpandedSet);
                    onExpand?.(item, false);
                }
                break;
        }
    }

    function handleDragStart(item: TreeItem<T>, event: DragEvent) {
        if (!enableDragDrop || item.disabled) return;

        draggedItemId = item.id;
        draggedItem = item;

        // Set drag data
        event.dataTransfer!.effectAllowed = 'move';
        event.dataTransfer!.setData('text/plain', item.id);

        onDragStart?.(item);
    }

    function handleDragOver(item: TreeItem<T>, event: DragEvent, position: 'above' | 'below' | 'inside') {
        if (!enableDragDrop || !draggedItem || draggedItem.id === item.id) return;

        event.preventDefault();

        // Check if drop is allowed
        if (canDrop && !canDrop(draggedItem, item, position)) {
            return;
        }

        // Prevent dropping a parent into its own child
        if (isDescendant(draggedItem, item)) {
            return;
        }

        event.dataTransfer!.dropEffect = 'move';
        dropPosition = { itemId: item.id, position };
    }

    function handleDragLeave(event: DragEvent) {
        // Clear drop position if we're leaving the tree entirely
        if (!ref?.contains(event.relatedTarget as Node)) {
            dropPosition = null;
        }
    }

    function handleDrop(item: TreeItem<T>, event: DragEvent, position: 'above' | 'below' | 'inside') {
        if (!enableDragDrop || !draggedItem || draggedItem.id === item.id) return;

        event.preventDefault();

        // Check if drop is allowed
        if (canDrop && !canDrop(draggedItem, item, position)) {
            return;
        }

        // Prevent dropping a parent into its own child
        if (isDescendant(draggedItem, item)) {
            return;
        }

        onDrop?.({
            draggedItem,
            targetItem: item,
            position
        });

        // Clean up
        draggedItemId = null;
        draggedItem = null;
        dropPosition = null;
    }

    function handleDragEnd() {
        draggedItemId = null;
        draggedItem = null;
        dropPosition = null;
        onDragEnd?.();
    }

    function isDescendant(parent: TreeItem<T>, child: TreeItem<T>): boolean {
        if (!parent.children) return false;

        for (const parentChild of parent.children) {
            if (parentChild.id === child.id) {
                return true;
            }
            if (isDescendant(parentChild, child)) {
                return true;
            }
        }
        return false;
    }

    function defaultGetItemVariant(item: TreeItem<T>): TreeItemVariant {
        if (multiSelect) {
            return selectedSet.has(item.id) ? "selected" : "default";
        }
        return selectedId === item.id ? "selected" : "default";
    }

    function defaultCanDrop(draggedItem: TreeItem<T>, targetItem: TreeItem<T>, position: 'above' | 'below' | 'inside'): boolean {
        // Default: allow all drops except into disabled items or when dropping inside non-folder items
        if (targetItem.disabled) return false;
        if (position === 'inside' && !targetItem.children?.length && targetItem.children !== undefined) return false;
        return true;
    }
</script>

<div
    bind:this={ref}
    class={cn(treeViewVariants({ size }), className)}
    role="tree"
    aria-multiselectable={multiSelect}
    {...restProps}
>
    {#each items as item}
        <TreeNode
            {item}
            level={0}
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
            canDrop={canDrop || defaultCanDrop}
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