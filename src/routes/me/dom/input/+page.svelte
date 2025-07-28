<script lang="ts">
	let isEditing = $state(false);
	let inputElement = $state<HTMLInputElement | null>(null);
	let inputValue = $state('Click edit to modify this text');

	$effect(() => {
		if (isEditing && inputElement) {
			// Small delay to ensure the DOM is updated
			setTimeout(() => {
				inputElement?.focus();
				inputElement?.select();
			}, 0);
		}
	});
</script>

<div class="max-w-2xl mx-auto my-8 p-8">
	<h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Input with $effect Example</h1>
	
	<div class="bg-gray-100 p-8 rounded-lg my-8">
		<h2 class="text-xl font-semibold text-gray-700 mb-4">Auto Focus & Select Example</h2>
		
		{#if isEditing}
			<input
				bind:this={inputElement}
				bind:value={inputValue}
				onkeydown={(e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						isEditing = false;
					} else if (e.key === 'Escape') {
						inputValue = 'Click edit to modify this text';
						isEditing = false;
					}
				}}
				onblur={() => isEditing = false}
				class="px-4 py-2 text-base border-2 border-blue-500 rounded outline-none w-80"
			/>
		{:else}
			<div class="inline-block px-4 py-2 text-base bg-white border-2 border-gray-300 rounded min-w-80 min-h-10 leading-6">
				{inputValue}
			</div>
		{/if}
		
		<button 
			onclick={() => {isEditing = !isEditing}}
			class="ml-4 px-6 py-2 bg-blue-500 text-white border-none rounded cursor-pointer text-base transition-colors hover:bg-blue-600"
		>
			{isEditing ? 'Save' : 'Edit'}
		</button>
	</div>

	<div class="mt-12 p-6 bg-blue-50 rounded-lg">
		<h3 class="text-lg font-semibold text-gray-800 mb-2">How it works:</h3>
		<ul class="list-disc pl-6 space-y-2">
			<li class="text-gray-600">Click "Edit" to enter edit mode</li>
			<li class="text-gray-600">The input will automatically focus and select all text</li>
			<li class="text-gray-600">Press Enter to save, Escape to cancel</li>
			<li class="text-gray-600">Click outside or press "Save" to exit edit mode</li>
		</ul>
	</div>
</div>