import { v4 as uuid } from 'uuid';

export interface TaskParams {
  name: string;
  id?: string;
  desc: string;
  complete: (...args: unknown[]) => unknown;
}

export class Task{
  name: string;
  desc: string;
  complete: (...args: unknown[]) => unknown;
  id: string;
  constructor(params: TaskParams) {
    this.name = params.name;
    this.desc = params.desc;
    this.id = params.id || uuid()
    this.complete = params.complete;
  }
}