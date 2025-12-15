const BASE_DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// `a` may be empty string, `b` is null or non-empty string.
// `a < b` lexicographically if `b` is non-null.
// no trailing zeros allowed.
// digits is a string such as '0123456789' for base 10.  Digits must be in
// ascending character code order!
function midpoint(a: string, b: string | null, digits: string): string {
	if (b !== null && a >= b) {
		throw new Error(a + ' >= ' + b);
	}
	if (a.slice(-1) === '0' || (b && b.slice(-1) === '0')) {
		throw new Error('trailing zero');
	}
	if (b) {
		// remove longest common prefix.  pad `a` with 0s as we
		// go.  note that we don't need to pad `b`, because it can't
		// end before `a` while traversing the common prefix.
		let n = 0;
		while ((a.charAt(n) || '0') === b.charAt(n)) {
			n++;
		}
		if (n > 0) {
			return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits);
		}
	}
	// first digits (or lack of digit) are different
	const digitA = a ? digits.indexOf(a.charAt(0)) : 0;
	const digitB = b !== null ? digits.indexOf(b.charAt(0)) : digits.length;
	if (digitB - digitA > 1) {
		const midDigit = Math.round(0.5 * (digitA + digitB));
		return digits.charAt(midDigit);
	} else {
		// first digits are consecutive
		if (b && b.length > 1) {
			return b.slice(0, 1);
		} else {
			// `b` is null or has length 1 (a single digit).
			// the first digit of `a` is the previous digit to `b`,
			// or 9 if `b` is null.
			// given, for example, midpoint('49', '5'), return
			// '4' + midpoint('9', null), which will become
			// '4' + '9' + midpoint('', null), which is '495'
			return digits.charAt(digitA) + midpoint(a.slice(1), null, digits);
		}
	}
}

export function mid(a: string, b: string | null) {
	return midpoint(a, b, BASE_DIGITS);
}

export function midBefore(b: string) {
	return midpoint('', b, BASE_DIGITS);
}

export function midAfter(a: string) {
	return midpoint(a, null, BASE_DIGITS);
}
