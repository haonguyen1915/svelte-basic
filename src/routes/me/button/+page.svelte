<script lang="ts">
    // import '../../app.css';
    import {Button} from '$lib/components/common';
    import { 
    Plus, 
    Download, 
    Trash2, 
    Settings, 
    ChevronRight,
    Save
  } from 'lucide-svelte';
    function handleClick() {
        alert('Button clicked!');
    }
</script>

<!-- Button Test -->
<h1 class="text-center text-2xl font-bold mb-4 p-4 text-white bg-bg-secondary">Button Component Test</h1>
<div class="flex justify-around items-start mb-4 p-4 gap-4 space-x-4 bg-bg-primary">
    <Button on:click={handleClick} variant="primary" size="md">primary</Button>
    <!-- Button with right icon -->
    <Button icon={ChevronRight} iconPosition="right" variant="secondary">secondary</Button>

    <!-- Button with left icon -->
    <Button icon={Plus} variant="primary">primary</Button>

    <!-- Button with right icon -->
    <Button icon={ChevronRight} iconPosition="right" variant="secondary">secondary</Button>

    <!-- Icon only button -->
    <Button icon={Settings} iconOnly variant="secondary" size="sm" />

    <!-- Different variants with icons -->
    <Button icon={Download} variant="primary" size="lg">Download</Button>

    <Button icon={Trash2} variant="danger">danger</Button>

    <Button icon={Save} variant="test" size="xs">test</Button>

    <!-- Disabled button with icon -->
    <Button icon={Plus} disabled={true} size="xs">disabled</Button>

    <!-- Active state with icon -->
    <Button icon={Settings} active variant="segment">active segment</Button>
</div>

<div class="flex justify-around p-4 mp-4 bg-bg-tertiary">
    <Button on:click={handleClick} variant="primary" size="md">primary</Button>
    <!-- Button with right icon -->
    <Button icon={ChevronRight} iconPosition="right" variant="secondary">secondary</Button>

    <!-- Button with left icon -->
    <Button icon={Plus} variant="primary">primary</Button>

    <!-- Button with right icon -->
    <Button icon={ChevronRight} iconPosition="right" variant="secondary">secondary</Button>

    <!-- Icon only button -->
    <Button icon={Settings} iconOnly variant="secondary" size="sm" />

    <!-- Different variants with icons -->
    <Button icon={Download} variant="primary" size="lg">Download</Button>

    <Button icon={Trash2} variant="danger">danger</Button>

    <Button icon={Save} variant="test" size="xs">test</Button>

    <!-- Disabled button with icon -->
    <Button icon={Plus} disabled={true} size="xs">disabled</Button>

    <!-- Active state with icon -->
    <Button icon={Settings} active variant="segment">active segment</Button>
</div>