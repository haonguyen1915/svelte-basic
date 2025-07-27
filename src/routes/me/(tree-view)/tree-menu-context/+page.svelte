<script lang="ts">
	import type { TreeItem } from '$lib/components/ui/tree-view/types';
	import TreeNodeWithMenu from './TreeNodeWithMenu.svelte';
	import { Folder, FolderOpen, File } from 'lucide-svelte';

	// Sample tree data
	let treeData: TreeItem[] = $state([
		{
			id: '1',
			label: 'src',
			data: { type: 'folder' },
			children: [
				{
					id: '1.1',
					label: 'components',
					data: { type: 'folder' },
					children: [
						{ id: '1.1.1', label: 'Button.svelte', data: { type: 'file', extension: 'svelte' } },
						{ id: '1.1.2', label: 'Input.svelte', data: { type: 'file', extension: 'svelte' } }
					]
				},
				{
					id: '1.2',
					label: 'routes',
					data: { type: 'folder' },
					children: [
						{ id: '1.2.1', label: '+page.svelte', data: { type: 'file', extension: 'svelte' } },
						{ id: '1.2.2', label: '+layout.svelte', data: { type: 'file', extension: 'svelte' } }
					]
				},
				{ id: '1.3', label: 'app.html', data: { type: 'file', extension: 'html' } }
			],
			isExpandable: true
		},
		{
			id: '2',
			label: 'static',
			data: { type: 'folder' },
			isExpandable: true,
			children: [
				{ id: '2.1', label: 'favicon.png', data: { type: 'file', extension: 'png' } },
				{ id: '2.2', label: 'robots.txt', data: { type: 'file', extension: 'txt' } }
			]
		},
		{ id: '3', label: 'package.json', data: { type: 'file', extension: 'json' } },
		{ id: '4', label: 'README.md', data: { type: 'file', extension: 'md' } }
	]);

	let expandedIds = $state(new Set(['1', '1.1', '1.2', '2']));
	let selectedId = $state<string | null>(null);
	let lastAction = $state('');
	let editingId = $state('');
	let editValue = $state('');
	let copiedItem: TreeItem | null = $state(null);
	let idCounter = $state(100); // For generating new IDs


	function handleToggle(item: TreeItem) {
		if (expandedIds.has(item.id)) {
			expandedIds.delete(item.id);
		} else {
			expandedIds.add(item.id);
		}
		expandedIds = new Set(expandedIds);
	}

	function handleSelect(item: TreeItem) {
		selectedId = item.id;
	}

	function startRename(item: TreeItem) {
		editingId = item.id;
		editValue = item.label;
		lastAction = `Renaming: ${item.label}`;
	}

	function confirmRename() {
		if (editingId && editValue.trim()) {
			updateTreeItem(treeData, editingId, (item) => {
				item.label = editValue.trim();
				lastAction = `Renamed to: ${item.label}`;
			});
			treeData = [...treeData];
		}
		cancelEdit();
	}

	function cancelEdit() {
		editingId = '';
		editValue = '';
	}

	function handleCopy(item: TreeItem) {
		copiedItem = structuredClone(item);
		lastAction = `Copied: ${item.label}`;
	}

	function handlePaste(targetItem: TreeItem) {
		if (!copiedItem) return;
		
		const newItem = structuredClone(copiedItem);
		newItem.id = generateNewId();
		// Recursively update IDs for all children
		updateItemIds(newItem);
		
		if (isFolder(targetItem)) {
			updateTreeItem(treeData, targetItem.id, (item) => {
				if (!item.children) item.children = [];
				item.children.push(newItem);
			});
			expandedIds.add(targetItem.id);
			expandedIds = new Set(expandedIds);
		} else {
			// Paste as sibling
			insertSibling(treeData, targetItem.id, newItem);
		}
		
		treeData = [...treeData];
		lastAction = `Pasted: ${newItem.label}`;
	}

	function handleDelete(item: TreeItem) {
		if (confirm(`Are you sure you want to delete "${item.label}"?`)) {
			deleteItem(treeData, item.id);
			treeData = [...treeData];
			lastAction = `Deleted: ${item.label}`;
			if (selectedId === item.id) {
				selectedId = null;
			}
		}
	}

	function handleNewFolder(parentItem: TreeItem) {
		const newId = generateNewId();
		const newFolder: TreeItem = {
			id: newId,
			label: 'New Folder',
			data: { type: 'folder' },
			children: [],
			isExpandable: true
		};
		
		updateTreeItem(treeData, parentItem.id, (item) => {
			if (!item.children) item.children = [];
			item.children.push(newFolder);
		});
		
		expandedIds.add(parentItem.id);
		expandedIds = new Set(expandedIds);
		treeData = [...treeData];
		lastAction = `Created folder in: ${parentItem.label}`;
		
		// Start editing the new folder name
		setTimeout(() => startRename(newFolder), 100);
	}

	function handleNewFile(parentItem: TreeItem) {
		const newId = generateNewId();
		const newFile: TreeItem = {
			id: newId,
			label: 'untitled.txt',
			data: { type: 'file', extension: 'txt' }
		};
		
		updateTreeItem(treeData, parentItem.id, (item) => {
			if (!item.children) item.children = [];
			item.children.push(newFile);
		});
		
		expandedIds.add(parentItem.id);
		expandedIds = new Set(expandedIds);
		treeData = [...treeData];
		lastAction = `Created file in: ${parentItem.label}`;
		
		// Start editing the new file name
		setTimeout(() => startRename(newFile), 100);
	}

	// Helper functions
	function generateNewId(): string {
		return `new-${idCounter++}`;
	}

	function updateItemIds(item: TreeItem) {
		item.id = generateNewId();
		if (item.children) {
			item.children.forEach(child => updateItemIds(child));
		}
	}

	function updateTreeItem(items: TreeItem[], targetId: string, updateFn: (item: TreeItem) => void): boolean {
		for (const item of items) {
			if (item.id === targetId) {
				updateFn(item);
				return true;
			}
			if (item.children && updateTreeItem(item.children, targetId, updateFn)) {
				return true;
			}
		}
		return false;
	}

	function deleteItem(items: TreeItem[], targetId: string): boolean {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id === targetId) {
				items.splice(i, 1);
				return true;
			}
			if (items[i].children && deleteItem(items[i].children!, targetId)) {
				return true;
			}
		}
		return false;
	}

	function insertSibling(items: TreeItem[], targetId: string, newItem: TreeItem): boolean {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id === targetId) {
				items.splice(i + 1, 0, newItem);
				return true;
			}
			if (items[i].children && insertSibling(items[i].children!, targetId, newItem)) {
				return true;
			}
		}
		return false;
	}

	function getIcon(item: TreeItem, isExpanded?: boolean) {
		if (item.data?.type === 'folder' || item.isExpandable) {
			return isExpanded ? FolderOpen : Folder;
		}
		return File;
	}

	function isFolder(item: TreeItem): boolean {
		return item.data?.type === 'folder' || item.isExpandable || !!(item.children && item.children.length > 0);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (editingId) {
			if (e.key === 'Enter') {
				confirmRename();
			} else if (e.key === 'Escape') {
				cancelEdit();
			}
		}
	}

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="container mx-auto p-6 max-w-4xl">
	<h1 class="text-2xl font-bold mb-6">Tree View with Context Menu (Using TreeNode)</h1>
	
	<div class="border rounded-lg p-4 bg-background">
		<p class="text-sm text-muted-foreground mb-4">Right-click on any item to open the context menu</p>
		
		<!-- Tree with context menu on all items -->
		<div class="tree-container">
			{#each treeData as item}
				<TreeNodeWithMenu
					{item}
					level={0}
					{expandedIds}
					{selectedId}
					{editingId}
					{editValue}
					{copiedItem}
					onToggle={handleToggle}
					onSelect={handleSelect}
					onRename={startRename}
					onCopy={handleCopy}
					onPaste={handlePaste}
					onDelete={handleDelete}
					onNewFolder={handleNewFolder}
					onNewFile={handleNewFile}
					onEditValueChange={(value) => editValue = value}
					onConfirmRename={confirmRename}
					{getIcon}
				/>
			{/each}
		</div>
		
		<div class="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
			<p class="font-medium mb-1">Context Menu Support:</p>
			<p>Right-click works on all items including nested ones. The custom TreeNodeWithMenu component handles context menus recursively for the entire tree structure.</p>
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
			<li>Uses custom TreeNodeWithMenu component for tree rendering with context menus</li>
			<li>Right-click context menu on ALL items (including nested items)</li>
			<li>Rename items with inline editing (Enter to confirm, Esc to cancel)</li>
			<li>Copy and paste items (paste into folders or as siblings)</li>
			<li>Delete items with confirmation</li>
			<li>Create new folders and files inside folders</li>
			<li>All operations update the tree structure in real-time</li>
		</ul>
		
		{#if copiedItem}
			<p class="mt-2 text-xs">Clipboard: {copiedItem.label}</p>
		{/if}
	</div>
</div>
