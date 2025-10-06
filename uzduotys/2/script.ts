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
const leftDisplayElement =
  document.querySelector<HTMLInputElement>("#left-display")!;
const rightDisplayElement =
  document.querySelector<HTMLInputElement>("#right-display")!;
const operatorElement = document.querySelector<HTMLSpanElement>("#operator")!;

function updateDisplay(s: CalcState) {
  if (s.prev) {
    leftDisplayElement.value = s.prev;
    rightDisplayElement.value = s.curr;
  } else {
    leftDisplayElement.value = s.curr;
    rightDisplayElement.value = "";
  }
  if (s.operator && s.operator != "")
    operatorElement.innerText = binaryOpsMap[s.operator];
  else operatorElement.innerText = "";
}

let calc = new Calculator({
  binaryOps,
  unaryOps,
});

calc.onChange(updateDisplay);

const keyboard = document.querySelector<HTMLDivElement>(".keyboard");
const numButtons = keyboard?.querySelectorAll<HTMLButtonElement>(
  "button[data-number]"
);
const binaryButtons = keyboard?.querySelectorAll<HTMLButtonElement>(
  "button[data-binary]"
);
binaryButtons?.forEach((bt) => {
  bt.addEventListener("click", (ev) => {
    calc.dispatch({ type: "binary", key: bt.dataset.key! });
  });
});
const unaryButtons =
  keyboard?.querySelectorAll<HTMLButtonElement>("button[data-unary]");

unaryButtons?.forEach((bt) => {
  bt.addEventListener("click", (ev) => {
    calc.dispatch({ type: "unary", key: bt.dataset.key! });
  });
});
const equalsButton = keyboard?.querySelector<HTMLButtonElement>(
  "button[data-equals]"
);
equalsButton?.addEventListener("click", (ev) =>
  calc.dispatch({ type: "equals" })
);
const allClearButton = keyboard?.querySelector<HTMLButtonElement>(
  "button[data-all-clear]"
);
allClearButton?.addEventListener("click", (ev) =>
  calc.dispatch({ type: "clear" })
);
const delButton = keyboard?.querySelector<HTMLButtonElement>(
  "button[data-delete]"
);
delButton?.addEventListener("click", (ev) => {
  calc.dispatch({ type: "delete" });
});
const dotButton =
  keyboard?.querySelector<HTMLButtonElement>("button[data-dot]");
dotButton?.addEventListener("click", (ev) => calc.dispatch({ type: "dot" }));
numButtons?.forEach((bt) => {
  // const number: number = Number.parseInt(bt.dataset.key!);
  bt.addEventListener("click", (_) => {
    console.log("pressed a num button");
    calc.dispatch({ type: "num", key: bt.dataset.key! });
  });
});
