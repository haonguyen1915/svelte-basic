<!-- TreeViewGroup.svelte -->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils.js';
	import { ChevronRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { treeIconVariants } from './variants.js';
	import type { TreeItem } from './types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface TreeViewGroupProps<T extends Record<string, unknown>> extends HTMLAttributes<HTMLDivElement> {
		item: TreeItem<T>;
		expanded?: boolean;
		level?: number;
		indentSize?: number;
		onToggle?: () => void;
		icon?: import('svelte').Snippet<[boolean]>;
		label?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		item,
		expanded = false,
		level = 0,
		indentSize = 1.5,
		onToggle,
		icon,
		label,
		children,
		class: className,
		...restProps
	}: TreeViewGroupProps<T> = $props();

	const hasChildren = $derived(item.children?.length || item.isExpandable);
</script>

<div class={cn('relative', className)} {...restProps}>
	<!-- Group header with expand/collapse -->
	<Button
		variant="ghost"
		size="sm"
		onclick={hasChildren ? onToggle : undefined}
		disabled={!hasChildren}
		class="h-auto w-full justify-start rounded-lg transition-all duration-200 hover:bg-accent/30 hover:shadow-sm"
		style="padding-left: {level * indentSize}rem"
		aria-label={hasChildren ? (expanded ? 'Collapse' : 'Expand') : undefined}
	>
		<!-- Expand/Collapse Icon -->
		{#if hasChildren}
			<ChevronRight class={cn(treeIconVariants({ expanded }), 'size-4 text-muted-foreground')} />
		{:else}
			<div class="size-4"></div>
		{/if}

		<!-- Icon slot -->
		{#if icon}
			<div class="flex size-5 shrink-0 items-center justify-center">
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
	</Button>

	<!-- Children -->
	{#if expanded && children}
		<div class="animate-in slide-in-from-top-1 duration-200">
			{@render children()}
		</div>
	{/if}
</div>