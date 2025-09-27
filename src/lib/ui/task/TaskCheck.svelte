<script lang="ts">
	export let checked = false;
	export let toggleChecked: (checked: boolean) => void = () => {};

	function toggleCheck(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		toggleChecked(!checked);
	}
</script>

<input
	type="checkbox"
	class="h-6 w-6 cursor-pointer rounded accent-black hover:bg-gray-200"
	{checked}
	on:keydown={(e) => {
		if (e.code === 'Enter') {
			toggleCheck(e);
		}
	}}
	on:mousedown={toggleCheck}
	on:mouseup={(e) => e.preventDefault()}
	on:click={(e) => e.preventDefault()}
/>
