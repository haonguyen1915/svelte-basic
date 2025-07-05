<script lang="ts">
	import Outer from './outer.svelte';
	function handleMessage(event: CustomEvent) {
		alert(event.detail.text);
	}
</script>

<Outer on:message={handleMessage} />