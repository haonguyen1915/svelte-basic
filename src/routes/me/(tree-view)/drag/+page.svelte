<script>
    import TreeView from '$lib/components/ui/tree-view/tree-view.svelte';
    let treeData = [
        {
            id: '1',
            label: 'Documents',
            children: [
                {id: '2', label: 'Resume.pdf'},
                {id: '3', label: 'Cover Letter.docx'}
            ]
        },
        {
            id: '4',
            label: 'Images',
            children: [
                {id: '5', label: 'Photo1.jpg'},
                {id: '6', label: 'Photo2.png'}
            ]
        }
    ];

    let selectedId = '';
    let expandedIds = new Set(['1', '4']);

    function handleDrop(data) {
        console.log('Drop:', data);
        // Implement your drop logic here
        // You'll need to update treeData based on the drop operation
    }

    function canDrop(draggedItem, targetItem, position) {
        // Custom drop validation logic
        // if (position === 'inside' && !targetItem.children) {
        //     return false; // Can't drop inside files
        // }
        return true;
    }
</script>
<div class="bg-white w-2xs">
    <TreeView
            items={treeData}
            bind:selectedId
            bind:expandedIds
            enableDragDrop={true}
            onDrop={handleDrop}

            canDrop={canDrop}

            onDragStart={(item) => console.log('Drag started:', item)}
            onDragEnd={() => console.log('Drag ended')}
    />
</div>
