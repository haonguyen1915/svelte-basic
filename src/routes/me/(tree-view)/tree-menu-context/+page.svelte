<script lang="ts">
	import { TreeViewGroup, TreeViewItem } from '$lib/components/ui/tree-view';
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
	import { Folder, FolderOpen, File, Copy, Trash2, Edit, FolderPlus, FilePlus } from 'lucide-svelte';

	// Sample tree data
	const treeData: TreeItem[] = [
		{
			id: '1',
			label: 'src',
			children: [
				{
					id: '1.1',
					label: 'components',
					children: [
						{ id: '1.1.1', label: 'Button.svelte' },
						{ id: '1.1.2', label: 'Input.svelte' }
					]
				},
				{
					id: '1.2',
					label: 'routes',
					children: [
						{ id: '1.2.1', label: '+page.svelte' },
						{ id: '1.2.2', label: '+layout.svelte' }
					]
				},
				{ id: '1.3', label: 'app.html' }
			]
		},
		{
			id: '2',
			label: 'static',
			children: [
				{ id: '2.1', label: 'favicon.png' },
				{ id: '2.2', label: 'robots.txt' }
			]
		},
		{ id: '3', label: 'package.json' },
		{ id: '4', label: 'README.md' }
	];

	let expandedIds = $state(new Set(['1', '1.1', '1.2', '2']));
	let selectedId = $state('');
	let lastAction = $state('');

	function handleSelect(item: TreeItem) {
		selectedId = item.id;
	}

	function handleExpand(item: TreeItem, expanded: boolean) {
		if (expanded) {
			expandedIds = new Set([...expandedIds, item.id]);
		} else {
			expandedIds = new Set([...expandedIds].filter(id => id !== item.id));
		}
		expandedIds = expandedIds;
	}

	function handleAction(action: string, item: TreeItem) {
		lastAction = `${action}: ${item.label}`;
	}

	function getIcon(item: TreeItem, isExpanded?: boolean) {
		const hasChildren = item.children && item.children.length > 0;
		if (hasChildren) {
			return isExpanded ? FolderOpen : Folder;
		}
		return File;
	}

	function isFolder(item: TreeItem): boolean {
		return !!(item.children && item.children.length > 0);
	}

</script>

<div class="container mx-auto p-6 max-w-4xl">
	<h1 class="text-2xl font-bold mb-6">Tree View with Context Menu</h1>
	
	<div class="border rounded-lg p-4 bg-background">
		<p class="text-sm text-muted-foreground mb-4">Right-click on any item to open the context menu</p>
		
		<div class="space-y-1">
			{#each treeData as item}
				{#snippet renderItem(treeItem: TreeItem, level = 0)}
					{#if level === 0}
						<ContextMenu>
							<ContextMenuTrigger class="block">
								<TreeViewGroup
									item={treeItem}
									expanded={expandedIds.has(treeItem.id)}
									onToggle={() => handleExpand(treeItem, !expandedIds.has(treeItem.id))}
									onclick={() => handleSelect(treeItem)}
									class={selectedId === treeItem.id ? 'bg-accent' : ''}
								>
									{#snippet icon(expanded)}
										{@const Icon = getIcon(treeItem, expanded)}
										<Icon class="h-4 w-4 text-muted-foreground" />
									{/snippet}

									{#snippet label()}
										<span class={selectedId === treeItem.id ? 'font-medium' : ''}>{treeItem.label}</span>
									{/snippet}

									{#snippet children()}
										{#if treeItem.children}
											<div class="ml-4 space-y-1 mt-1">
												{#each treeItem.children as child}
													{@render renderItem(child, level + 1)}
												{/each}
											</div>
										{/if}
									{/snippet}
								</TreeViewGroup>
							</ContextMenuTrigger>
							
							<ContextMenuContent class="w-48">
								<ContextMenuItem onclick={() => handleAction('Copy', treeItem)}>
									<Copy class="mr-2 h-4 w-4" />
									Copy
								</ContextMenuItem>
								<ContextMenuItem onclick={() => handleAction('Rename', treeItem)}>
									<Edit class="mr-2 h-4 w-4" />
									Rename
								</ContextMenuItem>
								<ContextMenuItem onclick={() => handleAction('Delete', treeItem)} class="text-destructive">
									<Trash2 class="mr-2 h-4 w-4" />
									Delete
								</ContextMenuItem>
								
								<ContextMenuSeparator />
								
								{#if isFolder(treeItem)}
									<ContextMenuSub>
										<ContextMenuSubTrigger>
											New
										</ContextMenuSubTrigger>
										<ContextMenuSubContent class="w-48">
											<ContextMenuItem onclick={() => handleAction('New Folder', treeItem)}>
												<FolderPlus class="mr-2 h-4 w-4" />
												Folder
											</ContextMenuItem>
											<ContextMenuItem onclick={() => handleAction('New File', treeItem)}>
												<FilePlus class="mr-2 h-4 w-4" />
												File
											</ContextMenuItem>
										</ContextMenuSubContent>
									</ContextMenuSub>
								{/if}
							</ContextMenuContent>
						</ContextMenu>
					{:else}
						<ContextMenu>
							<ContextMenuTrigger class="block w-full">
								<TreeViewItem
									item={treeItem}
									{level}
									selected={selectedId === treeItem.id}
									onclick={() => handleSelect(treeItem)}
									variant={selectedId === treeItem.id ? 'selected' : 'default'}
								>
									{#snippet children()}
										{@const ChildIcon = getIcon(treeItem)}
										<div class="flex items-center gap-2">
											<ChildIcon class="h-4 w-4 text-muted-foreground" />
											<span>{treeItem.label}</span>
										</div>
									{/snippet}
								</TreeViewItem>
							</ContextMenuTrigger>
							
							<ContextMenuContent class="w-48">
								<ContextMenuItem onclick={() => handleAction('Copy', treeItem)}>
									<Copy class="mr-2 h-4 w-4" />
									Copy
								</ContextMenuItem>
								<ContextMenuItem onclick={() => handleAction('Rename', treeItem)}>
									<Edit class="mr-2 h-4 w-4" />
									Rename
								</ContextMenuItem>
								<ContextMenuItem onclick={() => handleAction('Delete', treeItem)} class="text-destructive">
									<Trash2 class="mr-2 h-4 w-4" />
									Delete
								</ContextMenuItem>
								
								<ContextMenuSeparator />
								
								{#if isFolder(treeItem)}
									<ContextMenuSub>
										<ContextMenuSubTrigger>
											New
										</ContextMenuSubTrigger>
										<ContextMenuSubContent class="w-48">
											<ContextMenuItem onclick={() => handleAction('New Folder', treeItem)}>
												<FolderPlus class="mr-2 h-4 w-4" />
												Folder
											</ContextMenuItem>
											<ContextMenuItem onclick={() => handleAction('New File', treeItem)}>
												<FilePlus class="mr-2 h-4 w-4" />
												File
											</ContextMenuItem>
										</ContextMenuSubContent>
									</ContextMenuSub>
								{/if}
							</ContextMenuContent>
						</ContextMenu>
					{/if}
				{/snippet}
				
				{@render renderItem(item)}
			{/each}
		</div>
	</div>

	{#if lastAction}
		<div class="mt-4 p-3 bg-muted rounded-lg">
			<p class="text-sm">Last action: <span class="font-medium">{lastAction}</span></p>
		</div>
	{/if}
	
	<div class="mt-6 space-y-2 text-sm text-muted-foreground">
		<p>Features:</p>
		<ul class="list-disc list-inside space-y-1 ml-4">
			<li>Right-click on any item to show context menu</li>
			<li>Different menu options for files and folders</li>
			<li>Nested submenu for creating new items in folders</li>
			<li>Visual feedback for selected items</li>
			<li>Icons for files and folders</li>
		</ul>
	</div>
</div>