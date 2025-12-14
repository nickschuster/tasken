<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import { vibrate } from '$lib/utils/vibrate';
	import TaskCheck from './TaskCheck.svelte';
	import { GripVertical } from '@lucide/svelte';
	import { getTasks } from '$lib/states/task.state.svelte';

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

	function toggleChecked(checked: boolean) {
		if (checked) {
			vibrate(50);
		}

		updateTask(task.id, { completedAt: checked ? new Date() : null });
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

	function onDragEnd() {
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
						<span class="text-xs">
							{new Date(task.dueDate).toLocaleDateString(undefined, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							})}
						</span>
					{/if}
				</div>
			</div>
			{#if !task.completedAt}
				<div
					role="button"
					tabindex="0"
					class="drag-handle pointer-events-none absolute top-1/2 left-0 -translate-x-1/2
						       -translate-y-1/2 cursor-grab p-2 opacity-0 transition-all duration-200
						{!isDragging && draggedTaskId ? 'hidden' : ''}"
					onmousedown={onDragHandleMouseDown}
					onmouseup={onDragHandleMouseUp}
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
