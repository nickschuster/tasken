<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import { vibrate } from '$lib/utils/vibrate';
	import TaskCheck from './TaskCheck.svelte';
	import { GripVertical } from '@lucide/svelte';

	type Props = {
		task: Task;
		taskGroups: TaskGroup[];
		updateTask?: (taskId: string, updates: Partial<Task>) => void;
		draggedTaskId: string | null;
		selectedTaskId: string | null;
	};

	let {
		task,
		taskGroups,
		updateTask = () => {},
		draggedTaskId = $bindable(),
		selectedTaskId = $bindable()
	}: Props = $props();

	let taskGroup = $derived(taskGroups.find((group) => group.id === task.taskGroupId) ?? null);
	let taskElement = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);

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

		taskElement.classList.add('dark:bg-neutral-900', 'bg-neutral-100', 'rounded-lg');
		e.dataTransfer.setData('text/plain', taskElement.id);
		draggedTaskId = taskElement.id;

		setTimeout(() => {
			isDragging = true;
		}, 0);
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
		setTimeout(() => {
			draggedTaskId = null;
		}, 500);
	}
</script>

<div
	class="taskItem flex flex-row items-center {isDragging ? 'opacity-0' : ''}"
	ondragstart={onDragStart}
	ondragend={onDragEnd}
	bind:this={taskElement}
	id={task.id}
	role="figure"
>
	{#if !task.completedAt}
		<div
			role="button"
			tabindex="0"
			id="dragHandle"
			class="z-10 p-2 hover:cursor-grab"
			onmousedown={onDragHandleMouseDown}
			onmouseup={onDragHandleMouseUp}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<GripVertical size={24} />
		</div>
	{/if}
	<div
		tabindex="0"
		role="button"
		onclick={onClick}
		onkeydown={onKeyDown}
		onfocus={onFocus}
		id="taskDescription"
		class="flex-grow rounded-lg p-2 px-4 transition-all duration-200
			{task.completedAt ? '' : '-ml-5 hover:bg-neutral-100 dark:hover:bg-neutral-900'}
			{draggedTaskId ? 'pointer-events-none' : 'pointer-events-auto'}"
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
			</div>
		</div>
	</div>
</div>
