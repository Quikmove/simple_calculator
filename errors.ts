export class OperationNotFoundError extends Error {
  constructor(
    public nameKey: string,
    public arity: 1 | 2,
  ) {
    super(`Operation "${nameKey}" with arity=${arity} not found`);
    this.name = "OperationNotFoundError";
  }
}

export class InvalidOperationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "InvalidOperationError";
  }
}

export class DivisionByZeroError extends Error {
  constructor() {
    super("Division by zero");
    this.name = "DivisionByZeroError";
  }
}

export class OutOfBoundsError extends Error {
  constructor() {
    super("Out of bounds");
    this.name = "OutOfBoundsError";
  }
}
