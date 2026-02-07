import { Process } from './process';
import { Task } from './task';



const _proc = new Process({
  name: "some proc", steps: [
    new Task({
      name: "select-surface",
      desc: "select a surface",
      complete: (..._args) => true
    })
  ]
})

