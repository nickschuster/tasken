<script lang="ts">
	import { Check, Circle } from '@lucide/svelte';

	type Props = {
		checked?: boolean;
		toggleChecked: (checked: boolean) => void;
	};

	let { checked = false, toggleChecked }: Props = $props();

	let mouseDown = $state(false);
	let visuallyChecked = $derived(checked);
	let isToggling = $state(false);

	const ANIMATION_DURATION_MS = 200;

	function handleToggle(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		if (isToggling) return;
		isToggling = true;

		visuallyChecked = !visuallyChecked;

		setTimeout(() => {
			toggleChecked(visuallyChecked);
			isToggling = false;
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
	tabindex="0"
	onmousedown={() => (mouseDown = true)}
	onmouseup={() => (mouseDown = false)}
	onmouseleave={() => (mouseDown = false)}
	onclick={handleToggle}
	onkeydown={handleKeydown}
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
			size="18"
			class="circle-check absolute translate-x-[5px] translate-y-[6px] rounded-full   {visuallyChecked ||
			mouseDown
				? 'text-white opacity-100'
				: 'text-black opacity-0 dark:text-neutral-800'}"
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
