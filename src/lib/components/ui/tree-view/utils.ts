import type { TreeItem } from './types.js';

export interface DropPositionConfig {
	aboveThreshold?: number; // Default: 0.3 (30%)
	belowThreshold?: number; // Default: 0.7 (70%)
}

export function getDropPosition(
	event: DragEvent,
	element: HTMLElement,
	item: TreeItem,
	config: DropPositionConfig = {}
): 'above' | 'below' | 'inside' {
	const { aboveThreshold = 0.3, belowThreshold = 0.7 } = config;
	
	const rect = element.getBoundingClientRect();
	const y = event.clientY - rect.top;
	const height = rect.height;
	const relativeY = y / height;
	
	// Above threshold
	if (relativeY < aboveThreshold) {
		return 'above';
	}
	
	// Below threshold - for items that can have children (folders)
	if (relativeY > belowThreshold) {
		const isFolder = item.data?.type === 'folder' || item.children?.length || item.isExpandable;
		// For folders, only return 'inside' if we're not at the very bottom edge
		// This allows dropping below folders when dragging to the bottom 10% of the item
		if (isFolder && relativeY < 0.9) {
			return 'inside';
		}
		return 'below';
	}
	
	// Middle area - default to 'inside'
	return 'inside';
}

export function canDrop(
	draggedItem: TreeItem,
	targetItem: TreeItem,
	position: 'above' | 'below' | 'inside'
): boolean {
	// Don't allow dropping onto itself
	if (draggedItem.id === targetItem.id) return false;
	
	// Only allow dropping inside folders
	if (position === 'inside') {
		const isFolder = targetItem.data?.type === 'folder' || targetItem.children?.length || targetItem.isExpandable;
		if (!isFolder) return false;
	}
	
	// Don't allow dropping a parent into its own descendant
	return !isDescendant(draggedItem, targetItem.id);
	

}

function isDescendant(parent: TreeItem, targetId: string): boolean {
	if (parent.children) {
		for (const child of parent.children) {
			if (child.id === targetId) return true;
			if (isDescendant(child, targetId)) return true;
		}
	}
	return false;
}