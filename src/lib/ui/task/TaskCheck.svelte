<script lang="ts">
	export let checked = false;
	export let toggleChecked: (checked: boolean) => void;

	let visuallyChecked = checked;
	const ANIMATION_DURATION = 250; // ms

	function handleToggle(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		visuallyChecked = !visuallyChecked;

		setTimeout(() => {
			toggleChecked(visuallyChecked);
		}, ANIMATION_DURATION);
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
	role="checkbox"
	aria-label="checkbox"
	aria-checked={visuallyChecked}
	class="checkbox-container"
	class:checked={visuallyChecked}
	on:click={handleToggle}
	on:keydown={handleKeydown}
	title={visuallyChecked ? 'Uncheck' : 'Check'}
>
	<svg class="checkmark" viewBox="0 0 24 24">
		<path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</button>

<style>
	.checkbox-container {
		--size: 28px;
		--primary-color: #000000;
		--secondary-color: #ffffff;
		--border-color: #cccccc;
		--border-hover-color: #999999;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		height: var(--size);
		padding: 0;
		margin: 0;
		cursor: pointer;
		background-color: var(--secondary-color);
		border: 2px solid var(--border-color);
		border-radius: 50%;
		-webkit-tap-highlight-color: transparent;

		transition:
			transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
	}

	.checkbox-container:focus-visible {
		outline: 2px solid var(--primary-color);
		outline-offset: 3px;
	}

	.checkbox-container:not(.checked):hover {
		border-color: var(--border-hover-color);
		transform: scale(1.05);
	}

	.checkbox-container:active {
		transition-duration: 0.05s;
	}

	.checkbox-container.checked {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
	}

	.checkbox-container:hover {
		box-shadow: inset 0 0 0 100vw rgba(0, 0, 0, 0.1);
	}

	.checkbox-container.checked:hover {
		background-color: var(--primary-color);
		box-shadow: inset 0 0 0 100vw rgba(255, 255, 255, 0.15);
	}

	.checkmark {
		width: 85%;
		height: 85%;
		stroke: transparent;
		stroke-width: 3.5;
		fill: none;
		stroke-dasharray: 24;
		stroke-dashoffset: 24;
		transition: stroke-dashoffset 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.checkbox-container.checked .checkmark {
		stroke: var(--secondary-color);
		stroke-dashoffset: 0;
	}
</style>
