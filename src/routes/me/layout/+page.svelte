<script lang="ts" context="module">
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
</script>

<div class="flex">
  <!-- Section 1 -->
  <div class="flex flex-col bg-neutral-500 p-2 text-white w-1/12">
    <button class="bg-gray-800 hover:bg-gray-700 font-bold rounded p-1 mb-4"
      >DB1</button
    >
    <button
      class="bg-gray-800 hover:bg-gray-700 font-bold rounded p-1 mb-4 whitespace-nowrap overflow-hidden overflow-ellipsis"
      title="The name is long more than width"
      >The name is long more than width</button
    >
    <button class="bg-gray-800 hover:bg-gray-700 font-bold rounded p-1 mb-4"
      >DB3</button
    >
    <button class="bg-gray-800 hover:bg-gray-700 font-bold rounded p-1 mb-4"
      >DB4</button
    >
  </div>

  <!-- Section 2 -->
  <div class="flex flex-col bg-neutral-800 text-white w-1/12">
    <h2 class="text-xs font-semibold mb-2">Account Details</h2>
    <h2 class="text-xs font-semibold mb-2">Personal Information</h2>
  </div>
  <!-- Section 3 -->
  <div class="flex flex-col bg-neutral-700 text-white w-4/5">
    <div class="flex items-center justify-between p-4 bg-neutral-600">
      <GitBranchIcon />
      <input
        type="text"
        placeholder="Search"
        class="bg-neutral-600 text-white p-2 rounded mb-4 w-full"
      />
    </div>
  </div>
</div>
