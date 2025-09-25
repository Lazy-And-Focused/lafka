import assert from "assert";

type Tests = { returned: unknown, must: unknown, log?: unknown, name: string }[]
export class Test {
	private readonly _tests: Tests;
	private readonly _name: string;

	public constructor(name: string, tests: Tests) {
		this._name = name;
		this._tests = tests;
	}

	public readonly execute = () => {
		describe(this._name, () => {
			for (const test of this._tests) {
				const answer = test.must;
				const programmAnswer = test.returned;

				const must = JSON.stringify(answer, undefined, 2);
				const log = test.log ? `\n${JSON.stringify(test.log, undefined)}` : "";
				const returned = JSON.stringify(programmAnswer, undefined, 2);

				it(`${test.name}, must: ${must}${log}`, () => {
					assert.equal(answer, programmAnswer, `Вернул ${returned}`);
				});
			}
		});
	};
}

export default Test;