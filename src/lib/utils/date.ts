export function isToday(date?: Date | string) {
	if (!date) return false;

	if (typeof date === 'string') {
		date = new Date(date);
	}

	const now = new Date();

	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()
	);
}

export function isTomorrow(date?: Date | string) {
	if (!date) return false;

	if (typeof date === 'string') {
		date = new Date(date);
	}

	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);

	return (
		date.getFullYear() === tomorrow.getFullYear() &&
		date.getMonth() === tomorrow.getMonth() &&
		date.getDate() === tomorrow.getDate()
	);
}

export function isPastDue(date?: Date) {
	if (!date) return false;

	const now = new Date();

	return date < now && !isToday(date);
}
