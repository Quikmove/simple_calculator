import { OperationNotFoundError } from "./errors.js";
import {
  UnaryOperation,
  BinaryOperation,
  UnaryRegistry,
  BinaryRegistry,
} from "./operations/base.js";
export type CalcState = {
  curr: string;
  prev: string;
  operator: string | null;
  waitingForNew: boolean;
};
export type Action =
  | { type: "num"; key: string }
  | { type: "dot" }
  | { type: "clear" }
  | { type: "delete" }
  | { type: "unary"; key: string }
  | { type: "binary"; key: string }
  | { type: "equals" };
type CalcStateListener = (c: CalcState) => void;
export class Calculator {
  private state: CalcState = {
    curr: "",
    prev: "",
    operator: null,
    waitingForNew: false,
  };
  private readonly unary = new Map<string, UnaryOperation>();
  private readonly binary = new Map<string, BinaryOperation>();
  private listeners: Array<CalcStateListener> = [];
  constructor(deps: { unaryOps?: UnaryRegistry; binaryOps?: BinaryRegistry }) {
    if (deps.unaryOps)
      Object.entries(deps.unaryOps).forEach(([k, v]) =>
        this.registerUnary(k, v),
      );
    if (deps.binaryOps)
      Object.entries(deps.binaryOps).forEach(([k, v]) =>
        this.registerBinary(k, v),
      );
  }
  getState(): CalcState {
    return { ...this.state };
  }

  onChange(fn: CalcStateListener): () => void {
    this.listeners.push(fn);
    fn(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }
  dispatch(action: Action): void {
    switch (action.type) {
      case "num": {
        if (typeof action.key !== "string" || isNaN(parseFloat(action.key)))
          break;
        if (this.state.waitingForNew || this.state.curr === "") {
          this.state.curr = action.key;
        } else {
          this.state.curr =
            this.state.curr === "0" ? action.key : this.state.curr + action.key;
        }
        this.state.waitingForNew = false;
        break;
      }
      case "dot": {
        if (this.state.waitingForNew || this.state.curr === "")
          this.state.curr = "0.";
        else if (!this.state.curr.includes(".")) this.state.curr += ".";
        this.state.waitingForNew = false;
        break;
      }
      case "clear": {
        this.state = {
          curr: "",
          prev: "",
          operator: null,
          waitingForNew: false,
        };
        break;
      }
      case "delete": {
        console.log();
        if (this.state.curr !== "") {
          this.state.curr = this.state.curr.slice(0, -1) || "";
          if (this.state.curr === "") this.state.waitingForNew = true;
        } else if (this.state.waitingForNew && this.state.prev !== "") {
          this.state.curr = this.state.prev;
          this.state.prev = "";
          this.state.operator = null;
          this.state.waitingForNew = false;
        }
        break;
      }
      case "unary": {
        if (typeof action.key !== "string") return;
        if (this.state.curr !== "" || this.state.prev !== "")
          this.applyUnary(action.key);
        break;
      }
      case "binary": {
        if (typeof action.key !== "string") return;
        if (action.key === "subtract" && this.state.curr == "") {
          this.state.curr = "-";
          this.state.waitingForNew = false;
        } else if (
          (this.state.curr !== "" && this.state.curr !== "-") ||
          this.state.prev !== ""
        )
          this.setOperator(action.key);
        break;
      }
      case "equals": {
        this.calculate();
        break;
      }
    }
    this.emit();
  }
  registerUnary(name: string, op: UnaryOperation): this {
    this.unary.set(name, op);
    return this;
  }
  registerBinary(name: string, op: BinaryOperation): this {
    this.binary.set(name, op);
    return this;
  }
  private applyUnary(name: string) {
    const op = this.unary.get(name);
    if (!op) throw new OperationNotFoundError(name, 1);
    const target = this.state.curr !== "" ? this.state.curr : this.state.prev;
    if (target === "") return;
    const res = op.execute(this.toFiniteNumber(target, "a"));
    if (this.state.curr === "") this.state.prev = String(res);
    else {
      this.state.curr = String(res);
    }
  }

  listUnary(): string[] {
    return [...this.unary.keys()];
  }
  listBinary(): string[] {
    return [...this.binary.keys()];
  }
  private setOperator(opKey: string) {
    if (
      this.state.operator &&
      this.state.prev !== "" &&
      this.state.curr !== ""
    ) {
      this.calculate();
      this.state.prev = this.state.curr;
      this.state.curr = "";
      this.state.operator = opKey;
      this.state.waitingForNew = true;
      return;
    }
    if (this.state.curr !== "") {
      this.state.prev = this.state.curr;
      this.state.curr = "";
    }
    this.state.operator = opKey;
    this.state.waitingForNew = true;
  }

  private calculate() {
    if (
      !this.state.operator ||
      this.state.prev === "" ||
      this.state.curr === ""
    )
      return;
    const op = this.binary.get(this.state.operator);
    if (!op) throw new OperationNotFoundError(this.state.operator, 2);
    const a = this.toFiniteNumber(this.state.prev, "a");
    const b = this.toFiniteNumber(this.state.curr, "b");
    const res = op.execute(a, b);
    this.state = {
      curr: String(res),
      prev: "",
      operator: null,
      waitingForNew: false,
    };
  }
  private toFiniteNumber(x: unknown, label: string): number {
    let n: number;
    if (typeof x === "number") {
      n = x;
    } else if (typeof x === "bigint") {
      n = Number(x);
    } else if (typeof x === "string" && x.trim() !== "") {
      if (x === "Infinity") n = Infinity;
      else if (x === "-Infinity") n = -Infinity;
      else n = Number(x);
    } else {
      throw new TypeError(
        `Argument "${label}" must be a number or bigint, got ${typeof x}`,
      );
    }
    if (!Number.isFinite(n)) {
      throw new TypeError(
        `Argument "${label}" must be a finite number, got ${x}`,
      );
    }
    return n;
  }
  private emit() {
    const s = this.getState();
    this.listeners.forEach((l) => l(s));
  }
}
