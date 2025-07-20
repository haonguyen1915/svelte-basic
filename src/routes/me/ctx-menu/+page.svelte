<script lang="ts">
    import * as ContextMenu from "$lib/components/ui/context-menu";
    import { toast } from "svelte-sonner";
    import { Download, Share, Heart, Flag, Bookmark } from "lucide-svelte";

    let isBookmarked = false;
    let isLiked = false;

    function handleDownload() {
        alert('Count is too high!');
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href);
        alert('Share this link: ' + window.location.href);
    }

    function toggleBookmark() {
        isBookmarked = !isBookmarked;
        alert(isBookmarked ? "Added to bookmarks" : "Removed from bookmarks")
    }

    function toggleLike() {
        isLiked = !isLiked;
        alert(isLiked ? "Removed from favorites" : "Removed from favorites");
    }

    function reportContent() {
        alert("Content has been reported for review.");
    }
</script>

<ContextMenu.Root>
<!--    <ContextMenu.Trigger>-->
<!--        <div class="flex h-[200px] w-[350px] items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 text-sm">-->
<!--            Interactive Context Menu-->
<!--        </div>-->
<!--    </ContextMenu.Trigger>-->
    <ContextMenu.Content class="w-52">
        <ContextMenu.Item onclick={handleDownload}>
            <Download class="mr-2 h-4 w-4" />
            Download
        </ContextMenu.Item>
        <ContextMenu.Item onclick={handleShare}>
            <Share class="mr-2 h-4 w-4" />
            Share
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.CheckboxItem bind:checked={isBookmarked} onclick={toggleBookmark}>
            <Bookmark class="mr-2 h-4 w-4" />
            {isBookmarked ? 'Remove from' : 'Add to'} Bookmarks
        </ContextMenu.CheckboxItem>
        <ContextMenu.CheckboxItem bind:checked={isLiked} onclick={toggleLike}>
            <Heart class="mr-2 h-4 w-4 {isLiked ? 'fill-red-500 text-red-500' : ''}" />
            {isLiked ? 'Remove from' : 'Add to'} Favorites
        </ContextMenu.CheckboxItem>
        <ContextMenu.Separator />
        <ContextMenu.Item onclick={reportContent} class="text-red-600 focus:text-red-600">
            <Flag class="mr-2 h-4 w-4" />
            Report Content
        </ContextMenu.Item>
    </ContextMenu.Content>
</ContextMenu.Root>