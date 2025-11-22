<script lang="ts">
	import DropDownItem from '$lib/ui/dropdown/DropdownMenuItem.svelte';
	import DropdownMenuContent from '$lib/ui/dropdown/DropdownMenuContent.svelte';
	import { House } from '@lucide/svelte';

	let { taskGroups, groupSelected } = $props();
</script>

<DropdownMenuContent contentProps={{ side: 'top' }}>
	<DropDownItem callback={() => groupSelected(null)}>
		<div class="flex items-center gap-2">
			<House />
			<div>Tasks</div>
		</div>
	</DropDownItem>

	{#each taskGroups as group}
		<DropDownItem callback={() => groupSelected(group)}>
			<div class="flex items-center gap-2">
				<div style={'background-color: ' + group.color} class="m-1 h-4 w-4 rounded-full"></div>
				<div>{group.name}</div>
			</div>
		</DropDownItem>
	{/each}
</DropdownMenuContent>
