<script>
    import { onMount } from 'svelte';

    let color_variant = "bg-blue-500 text-white";
    let presets = [
        { name: "Default", value: "bg-gray-200 text-gray-800" },
        { name: "Primary", value: "bg-blue-500 text-white" },
        { name: "Success", value: "bg-green-500 text-white" },
        { name: "Warning", value: "bg-yellow-500 text-gray-800" },
        { name: "Danger", value: "bg-red-500 text-white" },
        { name: "Info", value: "bg-cyan-500 text-white" },
        { name: "Dark", value: "bg-gray-800 text-white" },
        { name: "Light", value: "bg-gray-100 text-gray-800" }
    ];

    function setColorVariant(preset) {
        color_variant = preset;
    }

    let colorPreview = "";

    $: {
        // Parse color classes for preview
        const bgClass = color_variant.match(/bg-[^\s]+/);
        const textClass = color_variant.match(/text-[^\s]+/);

        colorPreview = {
            background: bgClass ? bgClass[0].replace('bg-', '') : 'none',
            text: textClass ? textClass[0].replace('text-', '') : 'default'
        };
    }
</script>

<div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Color Variants Demo</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Preview Section -->
        <div class="border rounded-lg p-4 bg-gray-50">
            <h2 class="text-xl font-medium mb-3">Preview</h2>

            <div class="flex flex-col space-y-4">
                <h3 class="text-xl font-bold {color_variant}">Sample Heading</h3>

                <button class="px-4 py-2 rounded-md {color_variant}">
                    Sample Button
                </button>

                <div class="p-4 rounded-md border {color_variant}">
                    Sample Container
                </div>
            </div>

            <div class="mt-6 text-sm">
                <p><strong>Background:</strong> {colorPreview.background}</p>
                <p><strong>Text:</strong> {colorPreview.text}</p>
            </div>
        </div>

        <!-- Controls Section -->
        <div class="border rounded-lg p-4 bg-gray-50">
            <h2 class="text-xl font-medium mb-3">Color Controls</h2>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Custom Class Input
                </label>
                <input
                    type="text"
                    bind:value={color_variant}
                    class="w-full p-2 border rounded-md"
                    placeholder="Enter Tailwind classes (e.g., bg-blue-500 text-white)"
                />
                <p class="mt-1 text-xs text-gray-500">
                    Enter Tailwind color classes like "bg-blue-500 text-white"
                </p>
            </div>

            <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Preset Colors
                </label>
                <div class="grid grid-cols-2 gap-2">
                    {#each presets as preset}
                        <button
                            class="p-2 rounded-md text-center text-sm {preset.value}"
                            on:click={() => setColorVariant(preset.value)}
                        >
                            {preset.name}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <div class="mt-6 p-4 border rounded-lg bg-gray-50">
        <h2 class="text-xl font-medium mb-3">Current Settings</h2>
        <code class="block bg-gray-800 text-white p-3 rounded">{color_variant}</code>
    </div>
</div>
