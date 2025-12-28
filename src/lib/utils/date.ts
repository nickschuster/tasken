export function isToday(date?: Date) {
	if (!date) return false;

	const now = new Date();

	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()
	);
}

export function isTomorrow(date?: Date) {
	if (!date) return false;

	const now = new Date();
	const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

	return (
		date.getFullYear() === tomorrow.getFullYear() &&
		date.getMonth() === tomorrow.getMonth() &&
		date.getDate() === tomorrow.getDate()
	);
}
