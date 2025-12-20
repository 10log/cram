
import registerObjectEvents from './objects/events';
import registerSolverEvents from './compute/events';
import registerAutoCalculateEvents from './compute/auto-calculate';


export default function registerAllEvents(){
  registerObjectEvents();
  registerSolverEvents();
  registerAutoCalculateEvents();
}
