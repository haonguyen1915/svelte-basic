<script lang="ts">
    import GitBranchIcon from "@lucide/svelte/icons/git-branch";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import {Button} from "$lib/components/ui/button/index.js";
    import type { ButtonVariant, ButtonSize } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";

    let btnRef: HTMLButtonElement | null = null;

    // Button props with reactive values
    let variant: ButtonVariant = "default";
    let size: ButtonSize = "default";
    let disabled = false;
    let isLink = false;
    let href = "#";
    let buttonText = "Button";
    let buttonType: "button" | "submit" | "reset" = "button";
    let customClass = "";
    let showIcon = false;

    // Available options
    const variantOptions: ButtonVariant[] = ["default", "destructive", "outline", "secondary", "ghost", "link"];
    const sizeOptions: ButtonSize[] = ["default", "sm", "lg", "icon"];
    const typeOptions: ("button" | "submit" | "reset")[] = ["button", "submit", "reset"];

    function focusButton() {
        btnRef?.focus();
    }

    function disableButton() {
        disabled = true;
    }

    function enableButton() {
        disabled = false;
    }

    function handleClick() {
        // Alert the button click
        alert("Button clicked!");
    }
</script>

<div class="container mx-auto p-6 space-y-8">
    <h1 class="text-2xl font-bold">Button Component Demo</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="p-6 border rounded-md space-y-6 bg-card">
            <h2 class="text-xl font-semibold">Button Preview</h2>

            <div class="flex items-center justify-center h-32 border rounded-md bg-background">
                <div class="flex items-center gap-2 h-8">
                    {#each Array(3) as _, i}
                        {#if i > 0}
                            <Separator orientation="vertical" class="h-8" />
                        {/if}

                        {#if isLink}
                            <Button
                                bind:ref={btnRef}
                                {variant}
                                {size}
                                {disabled}
                                href={href}
                                class={customClass}
                                onclick={handleClick}
                            >
                                {#if showIcon}
                                    <GitBranchIcon/>
                                {/if}
                                {buttonText}
                            </Button>
                        {:else}
                            <Button
                                bind:ref={btnRef}
                                {variant}
                                {size}
                                {disabled}
                                type={buttonType}
                                class={customClass}
                                onclick={handleClick}
                            >
                                {#if showIcon}
                                    <GitBranchIcon/>
                                {/if}
                                {buttonText}
                            </Button>
                        {/if}
                    {/each}
                </div>
            </div>

            <div class="space-x-2">
                <button class="px-3 py-1 bg-blue-500 text-white rounded" on:click={focusButton}>Focus</button>
                <button class="px-3 py-1 bg-red-500 text-white rounded" on:click={disableButton}>Disable</button>
                <button class="px-3 py-1 bg-green-500 text-white rounded" on:click={enableButton}>Enable</button>
            </div>
        </div>

        <div class="p-6 border rounded-md space-y-4 bg-card">
            <h2 class="text-xl font-semibold">Button Controls</h2>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Text</label>
                    <input type="text" bind:value={buttonText} class="w-full p-2 border rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Variant</label>
                    <div class="flex flex-wrap gap-2">
                        {#each variantOptions as option}
                            <label class="inline-flex items-center">
                                <input type="radio" bind:group={variant} value={option} class="mr-1" />
                                <span>{option}</span>
                            </label>
                        {/each}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Size</label>
                    <div class="flex flex-wrap gap-2">
                        {#each sizeOptions as option}
                            <label class="inline-flex items-center">
                                <input type="radio" bind:group={size} value={option} class="mr-1" />
                                <span>{option}</span>
                            </label>
                        {/each}
                    </div>
                </div>

                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={disabled} />
                        <span>Disabled</span>
                    </label>
                </div>

                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={isLink} />
                        <span>Render as Link</span>
                    </label>
                </div>

                {#if isLink}
                    <div>
                        <label class="block text-sm font-medium mb-1">href</label>
                        <input type="text" bind:value={href} class="w-full p-2 border rounded-md" />
                    </div>
                {:else}
                    <div>
                        <label class="block text-sm font-medium mb-1">Button Type</label>
                        <div class="flex flex-wrap gap-2">
                            {#each typeOptions as option}
                                <label class="inline-flex items-center">
                                    <input type="radio" bind:group={buttonType} value={option} class="mr-1" />
                                    <span>{option}</span>
                                </label>
                            {/each}
                        </div>
                    </div>
                {/if}

                <div>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={showIcon} />
                        <span>Show Icon</span>
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
        <h2 class="text-xl font-semibold mb-4">Button Code</h2>
        <pre class="bg-slate-800 text-white p-4 rounded-md overflow-x-auto">
{`<Button
    variant="${variant}"
    size="${size}"
    ${disabled ? 'disabled' : ''}
    ${isLink ? `href="${href}"` : `type="${buttonType}"`}
    ${customClass ? `class="${customClass}"` : ''}
    on:click={handleClick}
>
    ${showIcon ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14"></path>
        <path d="m19 12-7 7-7-7"></path>
    </svg>` : ''}
    ${buttonText}
</Button>`}
        </pre>
    </div>
</div>

<style>
    /* Add styles if needed */
</style>
