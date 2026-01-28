<script lang="ts">
  import { enhance } from '$app/forms';
  import GoogleButton from '$lib/ui/oauth/GoogleButton.svelte';
  import GithubButton from '$lib/ui/oauth/GithubButton.svelte';

  let { form } = $props();

  let sent = $state(false);

  $effect(() => {
    if (form?.success) {
      sent = true;
    }
  });
</script>

<div class="grid h-screen lg:grid-cols-2 dark:bg-black dark:text-white">
  <div
    class="animate-gradient relative col-span-1 hidden h-screen overflow-hidden bg-gradient-to-tl from-black to-neutral-300 lg:grid lg:place-items-center"
  >
    <div
      class="hub absolute top-1/2 left-1/2 flex h-35 w-35 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl"
    >
      <span class="text-center text-xl font-bold text-black">Tasken</span>
    </div>

    <div class="relative h-[500px] w-[500px]">
      <div
        class="absolute top-[125px] left-[125px] h-[250px] w-[250px] animate-[spin_22s_linear_infinite] rounded-full border-[2px] border-dashed border-neutral-600"
      >
        <div class="absolute top-[120px] left-[-7px] h-[20px] w-[20px] rounded-full bg-black"></div>
      </div>

      <div
        class="absolute top-[75px] left-[75px] h-[350px] w-[350px] animate-[spin_30s_linear_infinite] rounded-full border-[2px] border-dashed border-neutral-600"
      >
        <div
          class="absolute top-[160px] left-[-12px] h-[30px] w-[30px] rounded-full bg-neutral-500"
        ></div>
      </div>

      <div
        class="absolute top-0 left-0 h-[500px] w-[500px] animate-[spin_38s_linear_infinite] rounded-full border-[2px] border-dashed border-neutral-600"
      >
        <div
          class="absolute top-[-25px] left-[230px] h-[40px] w-[40px] rounded-full bg-neutral-400"
        ></div>
      </div>
    </div>

    <div class="absolute bottom-16 text-center">
      <h2 class="text-2xl font-semibold text-white">Set yourself in sync</h2>
    </div>
  </div>

  <div class="col-span-1 h-screen">
    <div class="flex h-full w-full flex-col items-center justify-between">
      {#if !sent}
        <div class="mt-auto mb-auto flex w-xs flex-col gap-2 text-center lg:w-md">
          <h1 class="text-3xl font-bold tracking-tighter lg:text-4xl">Welcome to Tasken.</h1>
          <p class="text-lg text-neutral-600 dark:text-neutral-400">Sync. Share. Succeed.</p>
          {#if form?.error}
            <p class="text-small text-red-500">{form.error}</p>
          {/if}
          <form method="POST" use:enhance class="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              class="rounded-lg border border-neutral-300 bg-white px-4
      py-3 text-lg text-neutral-800 transition-all
      duration-200 ease-in-out placeholder:text-neutral-400
      focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none
      dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200
      dark:placeholder:text-neutral-500 dark:focus:ring-white"
            />
            <button
              type="submit"
              class="rounded-md bg-black px-8 py-3 font-semibold text-white transition-transform duration-200 ease-in-out will-change-transform hover:scale-101 dark:bg-white dark:text-black"
              >Continue with email</button
            >
          </form>
          <h2 class="mt-2 mb-3 w-full border-b border-neutral-300 text-center leading-[0.1]">
            <span class="bg-white px-2 dark:bg-black">or</span>
          </h2>
          <div class="flex flex-col justify-center gap-2">
            <GoogleButton />
            <GithubButton />
          </div>
        </div>
      {:else}
        <div
          class="mt-auto mb-auto flex w-xs flex-col gap-2 text-center
				lg:w-md"
        >
          <h1 class="text-3xl font-bold tracking-tighter lg:text-4xl">Check your inbox.</h1>
          <p class="text-lg text-neutral-600 dark:text-neutral-400">
            We sent a login link to your email address.
          </p>
          <button
            type="button"
            class="text-neutral-500 hover:cursor-pointer dark:text-neutral-600"
            onclick={() => (sent = false)}
          >
            Didn't receive the email?
          </button>
        </div>
      {/if}
      <div class="mb-8 flex gap-6">
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
  </div>
</div>

<style>
  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    background-size: 300% 300%;
    animation: gradient-shift 15s ease infinite;
  }
</style>
