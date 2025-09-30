<script>
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
		ChartColumn
	} from '@lucide/svelte';
</script>

<div>
	<div
		class="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black"
	>
		<header
			class="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:min-h-screen md:py-32"
		>
			<h1 class="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
				Your Tasks, at the Speed of Thought.
			</h1>
			<p class="max-w-3xl text-lg text-neutral-600 md:text-xl dark:text-neutral-400">
				<strong>Tasken</strong> is the radically fast, minimalist task manager for professionals
				tired of slow, bloated software. Experience <strong>zen</strong> with powerful keyboard controls
				and instant, cross-device sync. No downloads, no waiting, ever.
			</p>
			<div class="mt-4 flex flex-col gap-4 sm:flex-row">
				<a
					href="/home"
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
					class="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4 xl:grid-cols-5"
				>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<Users class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Shared Task Lists</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500"
							>IN PROGRESS</span
						>
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
							<BellRing class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Advanced Reminders</h3>
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
							<Command class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">Command Palette</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
					<div class="flex flex-col items-center gap-3 text-center">
						<div class="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
							<Sparkles class="h-10 w-10" />
						</div>
						<h3 class="text-xl font-semibold">AI Task Parsing</h3>
						<span class="text-sm font-medium text-neutral-500 dark:text-neutral-500">PLANNED</span>
					</div>
				</div>
			</section>

			<section class="bg-neutral-100 py-20 md:py-32 dark:bg-neutral-950">
				<div class="mx-auto w-full max-w-6xl px-4">
					<div class="text-center">
						<h2 class="text-4xl font-bold tracking-tighter sm:text-5xl">
							Radically Simple Pricing.
						</h2>
						<p class="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
							Tasken is free to self-host from our open-source code. For effortless cloud sync
							across all your devices, subscribe and experience nirvana.
						</p>
					</div>
					<div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
						<div class="flex flex-col rounded-lg border-2 border-black p-8 dark:border-white">
							<h3 class="text-2xl font-semibold">Basic</h3>
							<p class="mt-2 text-neutral-600 dark:text-neutral-400">
								For individuals and small projects.
							</p>
							<div class="my-8">
								<span class="text-5xl font-bold">$4.99</span>
								<span class="text-lg text-neutral-600 dark:text-neutral-400">/ month</span>
							</div>
							<ul class="flex-grow space-y-4">
								<li class="flex items-center gap-3">
									<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span
										>Hosted Cloud Sync</span
									>
								</li>
								<li class="flex items-center gap-3">
									<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span
										>Cross-Platform Apps</span
									>
								</li>
								<li class="flex items-center gap-3">
									<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span
										>Unlimited Tasks & Projects</span
									>
								</li>
								<li class="flex items-center gap-3">
									<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span>Priority Support</span
									>
								</li>
							</ul>
							<a
								href="/home"
								class="mt-8 block w-full rounded-md bg-black py-3 text-center font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
								>Choose Basic</a
							>
						</div>

						<div
							class="flex flex-col rounded-lg border border-neutral-200 p-8 opacity-70 grayscale dark:border-neutral-800"
						>
							<h3 class="text-2xl font-semibold">Pro</h3>
							<p class="mt-2 text-neutral-500">For power users and professionals.</p>
							<div class="my-8">
								<span class="text-5xl font-bold">TBA</span>
							</div>
							<ul class="flex-grow space-y-4 text-neutral-600 dark:text-neutral-400">
								<li class="flex items-center gap-3 font-semibold">
									<Check class="h-5 w-5 flex-shrink-0" /><span>Everything in Basic, plus:</span>
								</li>
								<li class="flex items-center gap-3">
									<LayoutGrid class="h-5 w-5 flex-shrink-0" /><span>Project Boards</span>
								</li>
								<li class="flex items-center gap-3">
									<ChartColumn class="h-5 w-5 flex-shrink-0" /><span>Advanced Analytics</span>
								</li>
								<li class="flex items-center gap-3">
									<GitMerge class="h-5 w-5 flex-shrink-0" /><span>Git & API Integrations</span>
								</li>
							</ul>
							<button
								disabled
								class="mt-8 block w-full cursor-not-allowed rounded-md bg-neutral-200 py-3 text-center font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
								>Coming Soon</button
							>
						</div>

						<div
							class="flex flex-col rounded-lg border border-neutral-200 p-8 opacity-70 grayscale dark:border-neutral-800"
						>
							<h3 class="text-2xl font-semibold">Team</h3>
							<p class="mt-2 text-neutral-500">For collaborative organizations.</p>
							<div class="my-8">
								<span class="text-5xl font-bold">TBA</span>
							</div>
							<ul class="flex-grow space-y-4 text-neutral-600 dark:text-neutral-400">
								<li class="flex items-center gap-3 font-semibold">
									<Check class="h-5 w-5 flex-shrink-0" /><span>Everything in Pro, plus:</span>
								</li>
								<li class="flex items-center gap-3">
									<Users class="h-5 w-5 flex-shrink-0" /><span>Shared Workspaces</span>
								</li>
								<li class="flex items-center gap-3">
									<Users class="h-5 w-5 flex-shrink-0" /><span>Collaborative Task Lists</span>
								</li>
								<li class="flex items-center gap-3">
									<Users class="h-5 w-5 flex-shrink-0" /><span>Admin & User Roles</span>
								</li>
							</ul>
							<button
								disabled
								class="mt-8 block w-full cursor-not-allowed rounded-md bg-neutral-200 py-3 text-center font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
								>Coming Soon</button
							>
						</div>
					</div>
				</div>
			</section>

			<section class="flex flex-col items-center gap-6 px-4 py-20 text-center md:py-32">
				<h2 class="text-4xl font-bold tracking-tighter sm:text-5xl">Find Your Flow State.</h2>
				<p class="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
					Leave the lag and clutter behind. Sign up for Tasken and experience what it feels like to
					have your tools work as fast as you do.
				</p>
				<a
					href="/home"
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
					<a href="/terms" class="hover:text-black dark:hover:text-white">Terms</a>
					<a href="/privacy" class="hover:text-black dark:hover:text-white">Privacy</a>
				</div>
			</div>
		</footer>
	</div>
</div>
