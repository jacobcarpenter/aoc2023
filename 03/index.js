const filename = Bun.argv.includes("--sample") ? "sample.txt" : "input.txt";
const file = Bun.file(new URL(filename, import.meta.url));

const text = await file.text();
const inputLines = text.split("\n").filter((x) => x);

const allNumberPostions = inputLines.flatMap((line, lineNumber) => {
	return [...line.matchAll(/\d+/dg)].map((match) => {
		const [start, end] = match.indices[0];
		return { lineNumber, start, end, value: parseInt(match[0]) };
	});
});

function part1() {
	return allNumberPostions
		.filter(({ lineNumber, start, end }) => {
			return getAdjacentPositions(lineNumber, start, end).some(([lineNumber, position]) =>
				checkIsSymbol(inputLines, lineNumber, position)
			);
		})
		.reduce((sum, { value }) => sum + value, 0);
}

function part2() {
	let sumOfGearRatios = 0;

	const allStarPositions = inputLines.flatMap((line, lineNumber) => {
		return [...line.matchAll(/\*/dg)].map((match) => {
			const [start, end] = match.indices[0];
			return { lineNumber, start, end };
		});
	});

	for (const { lineNumber, start, end } of allStarPositions) {
		const adjacentPositions = getAdjacentPositions(lineNumber, start, end);

		const adjacentParts = allNumberPostions.filter((numberPosition) =>
			adjacentPositions.some(
				([starAdjacentLineNumber, starAdjacentPosition]) =>
					numberPosition.lineNumber === starAdjacentLineNumber &&
					numberPosition.start <= starAdjacentPosition &&
					numberPosition.end > starAdjacentPosition
			)
		);

		if (adjacentParts.length === 2) {
			sumOfGearRatios += adjacentParts[0].value * adjacentParts[1].value;
		}
	}

	return sumOfGearRatios;
}

console.log({
	part1: part1(),
	part2: part2(),
});

/**
 * @param {string[]} lines
 * @param {number} lineNumber
 * @param {number} position
 */
function checkIsSymbol(lines, lineNumber, position) {
	if (lineNumber < 0 || lineNumber >= lines.length) {
		return false;
	}

	const line = lines[lineNumber];
	if (position < 0 || position >= line.length) {
		return false;
	}

	return !/[.\d]/.test(line[position]);
}

/**
 * @param {number} lineNumber
 * @param {number} start
 * @param {number} end
 */
function getAdjacentPositions(lineNumber, start, end) {
	return [
		...cartesianProduct([lineNumber - 1], range([start - 1, end])),
		...cartesianProduct([lineNumber], [start - 1, end]),
		...cartesianProduct([lineNumber + 1], range([start - 1, end])),
	];
}

/**
 * @param {Iterable<number>} first
 * @param {Iterable<number>} second
 */
function* cartesianProduct(first, second) {
	for (const a of first) {
		for (const b of second) {
			yield [a, b];
		}
	}
}

/**
 * @param {[start: number, end: number]} bounds
 */
function* range([start, end]) {
	for (let i = start; i <= end; ++i) {
		yield i;
	}
}
