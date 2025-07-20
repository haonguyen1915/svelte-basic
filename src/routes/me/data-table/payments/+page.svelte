<!--http://localhost:5173/me/data-table/payments-->
<script lang="ts">
    import DataTable from "./data-table.svelte";
    import { columns } from "./columns.js";
    import type { ColumnDef } from "@tanstack/table-core";
    import type {Payment} from "$routes/me/data-table/payments/columns";
    // Use the exact shape expected by DataTable:
    // type PaymentRow = { id: string; amount: number; status: string; email: string; };
    let {data} = $props();
</script>

<DataTable data={data.payments} {columns}/>