<script lang="ts">
	import DropdownMenuItem from '$lib/ui/dropdown/DropdownMenuItem.svelte';
	import DropdownMenuContent from '$lib/ui/dropdown/DropdownMenuContent.svelte';
	import DatePicker from '$lib/ui/DatePicker.svelte';
	import { CalendarDate, type DateValue } from '@internationalized/date';

	type Props = {
		dateSelected: (date: CalendarDate | null) => void;
		selectedDate: CalendarDate | null;
		customDate: CalendarDate | undefined;
	};

	let { dateSelected, customDate = $bindable(), selectedDate }: Props = $props();

	const handleToday = () => {
		const now = new Date();
		const todayCalendar = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
		dateSelected(todayCalendar);
	};

	const handleTomorrow = () => {
		const now = new Date();
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

		const tomorrowCalendar = new CalendarDate(
			tomorrow.getFullYear(),
			tomorrow.getMonth() + 1,
			tomorrow.getDate()
		);
		dateSelected(tomorrowCalendar);
	};

	const handleCustomDate = (change: DateValue | undefined) => {
		if (!selectedDate || customDate) {
			dateSelected((change as CalendarDate) ?? null);
		}
	};

	const clearDueDate = () => {
		dateSelected(null);
		customDate = undefined;
	};
</script>

<DropdownMenuContent contentProps={{ side: 'top' }}>
	<DropdownMenuItem callback={handleToday}>Today</DropdownMenuItem>

	<DropdownMenuItem callback={handleTomorrow}>Tomorrow</DropdownMenuItem>

	<DropdownMenuItem
		callback={(e: Event) => {
			e.preventDefault();
		}}
	>
		<DatePicker bind:value={customDate} label="Custom" onChange={handleCustomDate} />
	</DropdownMenuItem>

	<DropdownMenuItem callback={() => clearDueDate()}>Clear</DropdownMenuItem>
</DropdownMenuContent>
