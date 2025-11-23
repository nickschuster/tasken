let totalCompletedTasksCount = $state(0);

export function getTotalCompletedCount() {
	return totalCompletedTasksCount;
}

export function setTotalCompletedCount(count: number) {
	totalCompletedTasksCount = count;
}

export function incrementCompletedCount() {
	totalCompletedTasksCount += 1;
}

export function decrementCompletedCount() {
	totalCompletedTasksCount -= 1;
}
