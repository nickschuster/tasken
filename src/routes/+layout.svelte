<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import { wsService } from '$lib/services/ws.service';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	import { pwaInfo } from 'virtual:pwa-info';

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let { children } = $props();

	wsService.connect();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tasken</title>

	{#if pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
	{@html webManifestLink}
</svelte:head>

{@render children?.()}
