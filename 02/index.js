const filename = Bun.argv.includes("--sample") ? "sample.txt" : "input.txt";
const file = Bun.file(new URL(filename, import.meta.url));

const text = await file.text();
const lines = text.split("\n").filter((x) => x);

const games = lines.map((line) => {
	const { gameId, outcomes } = line.match(/^Game (?<gameId>\d+): (?<outcomes>.*)$/).groups;

	return {
		gameId: parseInt(gameId),
		outcomes: outcomes.split("; ").map((outcomeSummary) => {
			return outcomeSummary.split(", ").map((cubeSet) => {
				const { color, count } = cubeSet.match(
					/^(?<count>\d+) (?<color>red|green|blue)$/
				).groups;

				return {
					color,
					count: parseInt(count),
				};
			});
		}),
	};
});

function part1() {
	const maximums = {
		red: 12,
		green: 13,
		blue: 14,
	};

	return games
		.filter(({ outcomes }) =>
			outcomes.flat().every(({ color, count }) => count <= maximums[color])
		)
		.reduce((sum, { gameId }) => sum + gameId, 0);
}

function part2() {
	return games
		.map(({ outcomes }) =>
			outcomes.map((x) =>
				x.reduce(
					(acc, { color, count }) => ({
						...acc,
						[color]: count,
					}),
					{ red: 0, green: 0, blue: 0 }
				)
			)
		)
		.reduce((sum, structuredOutcomes) => {
			const minimumRequired = structuredOutcomes.reduce((acc, curr) => ({
				red: Math.max(acc.red, curr.red),
				green: Math.max(acc.green, curr.green),
				blue: Math.max(acc.blue, curr.blue),
			}));

			const power = minimumRequired.red * minimumRequired.green * minimumRequired.blue;
			return sum + power;
		}, 0);
}

console.log({
	part1: part1(),
	part2: part2(),
});
