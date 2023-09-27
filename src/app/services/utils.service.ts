import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  splitArrayBySize(p: any, c: number, size: number) {
    if (p[p.length - 1].length == size) {
      p.push([]);
    }
    p[p.length - 1].push(c);
    return p;
  }

  averageNum(arr: [any]) {
    return arr.reduce((sum, a) => sum + a, 0) / arr.length;
  }
}
