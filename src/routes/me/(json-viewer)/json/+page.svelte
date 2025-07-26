<!--<script>-->
<!--    import JSONTree from 'svelte-json-tree';-->
<!--    import { Dialog, DialogContent, DialogTrigger } from "$lib/components/ui/dialog";-->
<!--    import { Button } from "$lib/components/ui/button";-->
<!--    import { X } from "lucide-svelte";-->

<!--    // your json data to view-->
<!--    const value = {-->
<!--        array: [1, 2, 3],-->
<!--        bool: true,-->
<!--        object: {-->
<!--            foo: 'bar',-->
<!--        },-->
<!--    };-->

<!--    let isFullScreen = false;-->

<!--    function toggleFullScreen() {-->
<!--        isFullScreen = !isFullScreen;-->
<!--    }-->
<!--</script>-->

<!--<div class="p-4">-->
<!--    <Dialog>-->
<!--        <DialogTrigger>-->
<!--            <Button variant="outline">Open JSON Viewer</Button>-->
<!--        </DialogTrigger>-->
<!--        <DialogContent class={`bg-gray-900 ${isFullScreen ? 'fixed inset-0 w-full h-full max-w-none rounded-none' : 'max-w-3xl'}`}>-->
<!--            <div class="flex justify-between items-center mb-4">-->
<!--                <h2 class="text-lg font-medium text-white">JSON Viewer</h2>-->
<!--                <div class="flex gap-2">-->
<!--                    <Button variant="ghost" size="sm" class="text-white hover:text-gray-200" onclick={toggleFullScreen}>-->
<!--                        {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}-->
<!--                    </Button>-->
<!--                    <DialogTrigger>-->
<!--                        <Button variant="ghost" size="icon" class="text-white hover:text-gray-200">-->
<!--                            <X class="h-4 w-4" />-->
<!--                        </Button>-->
<!--                    </DialogTrigger>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="json-tree-dark overflow-auto" class:h-[calc(100vh-6rem)]={true}>-->
<!--                <JSONTree {value} />-->
<!--            </div>-->
<!--        </DialogContent>-->
<!--    </Dialog>-->
<!--</div>-->

<!--<style>-->
<!--    /* Dark theme for JSON Tree using CSS variables */-->
<!--    .json-tree-dark :global(*) {-->
<!--        &#45;&#45;json-tree-property-color: #f9f8f5;     /* Light color for keys */-->
<!--        &#45;&#45;json-tree-string-color: #a6e22e;       /* Green for strings */-->
<!--        &#45;&#45;json-tree-number-color: #fd971f;       /* Orange for numbers */-->
<!--        &#45;&#45;json-tree-boolean-color: #f4bf75;      /* Yellow for booleans */-->
<!--        &#45;&#45;json-tree-null-color: #a1efe4;         /* Teal for null */-->
<!--        &#45;&#45;json-tree-undefined-color: #66d9ef;    /* Blue for undefined */-->
<!--        &#45;&#45;json-tree-function-color: #ae81ff;     /* Purple for functions */-->
<!--        &#45;&#45;json-tree-symbol-color: #f92672;       /* Red for symbols */-->
<!--        &#45;&#45;json-tree-label-color: #a59f85;        /* Muted color for labels */-->
<!--        &#45;&#45;json-tree-arrow-color: #75715e;        /* Muted color for arrows */-->
<!--        &#45;&#45;json-tree-operator-color: #f8f8f2;     /* Light color for operators */-->
<!--        &#45;&#45;json-tree-date-color: #a59f85;         /* Muted color for dates */-->
<!--        &#45;&#45;json-tree-internal-color: #75715e;     /* Muted color for internals */-->
<!--        &#45;&#45;json-tree-regex-color: #f92672;        /* Red for regex */-->

<!--        /* Adjust spacing and font if needed */-->
<!--        &#45;&#45;json-tree-font-family: 'Menlo', 'Monaco', 'Courier New', monospace;-->
<!--        &#45;&#45;json-tree-font-size: 14px;-->
<!--    }-->
<!--</style>-->
