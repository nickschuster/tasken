<script lang="ts">
	export let newTaskContent: string = '';
	export let onEnter: (value: string) => void = () => {};
</script>

<input
	type="text"
	class="w-full rounded border px-2 py-1"
	bind:value={newTaskContent}
	on:keydown={(event) => {
		if (event.code === 'Enter') {
			onEnter(newTaskContent);
		}
	}}
/>
