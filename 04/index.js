const filename = Bun.argv.includes("--sample") ? "sample.txt" : "input.txt";
const file = Bun.file(new URL(filename, import.meta.url));

const text = await file.text();
const inputLines = text.split("\n").filter((x) => x);

const cards = inputLines.map((line) => {
	const { cardId, winningNumbers, yourNumbers } = line.match(
		/^Card\s+(?<cardId>\d+):\s+(?<winningNumbers>[\d\s]+) \|\s+(?<yourNumbers>[\d\s]+)$/
	).groups;

	return {
		cardId: parseInt(cardId),
		winningNumbers: winningNumbers.split(/\s+/).map((x) => parseInt(x)),
		yourNumbers: yourNumbers.split(/\s+/).map((x) => parseInt(x)),
	};
});

function part1() {
	return cards.reduce((acc, { yourNumbers, winningNumbers }) => {
		const matchedNumbers = yourNumbers.filter((x) => winningNumbers.includes(x)).length;
		if (!matchedNumbers) {
			return acc;
		}
		return acc + 2 ** (matchedNumbers - 1);
	}, 0);
}

function part2() {
	const counts = Array.from(cards, () => 1);
	for (const { cardId, yourNumbers, winningNumbers } of cards) {
		const matchedNumbers = yourNumbers.filter((x) => winningNumbers.includes(x)).length;
		for (let i = 0; i < matchedNumbers; ++i) {
			// NOTE: cardId happens to point to the index _after_
			// the current position: `cards[0] = { cardId: 1, ... }`
			counts[cardId + i] += counts[cardId - 1];
		}
	}

	return counts.reduce((sum, current) => sum + current);
}

console.log({
	part1: part1(),
	part2: part2(),
});
