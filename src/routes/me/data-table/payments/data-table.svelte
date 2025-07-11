<script lang="ts" generics="TData, TValue">
    import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";

    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
    };

    let { data, columns }: DataTableProps<TData, TValue> = $props();

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
</script>

<div class="rounded-md border-gray-300 text-gray-600 shadow-sm space-x-0.5 text-xs">
    <Table.Root>
        <Table.Header>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <Table.Row class="border-b border-gray-500">
                    {#each headerGroup.headers as header, index (header.id)}
                        <Table.Head 
                            colspan={header.colSpan} 
                            class="text-gray-200 py-2 px-3 text-xs font-mono border-r border-gray-500 {index === 0 ? 'border-l' : ''}"
                        >
                            {#if !header.isPlaceholder}
                                <FlexRender
                                    content={header.column.columnDef.header}
                                    context={header.getContext()}
                                />
                            {/if}
                        </Table.Head>
                    {/each}
                </Table.Row>
            {/each}
        </Table.Header>
        <Table.Body>
            {#each table.getRowModel().rows as row (row.id)}
                <Table.Row data-state={row.getIsSelected() && "selected"} class="border-b border-gray-500">
                    {#each row.getVisibleCells() as cell, index (cell.id)}
                        <Table.Cell class="py-0 px-3 text-xs font-mono text-gray-200 border-r border-gray-500 {index === 0 ? 'border-l' : ''}">
                            <FlexRender
                                content={cell.column.columnDef.cell}
                                context={cell.getContext()}
                            />
                        </Table.Cell>
                    {/each}
                </Table.Row>
            {:else}
                <Table.Row>
                    <Table.Cell
                        colspan={columns.length}
                        class="h-16 text-center py-10 px-3 text-xs font-mono text-gray-600 border-l border-r border-gray-500"
                    >
                        No results.
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>