import type { HTMLAttributes } from 'svelte/elements';
import type { VariantProps } from 'tailwind-variants';
import type { WithElementRef } from '$lib/utils.js';
import { treeItemVariants, treeViewVariants } from './variants';

export type TreeItem<T = Record<string, unknown>> = {
	id: string;
	label: string;
	icon?: unknown; // Component constructor or string
	children?: TreeItem<T>[];
	disabled?: boolean;
	data?: T; // Generic data payload
	isExpandable?: boolean; // Indicates if the item can have children even if children array is empty
};

export type TreeViewSize = VariantProps<typeof treeViewVariants>['size'];
export type TreeItemVariant = VariantProps<typeof treeItemVariants>['variant'];

export type ContextMenuEvent<T = Record<string, unknown>> = {
	item: TreeItem<T>;
	event: MouseEvent;
};

export type DragDropData<T = Record<string, unknown>> = {
	draggedItem: TreeItem<T>;
	targetItem: TreeItem<T>;
	position: 'above' | 'below' | 'inside';
};

export type TreeViewProps<T = Record<string, unknown>> = WithElementRef<
	HTMLAttributes<HTMLDivElement>
> & {
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
	canDrop?: (
		draggedItem: TreeItem<T>,
		targetItem: TreeItem<T>,
		position: 'above' | 'below' | 'inside'
	) => boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderIcon?: (item: TreeItem<T>, isExpanded?: boolean) => any;
	renderLabel?: (item: TreeItem<T>) => string | { render: () => unknown };
	getItemVariant?: (item: TreeItem<T>) => TreeItemVariant;
};
