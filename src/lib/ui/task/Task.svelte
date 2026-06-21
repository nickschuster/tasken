<script lang="ts">
  import type { Task, TaskGroup } from '$lib/server/db/schema';
  import { vibrate } from '$lib/utils/vibrate';
  import TaskCheck from './TaskCheck.svelte';
  import { GripVertical, Repeat, Zap } from '@lucide/svelte';
  import { getTasks } from '$lib/states/task.state.svelte';
  import { isToday, isTomorrow, isPastDue } from '$lib/utils/date';
  import { SvelteDate } from 'svelte/reactivity';
  import { REPEAT_PRESETS, RepeatUnit } from '$lib/models/repeat';
  import { DateTime } from 'luxon';

  type Props = {
    task: Task;
    taskGroups: TaskGroup[];
    updateTask?: (taskId: string, updates: Partial<Task>) => void;
    draggedTaskId: string | null;
    selectedTaskId: string | null;
    orderTask?: (taskId: string) => Promise<void>;
  };

  let {
    task,
    taskGroups,
    updateTask = () => {},
    draggedTaskId = $bindable(),
    selectedTaskId = $bindable(),
    orderTask = async () => {}
  }: Props = $props();

  let taskGroup = $derived(taskGroups.find((group) => group.id === task.taskGroupId) ?? null);
  let taskElement = $state<HTMLDivElement | null>(null);
  let isDragging = $state(false);
  let startIndex = $state<number | null>(null);

  function computeNextDueDate(task: Task) {
    if (!task.repeatUnit || !task.repeatInterval || !task.dueDate) return null;

    if (task.repeatUnit === 'week' && task.repeatDays?.length) {
      // Deal with custom repeat days by finding the next selected day and check if its in the current week or the next cycle
      // Example: Every 2 weeks on Tue, Thu. Complete on Tue -> Next due is Thu (same week). Complete on Thu -> Next due is in 2 Weeks (next cycle)
      const next = new SvelteDate(task.dueDate);
      const days = task.repeatDays
        .split(',')
        .map(Number)
        .sort((a, b) => a - b);

      const currentDay = next.getDay();

      // Is there another day selected later this week?
      let found = false;
      for (const d of days) {
        if (d > currentDay) {
          next.setDate(next.getDate() + (d - currentDay));
          found = true;
          break;
        }
      }

      if (!found) {
        // Jump to the next cycle
        next.setDate(next.getDate() + task.repeatInterval * 7);

        // Jump back to the start of the week, sunday
        const offset = -next.getDay();
        next.setDate(next.getDate() + offset);

        // Jump to the first selected custom day
        next.setDate(next.getDate() + days[0]);
      }

      if (task.repeatTime) {
        const [h, m] = task.repeatTime.split(':').map(Number);
        next.setHours(h, m, 0, 0);
      }

      return next;
    }

    let next = DateTime.fromJSDate(task.dueDate);

    switch (task.repeatUnit) {
      case 'hour':
        next = next.plus({ hours: task.repeatInterval });
        break;
      case 'day':
        next = next.plus({ days: task.repeatInterval });
        break;
      case 'week':
        next = next.plus({ weeks: task.repeatInterval });
        break;
      case 'month':
        next = next.plus({ months: task.repeatInterval });
        break;
      case 'year':
        next = next.plus({ years: task.repeatInterval });
        break;
    }

    if (task.repeatTime && task.repeatUnit !== RepeatUnit.HOUR) {
      const [hours, minutes] = task.repeatTime.split(':').map(Number);
      next = next.set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0
      });
    }

    return next.toJSDate();
  }

  function toggleChecked(checked: boolean) {
    if (checked) {
      vibrate(50);
    }

    if (checked) {
      const nextDue = computeNextDueDate(task);

      let newStreak = 0;
      if (task.dueDate) {
        const completionTime = new Date();
        const dueDate = new Date(task.dueDate);

        newStreak = completionTime <= dueDate ? (task.completionStreak ?? 0) + 1 : 0;
      }

      if (nextDue) {
        updateTask(task.id, {
          dueDate: nextDue,
          completedAt: new Date(),
          completionStreak: newStreak
        });

        setTimeout(() => {
          updateTask(task.id, { completedAt: null });
        }, 2000);
      } else {
        updateTask(task.id, { completedAt: new Date(), completionStreak: newStreak });
      }
    } else {
      updateTask(task.id, { completedAt: null });
    }
  }

  function onClick(e: MouseEvent) {
    e.stopPropagation();
    selectedTaskId = task.id;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectedTaskId = task.id;
    }
  }

  function onFocus() {
    selectedTaskId = task.id;
  }

  function onDragStart(e: DragEvent) {
    if (!e.dataTransfer || !taskElement) return;

    draggedTaskId = taskElement.id;
    isDragging = true;
    startIndex = getTasks()
      .filter((t) => !t.completedAt)
      .findIndex((t) => t.id === task.id);
    e.dataTransfer.setData('text/plain', taskElement.id);
  }

  function onDragHandleMouseDown() {
    if (!taskElement) return;

    taskElement.setAttribute('draggable', 'true');
  }

  function onDragHandleMouseUp() {
    if (!taskElement) return;

    taskElement.setAttribute('draggable', 'false');
  }

  function onDragEnd(e: DragEvent) {
    e.preventDefault();

    isDragging = false;
    draggedTaskId = null;

    const endIndex = getTasks()
      .filter((t) => !t.completedAt)
      .findIndex((t) => t.id === task.id);

    if (startIndex !== null && startIndex !== endIndex) {
      orderTask(task.id);
    }

    startIndex = null;
  }
</script>

<div
  tabindex="0"
  role="button"
  id={task.id}
  onclick={onClick}
  onkeydown={onKeyDown}
  onfocus={onFocus}
  ondragstart={onDragStart}
  ondragend={onDragEnd}
  bind:this={taskElement}
  class="taskItem relative rounded-lg p-2 px-4 transition-all duration-200
			{task.completedAt || (!isDragging && draggedTaskId)
    ? ''
    : ' hover:bg-neutral-100 dark:hover:bg-neutral-900'}
			{isDragging ? ' opacity-0' : ''}"
>
  <div class="flex flex-row items-center justify-between">
    <div class="flex items-center gap-2">
      <TaskCheck checked={!!task.completedAt} {toggleChecked} />
      <div class="flex flex-col">
        <span class={task.completedAt ? 'line-through' : ''}>{task.content}</span>
        <div class="flex">
          {#if task.taskGroupId}
            <div class="flex items-center gap-1">
              <span class="h-2 w-2 rounded-full" style={`background-color: ${taskGroup?.color}`}
              ></span> <span class="text-xs">{taskGroup?.name}</span>
            </div>
          {:else}
            <span class="text-xs">Tasks</span>
          {/if}
          {#if task.dueDate}
            <span class="mx-1 text-xs">•</span>
            <span
              class="text-xs {isPastDue(task.dueDate) && !task.completedAt ? 'text-red-500' : ''}"
            >
              {isToday(task.dueDate)
                ? 'Today'
                : isTomorrow(task.dueDate)
                  ? 'Tomorrow'
                  : new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
            </span>
          {/if}
          {#if task.repeatUnit}
            <Repeat size={14} class="mx-1" />
            <span class="text-xs"
              >{REPEAT_PRESETS.find(
                (preset) =>
                  preset.unit === task.repeatUnit &&
                  preset.interval === task.repeatInterval &&
                  !task.repeatDays
              )?.value || 'Custom'}</span
            >
          {/if}
          {#if task.completionStreak > 1}
            <span class="mx-1 text-xs">•</span>
            <Zap size={14} />
            <span class="text-xs">{task.completionStreak}</span>
          {/if}
        </div>
      </div>
      {#if !task.completedAt}
        <div
          role="button"
          tabindex="0"
          id="dragHandle"
          class="drag-handle pointer-events-none absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none
						       p-2 opacity-0 transition-all duration-200
						{!isDragging && draggedTaskId ? 'hidden' : ''}"
          onmousedown={onDragHandleMouseDown}
          onmouseup={onDragHandleMouseUp}
          ontouchstart={onDragHandleMouseDown}
          ontouchend={onDragHandleMouseUp}
          onclick={(e) => e.stopPropagation()}
          onkeydown={(e) => e.stopPropagation()}
        >
          <GripVertical size={24} />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .taskItem:hover .drag-handle {
    opacity: 1;
    pointer-events: auto;
  }
</style>
