<script lang="ts">
	import DropdownMenuItem from '$lib/ui/dropdown/DropdownMenuItem.svelte';
	import DropdownMenuContent from '$lib/ui/dropdown/DropdownMenuContent.svelte';
	import DatePicker from '$lib/ui/DatePicker.svelte';

	let { selectedDate, dateSelected } = $props();
</script>

<DropdownMenuContent contentProps={{ side: 'top' }}>
	<DropdownMenuItem callback={() => {}}>Today</DropdownMenuItem>

	<DropdownMenuItem callback={() => {}}>Tomorrow</DropdownMenuItem>

	<DropdownMenuItem
		callback={(e: Event) => {
			e.preventDefault();
		}}
	>
		<DatePicker value={selectedDate ?? undefined} onChange={dateSelected} />
	</DropdownMenuItem>
</DropdownMenuContent>
