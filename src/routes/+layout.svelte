<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { wsService } from '$lib/services/ws.service';

	let { children } = $props();

	wsService.connect();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tasken</title>
</svelte:head>

{@render children?.()}
