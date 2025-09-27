<script lang="ts">
	export let value: string = '';
	export let onInput: (event: Event) => void = () => {};
	export let onEnter: (value: string) => void = () => {};
</script>

<input
	type="text"
	class="w-full rounded border px-2 py-1"
	bind:value
	on:change={onInput}
	on:keydown={(event) => {
		console.log(event.code);

		if (event.code === 'Enter') {
			onEnter(value);
		}
	}}
/>
