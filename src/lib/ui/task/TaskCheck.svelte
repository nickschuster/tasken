<script lang="ts">
	import { Check, Circle } from '@lucide/svelte';

	export let checked = false;
	export let toggleChecked: (checked: boolean) => void;

	let mouseDown = false;
	let visuallyChecked = checked;
	const ANIMATION_DURATION_MS = 200;

	function handleToggle(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		visuallyChecked = !visuallyChecked;

		setTimeout(() => {
			toggleChecked(visuallyChecked);
		}, ANIMATION_DURATION_MS);
	}

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			handleToggle(event);
		}
	};
</script>

<button
	class="relative cursor-pointer rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-950"
	role="checkbox"
	aria-label="checkbox"
	aria-checked={visuallyChecked}
	class:checked={visuallyChecked}
	on:mousedown={() => (mouseDown = true)}
	on:mouseup={() => (mouseDown = false)}
	on:mouseleave={() => (mouseDown = false)}
	on:click={handleToggle}
	on:keydown={handleKeydown}
	title={visuallyChecked ? 'Uncheck' : 'Check'}
>
	<div
		class="check-div aspect-square w-[28px] rounded-full {visuallyChecked || mouseDown
			? 'bg-black'
			: ''}"
	>
		<Circle
			size="28"
			class="circle absolute rounded-full text-black dark:text-neutral-800 {visuallyChecked ||
			mouseDown
				? 'opacity-0'
				: ''}"
		/>
		<Check
			strokeWidth="3"
			size="20"
			class="circle-check absolute translate-1 rounded-full   {visuallyChecked || mouseDown
				? 'text-white opacity-100'
				: 'text-black opacity-0'}"
		/>
	</div>
</button>

<style>
	:global(.check-div:hover .circle-check) {
		opacity: 100%;
		transform: scale(100%);
	}

	.checked {
		animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
