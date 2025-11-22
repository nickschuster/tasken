<script lang="ts">
	import { CalendarIcon, House } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';
</script>

<div class="flex items-center gap-1">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button class="flex gap-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
				<House />
				<span>Tasks</span>
			</button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content>
				<DropdownMenu.Item />
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button class="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
				<CalendarIcon />
			</button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content>
				<DropdownMenu.Item />
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
