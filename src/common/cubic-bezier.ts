export default function cubicBezier(
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	const p0 = [0, 0];
	const p1 = [x1, y1];
	const p2 = [x2, y2];
	const p3 = [1, 1];

	return function B(t: number) {
		const c0 = (1 - t) ** 3;
		const c1 = 3 * (1 - t) ** 2 * t;
		const c2 = 3 * (1 - t) * t ** 2;
		const c3 = t ** 3;
		return p0[1] * c0 + p1[1] * c1 + p2[1] * c2 + p3[1] * c3;
	};
}
