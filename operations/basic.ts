import { DivisionByZeroError, InvalidOperationError } from "../errors.js";
import { BinaryOperation, UnaryOperation } from "./base.js";

export class AddOperation implements BinaryOperation {
  execute(a: number, b: number): number {
    return a + b;
  }
}

export class SubtractOperation implements BinaryOperation {
  execute(a: number, b: number): number {
    return a - b;
  }
}

export class MultiplyOperation implements BinaryOperation {
  execute(a: number, b: number): number {
    return a * b;
  }
}

export class DivideOperation implements BinaryOperation {
  execute(a: number, b: number): number {
    if (b === 0) throw new DivisionByZeroError();
    return a / b;
  }
}

export class SquareRootOperation implements UnaryOperation {
  execute(a: number): number {
    return Math.sqrt(a);
  }
}

export class AbsOperation implements UnaryOperation {
  execute(a: number): number {
    return Math.abs(a);
  }
}
export class InvertSignOperation implements UnaryOperation {
  execute(a: number): number {
      return -a;
  }
}
export class SquareOperation implements UnaryOperation {
  execute(a: number): number {
    return a * a;
  }
}
export class RaiseToPowerOperation implements BinaryOperation {
  execute(a: number, b: number): number {
    return Math.pow(a, b);
  }
}

export class NaturalLogarithmOperation implements UnaryOperation {
  execute(a: number): number {
    if (a <= 0) {
      throw new InvalidOperationError("NaN");
    }
    return Math.log(a);
  }
}

export class ClearOperation implements UnaryOperation {
  execute(a: number): number {
    return 0;
  }
}
