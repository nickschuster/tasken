<script lang="ts">
	type Props = {
		newTaskContent?: string;
		onEnter?: (value: string) => void;
	};

	let { newTaskContent = $bindable(''), onEnter = () => {} }: Props = $props();
</script>

<input
	type="text"
	class="w-full rounded-lg border border-neutral-300 bg-white px-4
      py-3 text-lg text-neutral-800 transition-all
      duration-200 ease-in-out placeholder:text-neutral-400
      focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none
      dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200
      dark:placeholder:text-neutral-500 dark:focus:ring-white"
	bind:value={newTaskContent}
	onkeydown={(event) => {
		if (event.code === 'Enter') {
			onEnter(newTaskContent);
		}
	}}
/>
