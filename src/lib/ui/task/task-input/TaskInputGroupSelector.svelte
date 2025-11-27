<script lang="ts">
	import DropDownItem from '$lib/ui/dropdown/DropdownMenuItem.svelte';
	import DropdownMenuContent from '$lib/ui/dropdown/DropdownMenuContent.svelte';
	import { House } from '@lucide/svelte';
	import type { TaskGroup } from '$lib/server/db/schema';

	type Props = {
		taskGroups: TaskGroup[];
		groupSelected: (group: TaskGroup | null) => void;
	};

	let { taskGroups, groupSelected }: Props = $props();
</script>

<DropdownMenuContent contentProps={{ side: 'top' }}>
	<DropDownItem callback={() => groupSelected(null)}>
		<div class="flex items-center gap-2">
			<House size="20" />
			<div>Tasks</div>
		</div>
	</DropDownItem>

	{#each taskGroups as group (group.id)}
		<DropDownItem callback={() => groupSelected(group)}>
			<div class="flex items-center gap-2">
				<div style={'background-color: ' + group.color} class="m-1 size-3 rounded-full"></div>
				<div>{group.name}</div>
			</div>
		</DropDownItem>
	{/each}
</DropdownMenuContent>
