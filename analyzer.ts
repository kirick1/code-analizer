import { Metrics } from "./metrics";
import { Input } from "./input";

export class Analyzer {
  private _metrics: Metrics = new Metrics();

  private _input: Input;

  private _logicalReservedWords = [
    "typeof",
    "=",
    "for",
    "if",
    "else",
    "while",
    "do",
    "switch",
    "case",
    "return",
    "break",
    "continue",
    "console",
    "try",
    "catch",
  ];

  private _logicalRegex = [/([a-zA-z0-9]+\.[a-zA-z]+[(])/g];

  constructor(input: Input) {
    this._input = input;

    for (const word of this._logicalReservedWords.reverse()) {
      this._logicalRegex.unshift(new RegExp(word, "g"));
    }

    this.calculateMetrics();
  }

  checkLogical(string: string) {
    let count = 0;
    let matches = [];
    for (let i = 0; i < this._logicalRegex.length; i++) {
      if (
        i === 1 &&
        Array.from(string.matchAll(this._logicalRegex[2])).length
      ) {
        continue;
      }
      matches = Array.from(string.matchAll(this._logicalRegex[i]));

      count += matches.length;
      matches = [];
    }
    return count;
  }

  calculateMetrics() {
    this._metrics.count.overall = this._input.text.length;
    let c = false;
    for (let i = 0; i < this._input.text.length; i++) {
      if (!this._input.text[i]) {
        this._metrics.count.empty++;
        continue;
      }

      if (this._input.text[i].match(/\/\*/g)) {
        this._metrics.count.comment++;
        c = true;
      }

      if (c) {
        c = !this._input.text[i].match(/\*\//g);
      }

      if (this._input.text[i].match(/\/\//g)) {
        this._metrics.count.comment++;
        continue;
      }

      this._metrics.count.logical += this.checkLogical(this._input.text[i]);
    }

    this._metrics.count.physical =
      this._metrics.count.empty / this._metrics.count.overall >= 0.25
        ? this._metrics.count.overall
        : this._metrics.count.overall - this._metrics.count.empty;

    this._metrics.commentLevel = Number(
      (this._metrics.count.comment / this._metrics.count.overall).toFixed(3)
    );
  }

  printResult(): void {
    console.log(JSON.stringify(this._metrics, null, 2));
  }
}
