const filename = "input.txt";
const file = Bun.file(new URL(filename, import.meta.url));

const text = await file.text();
const lines = text.split("\n").filter((x) => x);

function part1() {
	return lines.reduce(
		(sum, line) => sum + parseInt(`${line.match(/^.*?(\d)/)[1]}${line.match(/.*(\d).*?$/)[1]}`),
		0
	);
}

function part2() {
	const spelledNums = [, "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
	const digitMatcher = `${spelledNums.filter((x) => x).join("|")}|\\d`;
	const initial = new RegExp(`^.*?(${digitMatcher})`);
	const final = new RegExp(`.*(${digitMatcher}).*?$`);

	function getDigit(line, matcher) {
		const matched = line.match(matcher)[1];
		const maybeValue = spelledNums.indexOf(matched);
		return maybeValue !== -1 ? maybeValue : parseInt(matched);
	}

	return lines.reduce(
		(sum, line) => sum + parseInt(`${getDigit(line, initial)}${getDigit(line, final)}`),
		0
	);
}

console.log({
	part1: part1(),
	part2: part2(),
});
