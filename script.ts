import { CalcState, Calculator } from "./calculator.js";
import { BinaryRegistry, UnaryRegistry } from "./operations/base.js";
import {
  AbsOperation,
  AddOperation,
  DivideOperation,
  MultiplyOperation,
  NaturalLogarithmOperation,
  RaiseToPowerOperation,
  SquareOperation,
  SquareRootOperation,
  SubtractOperation,
} from "./operations/basic.js";
let binaryOps: BinaryRegistry = {
  add: new AddOperation(),
  subtract: new SubtractOperation(),
  multiply: new MultiplyOperation(),
  divide: new DivideOperation(),
  pow: new RaiseToPowerOperation(),
};
let unaryOps: UnaryRegistry = {
  ln: new NaturalLogarithmOperation(),
  sqrt: new SquareRootOperation(),
  abs: new AbsOperation(),
  sqr: new SquareOperation(),
};
let binaryOpsMap: Record<string, string> = {
  add: "+",
  subtract: "-",
  multiply: "x",
  divide: "/",
  pow: "^",
};
const previousOperand =
  document.querySelector<HTMLDivElement>(".previous-operand")!;
const currentOperand =
  document.querySelector<HTMLDivElement>(".current-operand")!;

function updateDisplay(s: CalcState) {
  if (s.prev) {
    previousOperand.innerText = s.prev;
    currentOperand.innerText = s.curr;
  } else {
    currentOperand.innerText = s.curr;
    previousOperand.innerText = "";
  }
  if (s.operator && s.operator != "")
    previousOperand.dataset.operator = binaryOpsMap[s.operator];
  else previousOperand.dataset.operator = "";
}

let calc = new Calculator({
  binaryOps,
  unaryOps,
});

calc.onChange(updateDisplay);

const numButtons = document?.querySelectorAll<HTMLButtonElement>(
  "button[data-number]",
);
numButtons?.forEach((bt) => {
  bt.addEventListener("click", (_) => {
    calc.dispatch({ type: "num", key: bt.dataset.key! });
  });
});

const binaryButtons = document?.querySelectorAll<HTMLButtonElement>(
  "button[data-binary]",
);
binaryButtons?.forEach((bt) => {
  bt.addEventListener("click", (ev) => {
    calc.dispatch({ type: "binary", key: bt.dataset.key! });
  });
});

const unaryButtons =
  document?.querySelectorAll<HTMLButtonElement>("button[data-unary]");
unaryButtons?.forEach((bt) => {
  bt.addEventListener("click", (ev) => {
    calc.dispatch({ type: "unary", key: bt.dataset.key! });
  });
});

const equalsButton = document?.querySelector<HTMLButtonElement>(
  "button[data-equals]",
);
equalsButton?.addEventListener("click", (ev) =>
  calc.dispatch({ type: "equals" }),
);

const allClearButton = document?.querySelector<HTMLButtonElement>(
  "button[data-all-clear]",
);
allClearButton?.addEventListener("click", (ev) =>
  calc.dispatch({ type: "clear" }),
);

const delButton = document?.querySelector<HTMLButtonElement>(
  "button[data-delete]",
);
delButton?.addEventListener("click", (ev) => {
  calc.dispatch({ type: "delete" });
});

const dotButton =
  document?.querySelector<HTMLButtonElement>("button[data-dot]");
dotButton?.addEventListener("click", (ev) => calc.dispatch({ type: "dot" }));
