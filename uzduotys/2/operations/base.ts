export interface UnaryOperation {
  execute(a: number): number;
}
export interface BinaryOperation {
  execute(a: number, b: number): number;
}

export type UnaryRegistry = Record<string, UnaryOperation>;
export type BinaryRegistry = Record<string, BinaryOperation>;
