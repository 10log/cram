import hash from 'object-hash';

export class HashMap<T extends object> {
  private map: Map<string, T> = new Map();
  constructor(values?: T[]){
    if(values){
      values.forEach(value => this.map.set(hash(value as object), value));
    }
  }
  get = this.map.get;
  keys = this.map.keys;
  values = this.map.values;
  entries = this.map.entries;
  forEach = this.map.forEach;
  add(value: T){
    this.map.set(hash(value as object), value);
  }
  clear(){
    this.map.clear();
  }
  delete(value: T){
    this.map.delete(hash(value as object));
  }
  has(value: T){
    this.map.has(hash(value as object));
  }
  get size(){
    return this.map.size
  }
}

export default HashMap;