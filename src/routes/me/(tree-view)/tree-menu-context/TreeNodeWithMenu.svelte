<script lang="ts">
	import type { TreeItem } from '$lib/components/ui/tree-view/types';
	import {
		ContextMenu,
		ContextMenuContent,
		ContextMenuItem,
		ContextMenuSeparator,
		ContextMenuSub,
		ContextMenuSubContent,
		ContextMenuSubTrigger,
		ContextMenuTrigger
	} from '$lib/components/ui/context-menu';
	import { Input } from '$lib/components/ui/input';
	import { TreeViewGroup, TreeViewItem } from '$lib/components/ui/tree-view';
	import { Folder, FolderOpen, File, Copy, Trash2, Edit, FolderPlus, FilePlus } from 'lucide-svelte';
	import TreeNodeWithMenu from './TreeNodeWithMenu.svelte';

	type Props = {
		item: TreeItem;
		level?: number;
		expandedIds: Set<string>;
		selectedId?: string | null;
		editingId?: string;
		editValue?: string;
		copiedItem?: TreeItem | null;
		onToggle?: (item: TreeItem) => void;
		onSelect?: (item: TreeItem) => void;
		onRename?: (item: TreeItem) => void;
		onCopy?: (item: TreeItem) => void;
		onPaste?: (item: TreeItem) => void;
		onDelete?: (item: TreeItem) => void;
		onNewFolder?: (item: TreeItem) => void;
		onNewFile?: (item: TreeItem) => void;
		onEditValueChange?: (value: string) => void;
		onConfirmRename?: () => void;
		getIcon?: (item: TreeItem, isExpanded?: boolean) => typeof Folder;
		class?: string;
	};

	let {
		item,
		level = 0,
		expandedIds,
		selectedId = null,
		editingId = '',
		editValue = '',
		copiedItem = null,
		onToggle,
		onSelect,
		onRename,
		onCopy,
		onPaste,
		onDelete,
		onNewFolder,
		onNewFile,
		onEditValueChange,
		onConfirmRename,
		getIcon = defaultGetIcon,
		class: className = ''
	}: Props = $props();

	function defaultGetIcon(item: TreeItem, isExpanded?: boolean): typeof Folder {
		if (item.data?.type === 'folder' || item.isExpandable) {
			return isExpanded ? FolderOpen : Folder;
		}
		return File;
	}

	function isFolder(item: TreeItem): boolean {
		return item.data?.type === 'folder' || item.isExpandable || !!(item.children && item.children.length > 0);
	}

	const isExpanded = $derived(expandedIds.has(item.id));
	const isSelected = $derived(selectedId === item.id);
	const isEditing = $derived(editingId === item.id);
</script>

<ContextMenu>
	<ContextMenuTrigger class="block">
		{#if isEditing}
			{@const Icon = getIcon(item, isExpanded)}
			<div class="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent" style="margin-left: {level * 16}px">
				<Icon class="h-4 w-4 text-muted-foreground" />
				<Input
					value={editValue}
					oninput={(e) => onEditValueChange?.(e.currentTarget.value)}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							onConfirmRename?.();
						} else if (e.key === 'Escape') {
							onEditValueChange?.(item.label);
							onConfirmRename?.();
						}
					}}
					class="h-6 px-1 py-0 text-sm flex-1"
					onclick={(e) => e.stopPropagation()}
				/>
			</div>
		{:else if isFolder(item)}
			<TreeViewGroup
				{item}
				expanded={isExpanded}
				selected={isSelected}
				onToggle={() => onToggle?.(item)}
				onSelect={() => onSelect?.(item)}
				class="mb-1 {className}"
			>
				{#snippet icon(expanded)}
					{@const Icon = getIcon(item, expanded)}
					<Icon class="h-4 w-4 text-muted-foreground" />
				{/snippet}

				{#snippet label()}
					<span>{item.label}</span>
				{/snippet}

				{#snippet children()}
					{#if item.children && isExpanded}
						<div class="ml-4 space-y-1 mt-1">
							{#each item.children as child}
								<TreeNodeWithMenu
									item={child}
									level={level + 1}
									{expandedIds}
									{selectedId}
									{editingId}
									{editValue}
									{copiedItem}
									{onToggle}
									{onSelect}
									{onRename}
									{onCopy}
									{onPaste}
									{onDelete}
									{onNewFolder}
									{onNewFile}
									{onEditValueChange}
									{onConfirmRename}
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
				selected={isSelected}
				onSelect={() => onSelect?.(item)}
				class={className}
			>
				{#snippet children()}
					{@const Icon = getIcon(item, false)}
					<div class="flex items-center gap-2">
						<Icon class="h-4 w-4 text-muted-foreground" />
						<span>{item.label}</span>
					</div>
				{/snippet}
			</TreeViewItem>
		{/if}
	</ContextMenuTrigger>

	<ContextMenuContent class="w-48">
		<ContextMenuItem onclick={() => onRename?.(item)}>
			<Edit class="mr-2 h-4 w-4" />
			Rename
		</ContextMenuItem>
		<ContextMenuItem onclick={() => onCopy?.(item)}>
			<Copy class="mr-2 h-4 w-4" />
			Copy
		</ContextMenuItem>
		{#if copiedItem}
			<ContextMenuItem onclick={() => onPaste?.(item)}>
				<Copy class="mr-2 h-4 w-4" />
				Paste
			</ContextMenuItem>
		{/if}
		<ContextMenuItem onclick={() => onDelete?.(item)} class="text-destructive">
			<Trash2 class="mr-2 h-4 w-4" />
			Delete
		</ContextMenuItem>

		{#if isFolder(item)}
			<ContextMenuSeparator />
			<ContextMenuSub>
				<ContextMenuSubTrigger>New</ContextMenuSubTrigger>
				<ContextMenuSubContent class="w-48">
					<ContextMenuItem onclick={() => onNewFolder?.(item)}>
						<FolderPlus class="mr-2 h-4 w-4" />
						Folder
					</ContextMenuItem>
					<ContextMenuItem onclick={() => onNewFile?.(item)}>
						<FilePlus class="mr-2 h-4 w-4" />
						File
					</ContextMenuItem>
				</ContextMenuSubContent>
			</ContextMenuSub>
		{/if}
	</ContextMenuContent>
</ContextMenu>