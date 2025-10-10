<script lang="ts">
	import githubLight from '$lib/assets/githubLight.svg';
	import githubDark from '$lib/assets/githubDark.svg';

	export let text: string = 'Continue with Github';
</script>

<button
	type="button"
	class="flex w-full items-center justify-center gap-3
	rounded-md border border-neutral-300
	 px-8 py-3 font-sans font-medium text-neutral-800
	  transition-colors hover:bg-neutral-100 dark:border-neutral-700
	 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
>
	<img src={githubDark} class="h-5 w-5 dark:hidden" alt="GitHub logo" />
	<img src={githubLight} class="hidden h-5 w-5 dark:block" alt="GitHub logo" />

	<span>{text}</span>
</button>
