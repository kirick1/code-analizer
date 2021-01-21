export class Metrics {
  commentLevel: number;
  count: {
    physical: number;
    overall: number;
    logical: number;
    comment: number;
    empty: number;
  };

  constructor() {
    this.commentLevel = 0;
    this.count = {
      physical: 0,
      overall: 0,
      logical: 0,
      comment: 0,
      empty: 0,
    };
  }
}
