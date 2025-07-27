<!-- TreeViewItem.svelte -->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils.js';
	import { treeItemVariants } from './variants.js';
	import type { TreeItem, TreeItemVariant } from './types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface TreeViewItemProps<T extends Record<string, unknown>> extends HTMLAttributes<HTMLDivElement> {
		item: TreeItem<T>;
		level?: number;
		selected?: boolean;
		disabled?: boolean;
		dragging?: boolean;
		dropTarget?: boolean;
		dropPosition?: 'above' | 'below' | 'inside' | null;
		variant?: TreeItemVariant;
		indentSize?: number;
		enableDragDrop?: boolean;
		onSelect?: () => void;
		onDragStart?: (event: DragEvent) => void;
		onDragOver?: (event: DragEvent) => void;
		onDragLeave?: (event: DragEvent) => void;
		onDrop?: (event: DragEvent) => void;
		onDragEnd?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		item,
		level = 0,
		selected = false,
		disabled = false,
		dragging = false,
		dropTarget = false,
		dropPosition = null,
		variant = 'default',
		indentSize = 1.5,
		enableDragDrop = false,
		onSelect,
		onDragStart,
		onDragOver,
		onDragLeave,
		onDrop,
		onDragEnd,
		class: className,
		children,
		...restProps
	}: TreeViewItemProps<T> = $props();

	let itemElement: HTMLDivElement | null = $state(null);

	function getDragOverPosition(event: DragEvent): 'above' | 'below' | 'inside' {
		if (!itemElement) return 'inside';

		const rect = itemElement.getBoundingClientRect();
		const y = event.clientY - rect.top;
		const height = rect.height;

		if (y < height * 0.25) return 'above';
		if (y > height * 0.75 && !item.children?.length && !item.isExpandable) return 'below';
		if (y > height * 0.75 && (item.children?.length || item.isExpandable)) return 'inside';
		return 'inside';
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		getDragOverPosition(event);
		onDragOver?.(event);
	}

	function handleDragLeave(event: DragEvent) {
		// Only clear if we're leaving the entire item area
		if (itemElement && !itemElement.contains(event.relatedTarget as Node)) {
			onDragLeave?.(event);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		onDrop?.(event);
	}
</script>

<div
	role="treeitem"
	aria-selected={selected}
	aria-disabled={disabled || item.disabled}
	class="relative"
	data-item-id={item.id}
>
	<!-- Drop indicator above -->
	{#if dropTarget && dropPosition === 'above'}
		<div
			class="absolute top-0 right-0 left-0 z-10 h-0.5 bg-primary animate-pulse"
			style="left: {level * indentSize + 0.5}rem"
		></div>
	{/if}

	<div
		bind:this={itemElement}
		class={cn(
			treeItemVariants({
				variant: selected ? 'selected' : variant,
				disabled: disabled || item.disabled
			}),
			dragging && 'opacity-50 scale-95',
			dropTarget && dropPosition === 'inside' && 'ring-1 ring-primary/60 bg-primary/8 border-primary/20',
			'group relative overflow-hidden',
			className
		)}
		style="padding-left: {level * indentSize + 0.5}rem"
		draggable={enableDragDrop && !disabled && !item.disabled}
		onclick={onSelect}
		ondragstart={enableDragDrop ? onDragStart : undefined}
		ondragover={enableDragDrop ? handleDragOver : undefined}
		ondragleave={enableDragDrop ? handleDragLeave : undefined}
		ondrop={enableDragDrop ? handleDrop : undefined}
		ondragend={enableDragDrop ? onDragEnd : undefined}
		tabindex={disabled || item.disabled ? -1 : 0}
		role="button"
		aria-label={item.label}
		{...restProps}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>

	<!-- Drop indicator below -->
	{#if dropTarget && dropPosition === 'below'}
		<div
			class="absolute right-0 bottom-0 left-0 z-10 h-0.5 bg-primary animate-pulse"
			style="left: {level * indentSize + 0.5}rem"
		></div>
	{/if}
</div>