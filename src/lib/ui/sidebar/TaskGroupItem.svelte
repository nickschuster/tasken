<script lang="ts">
	import { Trash2Icon, FormInputIcon } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { group, isCollapsed } = $props();

	let isEditing = $state(false);
	let newName = $state(group.name);

	function startEditing(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		isEditing = true;
	}

	function stopEditing() {
		isEditing = false;
	}
</script>

<form
	method="POST"
	action="?/renameTaskGroup"
	use:enhance
	class="flex items-center gap-2 rounded p-4 hover:bg-amber-100"
>
	<input type="hidden" name="groupId" value={group.id} />

	{#if !isCollapsed}
		{#if !isEditing}
			<span>{group.name}</span>

			<button type="button" title="Rename" onclick={startEditing} class="p-1 hover:text-amber-700">
				<FormInputIcon size={16} />
			</button>

			<button
				type="submit"
				formaction="?/deleteTaskGroup"
				title="Delete"
				class="p-1 hover:text-red-600"
			>
				<Trash2Icon size={16} />
			</button>
		{:else}
			<input
				bind:value={newName}
				name="groupName"
				type="text"
				class="flex-1 rounded bg-transparent outline-none"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.currentTarget.form?.requestSubmit();
						stopEditing();
					} else if (e.key === 'Escape') {
						stopEditing();
					}
				}}
				onblur={stopEditing}
				autofocus
			/>
		{/if}
	{:else}
		<span>{group.name.charAt(0)}</span>
	{/if}
</form>
