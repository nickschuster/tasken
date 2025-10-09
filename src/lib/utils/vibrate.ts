export function vibrate(pattern: number | number[] = 50) {
	if (typeof navigator === 'undefined') return;

	try {
		if (typeof window !== 'undefined' && 'matchMedia' in window) {
			const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
			if (mq && mq.matches) return;
		}
	} catch {
		console.error('Error checking prefers-reduced-motion');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const v = (navigator as any).vibrate ?? (navigator as any).vibrate;
	if (typeof v === 'function') {
		try {
			v(pattern);
		} catch {
			console.error('Error triggering vibration');
		}
	}
}
