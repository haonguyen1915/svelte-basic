<script>
    import JsonViewer from '$lib/components/ui/json-viewer/json-viewer.svelte';
    import JSONTree from "svelte-json-tree";

    const myJson = {
        name: "Alice",
        age: 30,
        active: true,
        skills: ["Svelte", "JS", "CSS"],
        profile: {
            email: "alice@example.com",
            github: "alicehub"
        }
    };
</script>



<div class="json-tree-dark overflow-auto w-2xs bg-black">
    <JsonViewer data={myJson} />
</div>