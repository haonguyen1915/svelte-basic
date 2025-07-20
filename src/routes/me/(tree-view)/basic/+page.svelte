<script lang="ts">
    import TreeView from "$lib/components/ui/tree-view/tree-view.svelte";
    import type { TreeItem, ContextMenuEvent, TreeItemVariant } from "$lib/components/ui/tree-view/tree-view.svelte";
    import {
        FileText,
        Image,
        Video,
        Music,
        Archive,
        Settings,
        Trash,
        Star
    } from "lucide-svelte";

    interface CustomData {
        fileType: string;
        size: number;
        isBookmarked?: boolean;
        isImportant?: boolean;
        permissions: string[];
    }

    const items: TreeItem<CustomData>[] = [
        {
            id: "documents",
            label: "Documents",
            icon: FileText,
            data: { fileType: "folder", size: 0, permissions: ["read", "write"] },
            children: [
                {
                    id: "important-doc",
                    label: "Important Document.pdf",
                    data: {
                        fileType: "pdf",
                        size: 2048576,
                        isImportant: true,
                        permissions: ["read"]
                    }
                },
                {
                    id: "draft",
                    label: "Draft.docx",
                    data: { fileType: "docx", size: 1024000, permissions: ["read", "write"] }
                }
            ]
        },
        {
            id: "media",
            label: "Media Files",
            icon: Image,
            data: { fileType: "folder", size: 0, permissions: ["read", "write"] },
            children: [
                {
                    id: "photo1",
                    label: "Photo.jpg",
                    icon: Image,
                    data: {
                        fileType: "image",
                        size: 5242880,
                        isBookmarked: true,
                        permissions: ["read"]
                    }
                },
                {
                    id: "video1",
                    label: "Video.mp4",
                    icon: Video,
                    data: { fileType: "video", size: 104857600, permissions: ["read"] }
                }
            ]
        },
        {
            id: "system",
            label: "System Files",
            icon: Settings,
            disabled: true,
            data: { fileType: "folder", size: 0, permissions: [] }
        }
    ];

    // State management
    let selectedId = $state<string>();
    let selectedIds = $state(new Set<string>());
    let expandedIds = $state(new Set(["documents", "media"]));

    // Configuration
    let multiSelect = $state(false);
    let size: "sm" | "default" | "lg" = $state("default");
    let indentSize = $state(1.5);

    // Event handlers
    function handleSelect(item: TreeItem<CustomData>, selected: boolean) {
        console.log(`Selected: ${item.label}`, {
            selected,
            data: item.data,
            multiSelect
        });

        // Custom logic based on file type
        if (item.data?.fileType === "pdf") {
            console.log("Opening PDF viewer...");
        }
    }

    function handleExpand(item: TreeItem<CustomData>, expanded: boolean) {
        console.log(`${expanded ? 'Expanded' : 'Collapsed'}: ${item.label}`);

        // Lazy loading example
        if (expanded && item.id === "media" && item.children?.length === 2) {
            // Simulate loading more items
            console.log("Loading more media files...");
        }
    }

    function handleContextMenu(event: ContextMenuEvent<CustomData>) {
        console.log("Context menu for:", event.item.label, "at", event.event.clientX, event.event.clientY);

        // You could show a custom context menu here
        showCustomContextMenu(event);
    }

    // Custom rendering functions
    function renderIcon(item: TreeItem<CustomData>, isExpanded?: boolean) {
        // Priority: custom icon > file type icon > default
        if (item.icon) {
            return item.icon;
        }

        switch (item.data?.fileType) {
            case "pdf":
            case "docx":
                return FileText;
            case "image":
                return Image;
            case "video":
                return Video;
            case "audio":
                return Music;
            case "archive":
                return Archive;
            case "folder":
                return isExpanded ? "📂" : "📁"; // String icon example
            default:
                return FileText;
        }
    }

    function renderLabel(item: TreeItem<CustomData>) {
        // Add badges or modify labels
        let label = item.label;

        if (item.data?.isImportant) {
            return {
                render: () => `⭐ ${label}`
            };
        }

        if (item.data?.isBookmarked) {
            label = `🔖 ${label}`;
        }

        // Add file size for files
        if (item.data?.size && item.data.size > 0) {
            const sizeStr = formatFileSize(item.data.size);
            label = `${label} (${sizeStr})`;
        }

        return label;
    }

    function getItemVariant(item: TreeItem<CustomData>): TreeItemVariant {
        if (item.data?.isImportant) {
            return "active";
        }

        if (multiSelect) {
            return selectedIds.has(item.id) ? "selected" : "default";
        }

        return selectedId === item.id ? "selected" : "default";
    }

    // Utility functions
    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showCustomContextMenu(event: ContextMenuEvent<CustomData>) {
        // Custom context menu implementation
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'fixed';
        menu.style.left = event.event.clientX + 'px';
        menu.style.top = event.event.clientY + 'px';
        menu.style.background = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '4px';
        menu.style.padding = '8px';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        menu.style.zIndex = '1000';

        const actions = ['Open', 'Copy', 'Delete', 'Properties'];
        actions.forEach(action => {
            const item = document.createElement('div');
            item.textContent = action;
            item.style.padding = '4px 8px';
            item.style.cursor = 'pointer';
            item.onmouseenter = () => item.style.background = '#f0f0f0';
            item.onmouseleave = () => item.style.background = 'white';
            item.onclick = () => {
                console.log(`${action} clicked for:`, event.item.label);
                document.body.removeChild(menu);
            };
            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        // Remove menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                document.removeEventListener('click', removeMenu);
            });
        }, 0);
    }

    // Toggle functions for demo
    function toggleMultiSelect() {
        multiSelect = !multiSelect;
        if (!multiSelect) {
            selectedIds.clear();
            selectedIds = selectedIds; // Trigger reactivity
        } else {
            selectedId = undefined;
        }
    }

    function toggleSize() {
        const sizes: Array<"sm" | "default" | "lg"> = ["sm", "default", "lg"];
        const currentIndex = sizes.indexOf(size);
        size = sizes[(currentIndex + 1) % sizes.length];
    }
</script>

<!-- Demo Controls -->
<div class="flex gap-4 mb-4">
    <button onclick={toggleMultiSelect} class="px-4 py-2 bg-blue-500 text-white rounded">
        Toggle Multi-Select ({multiSelect ? 'ON' : 'OFF'})
    </button>
    <button onclick={toggleSize} class="px-4 py-2 bg-green-500 text-white rounded">
        Size: {size}
    </button>
    <label class="flex items-center gap-2">
        Indent Size:
        <input type="range" bind:value={indentSize} min="0.5" max="3" step="0.5" class="w-20" />
        {indentSize}rem
    </label>
</div>

<!-- TreeView with all configurations -->
<TreeView
        {items}
        {size}
        {multiSelect}
        {indentSize}
        bind:selectedId
        bind:selectedIds
        bind:expandedIds
        onSelect={handleSelect}
        onExpand={handleExpand}
        onContextMenu={handleContextMenu}
        {renderIcon}
        {renderLabel}
        {getItemVariant}
        class="border rounded-lg p-4 max-w-md bg-white"
/>

<!-- Debug Info -->
<div class="mt-4 p-4 bg-gray-100 rounded text-sm">
    <h3 class="font-bold mb-2">Debug Info:</h3>
    <p><strong>Selected ID:</strong> {selectedId || 'None'}</p>
    <p><strong>Selected IDs:</strong> {Array.from(selectedIds).join(', ') || 'None'}</p>
    <p><strong>Expanded IDs:</strong> {Array.from(expandedIds).join(', ')}</p>
    <p><strong>Multi-select:</strong> {multiSelect}</p>
    <p><strong>Size:</strong> {size}</p>
    <p><strong>Indent Size:</strong> {indentSize}rem</p>
</div>