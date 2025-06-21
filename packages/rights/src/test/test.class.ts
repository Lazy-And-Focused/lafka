import assert from "assert";

class Test {
	private readonly _tests: { returned: unknown, must: unknown, log?: unknown, name: string }[];
	private readonly _name: string;

	constructor(name: string, tests: { returned: unknown, must: unknown, log?: unknown, name: string }[]) {
		this._name = name;
		this._tests = tests;
	}

	public readonly execute = () => {
		describe(this._name, () => {
			for (const test of this._tests) {
				const answer = test.must;
				const programmAnswer = test.returned;

				it(`${test.name}, must: ${JSON.stringify(test.must, undefined, 2)}${test.log ? `\n${JSON.stringify(test.log, undefined)}` : ""}`, () => {
					assert.equal(answer, programmAnswer, `Вернул ${JSON.stringify(programmAnswer, undefined, 2)}`);
				});
			}
		});
	};
}

export default Test;