<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tasken</title>
</svelte:head>

{@render children?.()}

<style>
	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: black;
		}
	}
</style>
