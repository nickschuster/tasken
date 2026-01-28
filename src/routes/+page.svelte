<script lang="ts">
	import SubscriptionCards from '$lib/ui/SubscriptionCards.svelte';
	import {
		ArrowRight,
		Github,
		GitMerge,
		LayoutGrid,
		Users,
		BellRing,
		Workflow,
		Command,
		Sparkles,
		Check,
		SquareTerminal,
		ChartColumn,
		ChevronDown,
		LineChart,
		LineChartIcon,
		BarChart,
		ChartArea
	} from '@lucide/svelte';
	import DarkDemoFull from '$lib/assets/DarkDemoFull.png';
	import LightDemoFull from '$lib/assets/LightDemoFull.png';
	import { Accordion } from 'bits-ui';
	import { onMount } from 'svelte';

	let isDarkMode = $state(false);

	onMount(() => {
		const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
		isDarkMode = matchMedia.matches;

		const handleChange = (event: MediaQueryListEvent) => {
			isDarkMode = event.matches;
		};

		matchMedia.addEventListener('change', handleChange);

		return () => {
			matchMedia.removeEventListener('change', handleChange);
		};
	});

	const frequentlyAskedQuestions = [
		{
			value: '1',
			title: 'Is Tasken Free or Paid?',
			content:
				'Tasken is open source and free to self-host. For cloud sync and premium features, we offer affordable subscription plans.'
		},
		{
			value: '2',
			title: 'Which platforms/devices are supported?',
			content:
				'Tasken is a web-based application accessible via modern browsers on desktops, tablets, and smartphones.'
		},
		{
			value: '3',
			title: 'Can I cancel or change my plan?',
			content:
				'Yes, you can upgrade, downgrade, or cancel your subscription at any time through your account settings.'
		}
	];
</script>

<div>
	<div
		class="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black"
	>
		<div
			class="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-100 px-4 py-2 text-center text-sm font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
		>
			🚀 <span class="font-bold">Founders get a discount</span>
			— Limited time offer
			<a href="#pricing" class="ml-2 font-semibold underline hover:no-underline">Learn more</a>
		</div>

		<header
			class="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:min-h-screen md:py-32"
		>
			<h1 class="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
				Your Tasks, at the Speed of
				<span class="text-blur">Thought.</span>
			</h1>
			<p class="max-w-3xl text-lg text-neutral-600 md:text-xl dark:text-neutral-400">
				<strong>Tasken</strong> is the radically fast, minimalist task manager for professionals
				tired of slow, bloated software. Experience <strong>zen</strong> with powerful keyboard controls
				and instant, cross-device sync. No downloads, no waiting, ever.
			</p>
			<div class="mt-4 flex flex-col gap-4 sm:flex-row">
				<a
					href="/auth/signup"
					class="flex items-center justify-center gap-2 rounded-md bg-black px-8 py-3 font-semibold text-white transition-transform duration-200 ease-in-out hover:scale-105 dark:bg-white dark:text-black"
				>
					Start Focusing Now
				</a>
				<a
					href="https://github.com/nickschuster/tasken"
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center justify-center gap-2 rounded-md border border-neutral-300 px-8 py-3 font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
				>
					<Github class="transition-transform group-hover:-rotate-12" size={20} />
					View Source
				</a>
			</div>
		</header>

		<main>
			<!-- TODO: Add video demo -->
			<!-- <section class="mx-auto w-full max-w-6xl px-4 py-20 md:py-24">
				<div
					class="rounded-xl border border-neutral-200 bg-neutral-100 p-2 shadow-2xl shadow-neutral-100/10 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/10"
				>
					<div class="relative overflow-hidden rounded-lg">
						<video
							autoplay
							loop
							muted
							playsinline
							poster="https://via.placeholder.com/1200x675/1a1a1a/ffffff?text=Tasken+App+Showcase"
							class="w-full rounded-lg"
						>
							<p
								class="flex h-[300px] items-center justify-center bg-neutral-200 text-neutral-600 md:h-[500px] dark:bg-neutral-800 dark:text-neutral-400"
							>
								Your beautiful Tasken app in action! (Video will auto-play)
							</p>
						</video>
						<div
							class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
						>
							<span class="text-xl font-medium">Coming Soon: See Tasken in action!</span>
						</div>
					</div>
					<p class="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
						A glimpse into the minimalist design and fluid interactions that define your Tasken
						workflow.
					</p>
				</div>
			</section> -->

			<section class="mx-auto flex w-full max-w-6xl justify-center px-4 py-28 md:py-24">
				<div class="relative inline-block">
					<img
						src={isDarkMode ? DarkDemoFull : LightDemoFull}
						alt="Tasken app screenshot"
						class="floating-img h-auto max-w-full rounded-xl shadow-[0_0_70px_rgba(0,0,0,0.15)] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[0_0_70px_rgba(0,0,0,0.25)] dark:shadow-[0_0_70px_rgba(255,255,255,0.15)] hover:dark:shadow-[0_0_70px_rgba(255,255,255,0.25)]"
					/>
				</div>
			</section>

			<section id="features" class="mx-auto w-full max-w-6xl px-4 py-20 md:py-24">
				<div class="text-center">
					<h2 class="text-4xl font-bold tracking-tighter sm:text-5xl">
						From Grocery List to Kanban Board.
					</h2>
					<p class="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
						Master the essentials with an interface that gets out of your way. Our roadmap is
						focused on adding power, not complexity.
					</p>
				</div>
				<div
					class="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4 xl:grid-cols-4"
				>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<BellRing class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Advanced Reminders</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500"
							>IN PROGRESS</span
						>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<Users class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Shared Task Lists</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<Command class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Command Palette</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<GitMerge class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Git Integration</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<LayoutGrid class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Project Boards</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<Workflow class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Slack & Jira Sync</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<SquareTerminal class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">First Class CLI Support</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<ChartArea class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Analytics Enabled</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
				</div>
			</section>

			<section class="bg-neutral-100 py-20 md:py-32 dark:bg-neutral-950" id="pricing">
				<div class="mx-auto w-full max-w-6xl px-4">
					<div class="text-center">
						<h2 class="text-4xl font-bold tracking-tighter sm:text-5xl">
							Radically Simple Pricing.
						</h2>
						<p class="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
							Tasken is free to self-host from our open-source code. For effortless cloud sync
							across all your devices, subscribe and experience todo nirvana.
						</p>
					</div>
					<div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
						<SubscriptionCards basicPrice={399} />
					</div>
				</div>
			</section>

			<section class="flex flex-col items-center py-20 md:py-32">
				<h2 class="text-center text-4xl font-bold tracking-tighter sm:text-5xl">
					Frequently Asked Questions
				</h2>
				<Accordion.Root class="w-full max-w-[90%] md:max-w-6xl" type="multiple">
					{#each frequentlyAskedQuestions as item (item.value)}
						<Accordion.Item value={item.value} class="border-b border-neutral-900 px-1.5">
							<Accordion.Header>
								<Accordion.Trigger
									class="flex w-full flex-1 items-center justify-between py-5 text-xl font-semibold transition-all select-none [&[data-state=open]>span>svg]:rotate-180"
								>
									<span class="w-full text-left">
										{item.title}
									</span>
									<span
										class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
									>
										<ChevronDown class="size-[18px] transition-transform duration-200" />
									</span>
								</Accordion.Trigger>
							</Accordion.Header>
							<Accordion.Content
								class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
							>
								<div class="pb-[25px] text-lg text-neutral-600 dark:text-neutral-400">
									{item.content}
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</section>

			<section class="flex flex-col items-center gap-6 px-4 py-20 text-center md:py-32">
				<h2 class="text-4xl font-bold tracking-tighter sm:text-5xl">Find Your Flow State.</h2>
				<p class="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
					Leave the lag and clutter behind. Sign up for Tasken and experience what it feels like to
					have your tools work as fast as you do.
				</p>
				<a
					href="/auth/signup"
					class="mt-4 flex items-center justify-center gap-2 rounded-md bg-black px-8 py-3 font-semibold text-white transition-transform duration-200 ease-in-out hover:scale-105 dark:bg-white dark:text-black"
				>
					Get Started with Tasken <ArrowRight size={20} />
				</a>
			</section>
		</main>

		<footer class="border-t border-neutral-200 py-8 dark:border-neutral-900">
			<div
				class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-neutral-600 sm:flex-row dark:text-neutral-500"
			>
				<span>&copy; {new Date().getFullYear()} Schuster Software. All rights reserved.</span>
				<div class="flex gap-6">
					<a
						href="https://github.com/nickschuster/tasken"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-black dark:hover:text-white">GitHub</a
					>
					<a
						href="https://www.schustersoftware.ca/src/tasken/legal.html"
						class="hover:text-black dark:hover:text-white">Terms & Privacy</a
					>
				</div>
			</div>
		</footer>
	</div>
</div>

<style>
	.floating-img {
		transform: rotate3d(1, 0, 0, 15deg);
	}

	.floating-img:hover {
		transform: rotate3d(1, 0, 0, 0deg) scale(1.01);
	}

	.text-blur {
		display: inline-block;
		opacity: 0;
		filter: blur(15px);
		animation: blur-in 2s ease-out forwards;
	}

	@keyframes blur-in {
		0% {
			opacity: 0;
			filter: blur(15px);
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0);
		}
	}
</style>
