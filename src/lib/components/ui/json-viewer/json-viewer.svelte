// filepath: /Users/haonv/workspace/Projects/Personal/SVELTE/svelte-basic/src/lib/components/ui/json-viewer/json-viewer.svelte

<script lang="ts">
  import { onMount } from 'svelte';

  // Props
  export let data: any = {};
  export let expanded: boolean = false;
  export let rootLabel: string = 'Root';
  export let maxDepth: number = 10;
  export let copyable: boolean = true;
  export let theme: 'light' | 'dark' = 'light';

  // State variables
  let rootNode: HTMLElement;
  let expandedNodes: Set<string> = new Set();

  // Theme styles
  $: themeStyles = {
    light: {
      background: 'bg-white',
      border: 'border-gray-200',
      key: 'text-blue-700',
      string: 'text-green-700',
      number: 'text-amber-700',
      boolean: 'text-purple-700',
      null: 'text-gray-500',
      toggle: 'text-gray-700',
      hover: 'hover:bg-gray-100'
    },
    dark: {
      background: 'bg-gray-900',
      border: 'border-gray-700',
      key: 'text-blue-400',
      string: 'text-green-400',
      number: 'text-amber-400',
      boolean: 'text-purple-400',
      null: 'text-gray-400',
      toggle: 'text-gray-400',
      hover: 'hover:bg-gray-800'
    }
  };

  // Initialize all nodes as expanded if the prop is true
  onMount(() => {
    if (expanded) {
      expandAllNodes();
    }
  });

  function expandAllNodes() {
    const paths = getAllPaths(data);
    expandedNodes = new Set(paths);
  }

  function collapseAllNodes() {
    expandedNodes = new Set();
  }

  function getAllPaths(obj: any, currentPath = ''): string[] {
    if (!obj || typeof obj !== 'object') return [];

    let paths: string[] = [];
    Object.keys(obj).forEach(key => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      paths.push(newPath);

      if (obj[key] && typeof obj[key] === 'object') {
        paths = [...paths, ...getAllPaths(obj[key], newPath)];
      }
    });

    return paths;
  }

  function toggleNode(path: string) {
    if (expandedNodes.has(path)) {
      expandedNodes.delete(path);
    } else {
      expandedNodes.add(path);
    }
    expandedNodes = expandedNodes; // Trigger reactivity
  }

  function isExpanded(path: string): boolean {
    return expandedNodes.has(path);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  function renderValue(value: any, path: string, depth: number): string | any {
    if (depth > maxDepth) return '...';

    if (value === null) {
      return { type: 'null', display: 'null' };
    } else if (typeof value === 'boolean') {
      return { type: 'boolean', display: String(value) };
    } else if (typeof value === 'number') {
      return { type: 'number', display: String(value) };
    } else if (typeof value === 'string') {
      return { type: 'string', display: `"${value}"` };
    } else if (Array.isArray(value)) {
      return { type: 'array', value, length: value.length };
    } else if (typeof value === 'object') {
      return { type: 'object', value, keys: Object.keys(value) };
    }

    return { type: 'unknown', display: String(value) };
  }

  function formatJsonString(json: any): string {
    return JSON.stringify(json, null, 2);
  }
</script>

<div class="json-viewer-container {themeStyles[theme].background} p-4 rounded-md border {themeStyles[theme].border}" bind:this={rootNode}>
  <div class="flex justify-between items-center mb-2">
    <h3 class="font-medium">{rootLabel}</h3>
    <div class="flex space-x-2">
      <button
        class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 {themeStyles[theme].hover}"
        on:click={expandAllNodes}
      >
        Expand All
      </button>
      <button
        class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 {themeStyles[theme].hover}"
        on:click={collapseAllNodes}
      >
        Collapse All
      </button>
      {#if copyable}
        <button
          class="px-2 py-1 text-xs rounded bg-green-100 text-green-700 {themeStyles[theme].hover}"
          on:click={() => copyToClipboard(formatJsonString(data))}
        >
          Copy JSON
        </button>
      {/if}
    </div>
  </div>

  <div class="json-content font-mono text-sm">
    {#if Array.isArray(data)}
      <div class="pl-2">
        <span
          class="cursor-pointer inline-block {themeStyles[theme].toggle}"
          on:click={() => toggleNode('root')}
        >
          {isExpanded('root') ? '▼' : '▶'} Array [{data.length}]
        </span>

        {#if isExpanded('root')}
          <div class="pl-4 border-l border-gray-300 ml-1">
            {#each data as item, index}
              <div class="py-1">
                {#if typeof item === 'object' && item !== null}
                  <span
                    class="cursor-pointer inline-block {themeStyles[theme].toggle}"
                    on:click={() => toggleNode(`root[${index}]`)}
                  >
                    {isExpanded(`root[${index}]`) ? '▼' : '▶'} {Array.isArray(item) ? `Array [${item.length}]` : `Object {${Object.keys(item).length}}`}
                  </span>

                  {#if isExpanded(`root[${index}]`)}
                    <div class="pl-4 border-l border-gray-300 ml-1">
                      {#if Array.isArray(item)}
                        {#each item as subItem, subIndex}
                          <div class="py-1">
                            <span class="{themeStyles[theme].key}">{subIndex}: </span>
                            {@const renderedValue = renderValue(subItem, `root[${index}][${subIndex}]`, 1)}
                            {#if renderedValue.type === 'string'}
                              <span class="{themeStyles[theme].string}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'number'}
                              <span class="{themeStyles[theme].number}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'boolean'}
                              <span class="{themeStyles[theme].boolean}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'null'}
                              <span class="{themeStyles[theme].null}">{renderedValue.display}</span>
                            {/if}
                          </div>
                        {/each}
                      {:else}
                        {#each Object.entries(item) as [key, value]}
                          <div class="py-1">
                            <span class="{themeStyles[theme].key}">"{key}": </span>
                            {@const renderedValue = renderValue(value, `root[${index}].${key}`, 1)}
                            {#if renderedValue.type === 'string'}
                              <span class="{themeStyles[theme].string}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'number'}
                              <span class="{themeStyles[theme].number}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'boolean'}
                              <span class="{themeStyles[theme].boolean}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'null'}
                              <span class="{themeStyles[theme].null}">{renderedValue.display}</span>
                            {:else if renderedValue.type === 'object' || renderedValue.type === 'array'}
                              <span
                                class="cursor-pointer inline-block {themeStyles[theme].toggle}"
                                on:click={() => toggleNode(`root[${index}].${key}`)}
                              >
                                {isExpanded(`root[${index}].${key}`) ? '▼' : '▶'} {renderedValue.type === 'array' ? `Array [${renderedValue.length}]` : `Object {${renderedValue.keys.length}}`}
                              </span>
                            {/if}
                          </div>
                        {/each}
                      {/if}
                    </div>
                  {/if}
                {:else}
                  <span class="{themeStyles[theme].key}">{index}: </span>
                  {@const renderedValue = renderValue(item, `root[${index}]`, 0)}
                  {#if renderedValue.type === 'string'}
                    <span class="{themeStyles[theme].string}">{renderedValue.display}</span>
                  {:else if renderedValue.type === 'number'}
                    <span class="{themeStyles[theme].number}">{renderedValue.display}</span>
                  {:else if renderedValue.type === 'boolean'}
                    <span class="{themeStyles[theme].boolean}">{renderedValue.display}</span>
                  {:else if renderedValue.type === 'null'}
                    <span class="{themeStyles[theme].null}">{renderedValue.display}</span>
                  {/if}
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if typeof data === 'object' && data !== null}
      <div class="pl-2">
        <span
          class="cursor-pointer inline-block {themeStyles[theme].toggle}"
          on:click={() => toggleNode('root')}
        >
          {isExpanded('root') ? '▼' : '▶'} Object {`{${Object.keys(data).length}}`}
        </span>

        {#if isExpanded('root')}
          <div class="pl-4 border-l border-gray-300 ml-1">
            {#each Object.entries(data) as [key, value]}
              <div class="py-1">
                <span class="{themeStyles[theme].key}">"{key}": </span>
                {@const renderedValue = renderValue(value, `root.${key}`, 0)}
                {#if ['string', 'number', 'boolean', 'null'].includes(renderedValue.type)}
                  <span class="{themeStyles[theme][renderedValue.type]}">{renderedValue.display}</span>
                {:else if renderedValue.type === 'object' || renderedValue.type === 'array'}
                  <span
                    class="cursor-pointer inline-block {themeStyles[theme].toggle}"
                    on:click={() => toggleNode(`root.${key}`)}
                  >
                    {isExpanded(`root.${key}`) ? '▼' : '▶'} {renderedValue.type === 'array' ? `Array [${renderedValue.length}]` : `Object {${renderedValue.keys.length}}`}
                  </span>

                  {#if isExpanded(`root.${key}`)}
                    <div class="pl-4 border-l border-gray-300 ml-1">
                      {#if renderedValue.type === 'array'}
                        {#each renderedValue.value as item, index}
                          <div class="py-1">
                            <span class="{themeStyles[theme].key}">{index}: </span>
                            {@const subRenderedValue = renderValue(item, `root.${key}[${index}]`, 1)}
                            {#if ['string', 'number', 'boolean', 'null'].includes(subRenderedValue.type)}
                              <span class="{themeStyles[theme][subRenderedValue.type]}">{subRenderedValue.display}</span>
                            {:else if subRenderedValue.type === 'object' || subRenderedValue.type === 'array'}
                              <span
                                class="cursor-pointer inline-block {themeStyles[theme].toggle}"
                                on:click={() => toggleNode(`root.${key}[${index}]`)}
                              >
                                {isExpanded(`root.${key}[${index}]`) ? '▼' : '▶'} {subRenderedValue.type === 'array' ? `Array [${subRenderedValue.length}]` : `Object {${subRenderedValue.keys.length}}`}
                              </span>
                            {/if}
                          </div>
                        {/each}
                      {:else}
                        {#each Object.entries(renderedValue.value) as [subKey, subValue]}
                          <div class="py-1">
                            <span class="{themeStyles[theme].key}">"{subKey}": </span>
                            {@const subRenderedValue = renderValue(subValue, `root.${key}.${subKey}`, 1)}
                            {#if ['string', 'number', 'boolean', 'null'].includes(subRenderedValue.type)}
                              <span class="{themeStyles[theme][subRenderedValue.type]}">{subRenderedValue.display}</span>
                            {:else if subRenderedValue.type === 'object' || subRenderedValue.type === 'array'}
                              <span
                                class="cursor-pointer inline-block {themeStyles[theme].toggle}"
                                on:click={() => toggleNode(`root.${key}.${subKey}`)}
                              >
                                {isExpanded(`root.${key}.${subKey}`) ? '▼' : '▶'} {subRenderedValue.type === 'array' ? `Array [${subRenderedValue.length}]` : `Object {${subRenderedValue.keys.length}}`}
                              </span>
                            {/if}
                          </div>
                        {/each}
                      {/if}
                    </div>
                  {/if}
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <div class="pl-2">
        {@const renderedValue = renderValue(data, 'root', 0)}
        <span class="{themeStyles[theme][renderedValue.type] || 'text-gray-800'}">{renderedValue.display}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .json-viewer-container {
    font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
  }
</style>
