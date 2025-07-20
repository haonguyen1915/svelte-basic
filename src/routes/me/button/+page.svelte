<script lang="ts">
    import GitBranchIcon from "@lucide/svelte/icons/git-branch";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import {Button} from "$lib/components/ui/button/index.js";

    let btnRef: HTMLButtonElement | null = null;

    function focusButton() {
        btnRef?.focus();
    }

    function disableButton() {
        if (btnRef) btnRef.disabled = true;
    }

    function enableButton() {
        if (btnRef) btnRef.disabled = false;
    }

    function handleClick() {
        // Alert the button click
        alert("Button clicked!");
    }
</script>
<div class="flex p-4 bg-neutral-500 gap-4">
    <!--    Case 1: Button mặc định-->
    <Button>Đăng nhập</Button>

    <!--    Case 2: Đổi variant, size-->
    <Button variant="destructive" size="lg">Xóa vĩnh viễn</Button>
    <Button variant="outline" size="sm">Chọn</Button>

    <!--    Case 3: Dùng làm link (giao diện như button, nhưng là <a>)-->
    <Button href="/profile">Trang cá nhân</Button>

    <!--    Case 4: Disabled-->
    <Button disabled>Không bấm được</Button>
    <Button href="/abc" disabled>Link disabled</Button>

    <!--    Case 5: Thêm class ngoài (custom className)-->
    <Button class="shadow-lg bg-amber-300">Đăng ký</Button>

</div>

<div class="flex p-4 bg-neutral-500 gap-4">

    <!--    Case 6: Truyền ref và thao tác DOM-->
    <Button bind:ref={btnRef}>Nút này được bind ref</Button>

    <button class="bg-white rounded-sm px-1" on:click={focusButton}>Focus nút trên</button>
    <button class="bg-white rounded-sm px-1" on:click={disableButton}>Disable nút trên</button>
    <button class="bg-white rounded-sm px-1" on:click={enableButton}>Enable nút trên</button>
</div>

<div class="flex p-4 bg-neutral-500 gap-4 items-center">
    <!--    Case 7: Render dynamic nội dung bằng children render prop-->
    <Button variant="outline">
        <!--        <span>-->
        <GitBranchIcon/>
        Xác nhận
        <!--        </span>-->
    </Button>

    <!--    Case 8: Dùng tất cả các props của <button> hoặc <a>-->
    <Button type="submit" disabled aria-label="Nút submit" name="my-btn">Gửi</Button>
    <Button href="https://google.com" target="_blank" rel="noopener noreferrer">Mở Google</Button>


    <Button onclick={handleClick} size="sm">Button</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
    <Button variant="outline" size="sm">
        <GitBranchIcon/>
        Login with Email
    </Button>

    <Button onclick={handleClick} variant="secondary" size="icon" class="size-5 rounded-sm">
        <ChevronRightIcon/>
    </Button>
</div>

