export {};

declare global {
  export interface Array<T> {
    splitArrayBySize(num: number, size: number): T[];
    averageNum(): T;
  }
}

if (!Array.prototype.splitArrayBySize) {
  Array.prototype.splitArrayBySize = function (
    num: number,
    size: number
  ): Array<any> {
    if (this[this.length - 1].length == size) {
      this.push([]);
    }
    this[this.length - 1].push(num);
    return this;
  };
}

if (!Array.prototype.averageNum) {
  Array.prototype.averageNum = function (): number {
    return (
      this.reduce(
        (sum: number, currentValue: number) => sum + currentValue,
        0
      ) / this.length
    );
  };
}
