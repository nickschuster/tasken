<script lang="ts">
	export let checked = false;

	function toggleOnMouseDown(event: MouseEvent) {
		event.preventDefault();
		event.stopImmediatePropagation();
		checked = !checked;
	}
</script>

<input
	type="checkbox"
	class="h-6 w-6 accent-black"
	bind:checked
	on:mousedown={toggleOnMouseDown}
	on:mouseup={(e) => e.preventDefault()}
	on:click={(e) => e.preventDefault()}
/>
