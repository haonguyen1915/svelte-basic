<script lang="ts">
    import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger
    } from "$lib/components/ui/tooltip";
    import { Button } from "$lib/components/ui/button";
    import GitBranchIcon from "@lucide/svelte/icons/git-branch";
    import InfoIcon from "@lucide/svelte/icons/info";

    // Tooltip props with reactive values
    let content = "Tooltip content";
    let side: "top" | "right" | "bottom" | "left" = "top";
    let align: "start" | "center" | "end" = "center";
    let sideOffset = 4;
    let alignOffset = 0;
    let triggerText = "Hover me";
    let showIcon = false;
    let customClass = "";
    let delayDuration = 300;
    let skipDelayDuration = 300;
    let showArrow = true;

    // Available options
    const sideOptions: ("top" | "right" | "bottom" | "left")[] = ["top", "right", "bottom", "left"];
    const alignOptions: ("start" | "center" | "end")[] = ["start", "center", "end"];
</script>

<div class="container mx-auto p-6 space-y-8">
    <h1 class="text-2xl font-bold">Tooltip Component Demo</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="p-6 border rounded-md space-y-6 bg-card">
            <h2 class="text-xl font-semibold">Tooltip Preview</h2>

            <div class="flex items-center justify-center h-40 border rounded-md p-4 bg-background">
                <TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="outline" class={customClass}>
                                {#if showIcon}
                                    <InfoIcon class="mr-2 h-4 w-4" />
                                {/if}
                                {triggerText}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            {side}
                            {align}
                            sideOffset={sideOffset}
                            alignOffset={alignOffset}
                            class={customClass}
                        >
                            {#if showArrow}
                                <div class="tooltip-arrow" data-side={side}></div>
                            {/if}
                            {content}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div class="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onclick={() => side = "top"}>Top</Button>
                <Button variant="outline" size="sm" onclick={() => side = "right"}>Right</Button>
                <Button variant="outline" size="sm" onclick={() => side = "bottom"}>Bottom</Button>
                <Button variant="outline" size="sm" onclick={() => side = "left"}>Left</Button>
                <div class="w-px h-5 bg-border mx-2 opacity-40"></div>
                <Button variant="outline" size="sm" onclick={() => align = "start"}>Start</Button>
                <Button variant="outline" size="sm" onclick={() => align = "center"}>Center</Button>
                <Button variant="outline" size="sm" onclick={() => align = "end"}>End</Button>
            </div>
        </div>

        <div class="p-6 border rounded-md space-y-4 bg-card">
            <h2 class="text-xl font-semibold">Tooltip Controls</h2>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Tooltip Content</label>
                    <input type="text" bind:value={content} class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Trigger Text</label>
                    <input type="text" bind:value={triggerText} class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Side</label>
                    <div class="flex flex-wrap gap-2">
                        {#each sideOptions as option}
                            <label class="inline-flex items-center">
                                <input type="radio" bind:group={side} value={option} class="mr-1" />
                                <span>{option}</span>
                            </label>
                        {/each}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Align</label>
                    <div class="flex flex-wrap gap-2">
                        {#each alignOptions as option}
                            <label class="inline-flex items-center">
                                <input type="radio" bind:group={align} value={option} class="mr-1" />
                                <span>{option}</span>
                            </label>
                        {/each}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Side Offset (px)</label>
                    <input type="number" bind:value={sideOffset} min="0" max="20" class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Align Offset (px)</label>
                    <input type="number" bind:value={alignOffset} min="-20" max="20" class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Delay Duration (ms)</label>
                    <input type="number" bind:value={delayDuration} min="0" max="1000" step="50" class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Skip Delay Duration (ms)</label>
                    <input type="number" bind:value={skipDelayDuration} min="0" max="1000" step="50" class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={showIcon} />
                        <span>Show Icon</span>
                    </label>
                </div>

                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={showArrow} />
                        <span>Show Arrow</span>
                    </label>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Custom Class</label>
                    <input type="text" bind:value={customClass} class="w-full p-2 border rounded-md" placeholder="e.g. my-custom-class" />
                </div>
            </div>
        </div>
    </div>

    <div class="p-6 border rounded-md bg-card">
        <h2 class="text-xl font-semibold mb-4">Tooltip Code</h2>
        <pre class="bg-slate-800 text-white p-4 rounded-md overflow-x-auto">
{`<TooltipProvider delayDuration={${delayDuration}} skipDelayDuration={${skipDelayDuration}}>
    <Tooltip>
        <TooltipTrigger asChild>
            <Button variant="outline"${customClass ? ` class="${customClass}"` : ''}>
                ${showIcon ? `<InfoIcon class="mr-2 h-4 w-4" />` : ''}
                ${triggerText}
            </Button>
        </TooltipTrigger>
        <TooltipContent
            side="${side}"
            align="${align}"
            sideOffset={${sideOffset}}
            alignOffset={${alignOffset}}
            ${customClass ? `class="${customClass}"` : ''}
        >
            ${showArrow ? `<div class="tooltip-arrow" data-side="${side}"></div>` : ''}
            ${content}
        </TooltipContent>
    </Tooltip>
</TooltipProvider>`}
        </pre>
    </div>
</div>

<style>
    .tooltip-arrow {
        width: 10px;
        height: 10px;
        position: absolute;
        background: inherit;
        transform: rotate(45deg);
    }

    .tooltip-arrow[data-side="top"] {
        bottom: -4px;
    }

    .tooltip-arrow[data-side="right"] {
        left: -4px;
    }

    .tooltip-arrow[data-side="bottom"] {
        top: -4px;
    }

    .tooltip-arrow[data-side="left"] {
        right: -4px;
    }
</style>
