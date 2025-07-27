<!-- TreeViewGroup.svelte -->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils.js';
	import { ChevronRight } from 'lucide-svelte';
	import { treeIconVariants } from './variants.js';
	import type { TreeItem } from './types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface TreeViewGroupProps<T extends Record<string, unknown>> extends HTMLAttributes<HTMLDivElement> {
		item: TreeItem<T>;
		expanded?: boolean;
		selected?: boolean;
		level?: number;
		indentSize?: number;
		onToggle?: () => void;
		onSelect?: () => void;
		icon?: import('svelte').Snippet<[boolean]>;
		label?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		enableDragDrop?: boolean;
		dragging?: boolean;
		dropTarget?: boolean;
		dropPosition?: 'above' | 'below' | 'inside' | null;
		onDragStart?: (event: DragEvent) => void;
		onDragOver?: (event: DragEvent) => void;
		onDragLeave?: (event: DragEvent) => void;
		onDrop?: (event: DragEvent) => void;
		onDragEnd?: () => void;
	}

	let {
		item,
		expanded = false,
		selected = false,
		level = 0,
		indentSize = 1.5,
		onToggle,
		onSelect,
		icon,
		label,
		children,
		enableDragDrop = false,
		dragging = false,
		dropTarget = false,
		dropPosition = null,
		onDragStart,
		onDragOver,
		onDragLeave,
		onDrop,
		onDragEnd,
		class: className,
		...restProps
	}: TreeViewGroupProps<T> = $props();

	const hasChildren = $derived(item.children?.length || item.isExpandable);

	let groupElement: HTMLDivElement | null = $state(null);

	function getDragOverPosition(event: DragEvent): 'above' | 'below' | 'inside' {
		if (!groupElement) return 'inside';

		const rect = groupElement.getBoundingClientRect();
		const y = event.clientY - rect.top;
		const height = rect.height;

		if (y < height * 0.25) return 'above';
		if (y > height * 0.75 && !hasChildren) return 'below';
		return 'inside';
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		getDragOverPosition(event);
		onDragOver?.(event);
	}

	function handleDragLeave(event: DragEvent) {
		// Only clear if we're leaving the entire group area
		if (groupElement && !groupElement.contains(event.relatedTarget as Node)) {
			onDragLeave?.(event);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		onDrop?.(event);
	}

	function handleChevronClick(event: MouseEvent) {
		event.stopPropagation();
		if (hasChildren) {
			onToggle?.();
		}
	}

	function handleFolderNameClick(event: MouseEvent) {
		event.stopPropagation();
		onSelect?.();
	}

	function handleFolderDoubleClick(event: MouseEvent) {
		event.stopPropagation();
		if (hasChildren) {
			onToggle?.();
		}
	}
</script>

<div
	role="treeitem"
	aria-expanded={hasChildren ? expanded : undefined}
	aria-disabled={item.disabled}
	class={cn('relative', className)}
	data-item-id={item.id}
	{...restProps}
>
	<!-- Drop indicator above -->
	{#if dropTarget && dropPosition === 'above'}
		<div
			class="absolute top-0 right-0 left-0 z-10 h-0.5 bg-primary animate-pulse"
			style="left: {level * indentSize}rem"
		></div>
	{/if}

	<!-- Group header with expand/collapse -->
	<div
		bind:this={groupElement}
		class={cn(
			dragging && 'opacity-50 scale-95',
			dropTarget && dropPosition === 'inside' && 'ring-2 ring-primary ring-offset-2 bg-primary/5',
			'relative'
		)}
		draggable={enableDragDrop && !item.disabled}
		ondragstart={enableDragDrop ? onDragStart : undefined}
		ondragover={enableDragDrop ? handleDragOver : undefined}
		ondragleave={enableDragDrop ? handleDragLeave : undefined}
		ondrop={enableDragDrop ? handleDrop : undefined}
		ondragend={enableDragDrop ? onDragEnd : undefined}
		role="group"
		aria-label={item.label}
	>
		<div class="flex items-center w-full" style="padding-left: {level * indentSize}rem">
			<!-- Expand/Collapse Icon -->
			{#if hasChildren}
				<button
					type="button"
					onclick={handleChevronClick}
					disabled={item.disabled}
					class="flex items-center justify-center w-6 h-6 rounded hover:bg-accent/50 transition-colors"
					aria-label={expanded ? 'Collapse' : 'Expand'}
				>
					<ChevronRight class={cn(treeIconVariants({ expanded }), 'size-4 text-muted-foreground')} />
				</button>
			{:else}
				<div class="w-6 h-6"></div>
			{/if}

			<!-- Folder content area -->
			<button
				type="button"
				onclick={handleFolderNameClick}
				ondblclick={handleFolderDoubleClick}
				disabled={item.disabled}
				class={cn(
					"flex items-center flex-1 h-8 px-2 rounded transition-all duration-200 hover:bg-accent/30 hover:shadow-sm",
					selected && "bg-accent/80 shadow-sm"
				)}
			>
				<!-- Icon slot -->
				{#if icon}
					<div class="flex size-5 shrink-0 items-center justify-center mr-2">
						{@render icon(expanded)}
					</div>
				{/if}

				<!-- Label slot -->
				{#if label}
					<div class="flex-1 truncate text-left">
						{@render label()}
					</div>
				{:else}
					<span class="flex-1 truncate text-left">{item.label}</span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Drop indicator below -->
	{#if dropTarget && dropPosition === 'below'}
		<div
			class="absolute right-0 bottom-0 left-0 z-10 h-0.5 bg-primary animate-pulse"
			style="left: {level * indentSize}rem"
		></div>
	{/if}

	<!-- Children -->
	{#if expanded && children}
		<div class="animate-in slide-in-from-top-1 duration-200">
			{@render children()}
		</div>
	{/if}
</div>