export enum RepeatUnit {
	HOUR = 'hour',
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year'
}

export const REPEAT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const REPEAT_PRESETS = [
	{ value: 'Hourly', unit: RepeatUnit.HOUR, interval: 1 },
	{ value: 'Daily', unit: RepeatUnit.DAY, interval: 1 },
	{ value: 'Weekly', unit: RepeatUnit.WEEK, interval: 1 },
	{ value: 'Biweekly', unit: RepeatUnit.WEEK, interval: 2 },
	{ value: 'Monthly', unit: RepeatUnit.MONTH, interval: 1 },
	{ value: 'Yearly', unit: RepeatUnit.YEAR, interval: 1 }
] as const;
