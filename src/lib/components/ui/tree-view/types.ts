import type { HTMLAttributes } from 'svelte/elements';
import type { VariantProps } from 'tailwind-variants';
import { treeItemVariants, treeViewVariants } from './variants';

export type TreeItem<T = Record<string, any>> = {
    id: string;
    label: string;
    icon?: any;
    children?: TreeItem<T>[];
    disabled?: boolean;
    data?: T;
    isExpandable?: boolean; // Indicates if the item can have children even if children array is empty
};

export type TreeViewSize = VariantProps<typeof treeViewVariants>['size'];
export type TreeItemVariant = VariantProps<typeof treeItemVariants>['variant'];

export type ContextMenuEvent<T = Record<string, any>> = {
    item: TreeItem<T>;
    event: MouseEvent;
};

export type TreeViewProps<T = Record<string, any>> = HTMLAttributes<HTMLDivElement> & {
    items: TreeItem<T>[];
    size?: TreeViewSize;
    selectedId?: string;
    expandedIds?: Set<string> | string[];
    multiSelect?: boolean;
    selectedIds?: Set<string> | string[];
    indentSize?: number;
    onSelect?: (item: TreeItem<T>, selected: boolean) => void;
    onExpand?: (item: TreeItem<T>, expanded: boolean) => void;
    onContextMenu?: (event: ContextMenuEvent<T>) => void;
    renderIcon?: (item: TreeItem<T>, isExpanded?: boolean) => any;
    renderLabel?: (item: TreeItem<T>) => string | { render: () => any };
    getItemVariant?: (item: TreeItem<T>) => TreeItemVariant;
};