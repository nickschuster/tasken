<script lang="ts">
  import { Dialog } from 'bits-ui';

  let { children, open = $bindable(true) } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
    <Dialog.Content
      escapeKeydownBehavior="ignore"
      interactOutsideBehavior="ignore"
      class="fixed top-[50%] left-[50%] z-50 max-h-[calc(100%)] w-full max-w-[calc(100%)] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg bg-white p-5 shadow-md outline-hidden sm:max-w-[900px] md:w-full dark:bg-black"
    >
      {@render children()}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
