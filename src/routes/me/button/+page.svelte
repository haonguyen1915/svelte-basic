<script lang="ts">
    import GitBranchIcon from "@lucide/svelte/icons/git-branch";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import { Button } from "$lib/components/ui/button/index.js";

    function handleClick() {
        // Alert the button click
        alert("Button clicked!");
  }
</script>
 <div class="flex p-4 bg-neutral-500 gap-4">
    <Button onclick={handleClick} size="sm" >Button</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
    <Button variant="outline" size="sm">
        <GitBranchIcon />
        Login with Email
    </Button>

    <Button onclick={handleClick} variant="secondary" size="icon" class="size-5 rounded-sm">
        <ChevronRightIcon />
    </Button>
</div>

