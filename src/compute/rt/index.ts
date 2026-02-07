import Solver, { SolverParams } from "../solver";
import Room from "../../objects/room";
import Surface from "../../objects/surface";
import { third_octave, whole_octave, airAttenuation } from '../acoustics';
import { RT_CONSTANTS } from '../../constants/rt-constants';
import { emit, on } from "../../messenger";
import { Matrix4, Triangle, Vector3 } from "three";
import { addSolver, removeSolver, Result, ResultKind, ResultTypes, setSolverProperty, useAppStore, useContainer, useResult, useSolver } from "../../store";
import { v4 as uuid } from 'uuid';
import FileSaver from 'file-saver'; 
import roundTo from "../../common/round-to";

export interface RT60Props extends SolverParams{
  //uuid?: string;
  // containers: KVP<Container>; 
}

export type RT60SaveObject = {
  uuid: string;
  name: string;
  kind: "rt60";
  autoCalculate: boolean;
  temperature?: number;
}

const defaults = {
  name: "RT",
};

export class RT60 extends Solver{
  public uuid; 
  public sabine_rt: number[]; 
  public eyring_rt: number[];
  public ap_rt: number[]; 

  public volume: number; 

  public frequencies: number[];

  public roomID: string;

  public temperature: number;

  public resultID: string;

  public resultExists: boolean; 

  constructor(props: RT60Props = defaults) {
    super(props);
    this.kind = "rt60";
    this.name = props.name || defaults.name;
    this.uuid = uuid(); 

    this.sabine_rt = [];
    this.eyring_rt = []; 
    this.ap_rt = [];
 
    const rooms = useContainer.getState().getRooms();
    this.roomID = rooms.length > 0 ? rooms[0].uuid : ''; 

    this.frequencies = whole_octave.slice(4,11);
    this.temperature = 20;

    this.resultID = uuid(); 
    this.resultExists = false; 

    this.volume = (useContainer.getState().containers[this.roomID] as Room).volumeOfMesh();
  }

  save() {
     const { name, kind, uuid, autoCalculate, temperature } = this;
     return {
       name,
       kind,
       uuid,
       autoCalculate,
       temperature,
     } as RT60SaveObject;
  }

  restore(state: RT60SaveObject) {
    // Let the base Solver restore shared properties like autoCalculate
    super.restore(state);
    // Restore RT60-specific/core identity properties
    this.kind = state.kind;
    this.temperature = state.temperature ?? 20;
    return this;
  }

  calculate(){

    this.reset(); 

    const airAtten = airAttenuation(this.frequencies, this.temperature);
    const mValues = airAtten.map(a => a / (20 / Math.log(10))); // convert dB/m to Np/m
    this.sabine_rt = this.sabine(mValues);
    this.eyring_rt = this.eyring(mValues);
    this.ap_rt = this.arauPuchades(this.room,this.frequencies); 

    if(!this.resultExists){
      emit("ADD_RESULT", {
        kind: ResultKind.StatisticalRT60,
        data: [],
        info: {
          frequency: this.frequencies,
          airabsorption: false,
          temperature: this.temperature,
          humidity: 40,
        },
        name: `Statistical RT Results`,
        uuid: this.resultID,
        from: this.uuid
      } as Result<ResultKind.StatisticalRT60>);
      this.resultExists = true;
    }

    const rt60results = { ...useResult.getState().results[this.resultID] as Result<ResultKind.StatisticalRT60> };
    rt60results.data = [] as ResultTypes[ResultKind.StatisticalRT60]["data"];

    for(let i = 0; i<this.frequencies.length; i++){
      rt60results.data.push({
        frequency: this.frequencies[i], 
        sabine: this.sabine_rt[i],
        eyring: this.eyring_rt[i],
        ap: this.ap_rt[i]
      })
    }
    emit("UPDATE_RESULT", { uuid: this.resultID, result: rt60results });
  }

  reset(){
    this.sabine_rt = [];
    this.eyring_rt = []; 
    this.ap_rt = []; 
  }

  sabine(mValues: number[]) {
    let room = this.room;
    const unitsConstant = this.unitsConstant;
    const v = this.volume;

    const response = [] as number[];
    this.frequencies.forEach((frequency, i) => {
      let sum = 0;
      room.allSurfaces.forEach((surface: Surface) => {
        sum += surface.getArea() * surface.absorptionFunction(frequency);
      });
      let airabsterm = 4*mValues[i]*v;
      response.push((unitsConstant*v)/(sum+airabsterm));
    });
    return response;
  }
  
  eyring(mValues: number[]){
    let room = this.room;
    const unitsConstant = this.unitsConstant;
    const v = this.volume;

    const response = [] as number[];
    this.frequencies.forEach((frequency, i) => {
      let sum = 0;
      let totalSurfaceArea = 0;
      room.allSurfaces.forEach((surface: Surface) => {
        totalSurfaceArea += surface.getArea();
        sum += surface.getArea() * surface.absorptionFunction(frequency);
      });
      // Clamp α to prevent Math.log(0) = -Infinity or Math.log(negative) = NaN when α ≥ 1
      let avg_abs = Math.max(0, Math.min(sum / totalSurfaceArea, 0.9999));
      let airabsterm = 4*mValues[i]*v;
      response.push((unitsConstant * v) / (-totalSurfaceArea*Math.log(1-avg_abs)+airabsterm));
    });
    return response;
  }


  arauPuchades(room: Room, frequencies: number[] = third_octave) {
    
    // the goal of arau puchades is to break the surfaces into components (x, y, z)
    // well do this by projecting each surface onto the planes x=0, y=0, and z=0
    // https://en.wikipedia.org/wiki/Orthographic_projection
    

    const v = room.volumeOfMesh();
    const unitsConstant = this.unitsConstant;
    // prettier-ignore
    const Px = new Matrix4().fromArray([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat());

    // prettier-ignore
    const Py = new Matrix4().fromArray([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ].flat());

    // prettier-ignore
    const Pz = new Matrix4().fromArray([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1]
    ].flat());

    // [Px, Py, Pz].map
    const planes = [Px, Py, Pz];

    const surfaces = room.allSurfaces as Surface[];
    const projectedSurfaces = surfaces.map(surface => {
      const area = surface.triangles.reduce((acc,tri) => {
        const projectedVectors = planes.map(P=>tri.map(pt => new Vector3().fromArray(pt).applyMatrix4(P)));
        // the projected areas [x,y,z] for this triangle
        const areas = projectedVectors.map(vectors=>new Triangle(...vectors).getArea());
        return acc.map((a,i)=>a+areas[i]);
      }, [0,0,0]);

      const sabines = frequencies.map(freq=>area.map(a=>surface.absorptionFunction(freq)*a));
      return { area, sabines };
    });

    const [[Ax, αx],[Ay, αy],[Az, αz]] = [0,1,2].map(i=>{
      const surfacearea = projectedSurfaces.reduce((acc, { area })=>acc + area[i], 0);
      const sabines = frequencies.map((freq,f) => projectedSurfaces.reduce((acc, { sabines })=> acc+sabines[f][i], 0));
      // Clamp α to prevent Math.log(1 - α) from hitting -Infinity or NaN when α ≥ 1
      const alphas = sabines.map(sabine=>Math.max(0, Math.min(sabine/surfacearea, 0.9999)));
      return [surfacearea, alphas];
    });

    const A = Ax+Ay+Az;

    return frequencies.map((freq,f)=>{
      const airabsterm = 4*airAttenuation([freq])[0]*v;
      const rt =
      ((unitsConstant*v) / (-A * (Math.log(1-αx[f])) + airabsterm) ) ** (Ax/A) *
      ((unitsConstant*v) / (-A * (Math.log(1-αy[f])) + airabsterm) ) ** (Ay/A) *
      ((unitsConstant*v) / (-A * (Math.log(1-αz[f])) + airabsterm) ) ** (Az/A);
      return rt;
    });
  }

  onParameterConfigFocus() {}
  onParameterConfigBlur() {}

  downloadRT60AsCSV(){

    let precision = 4;
    let freqlabel = "Octave Band (Hz),"
    let sabinelabel = "Sabine RT,";
    let eyringlabel = "Eyring RT,";
    let aplabel = "Arau-Puchades RT,";

    let CSV = [freqlabel.concat((this.frequencies).toString()),
      sabinelabel.concat((this.sabine_rt).map((n)=>n.toFixed(precision)).toString()),
      eyringlabel.concat((this.eyring_rt).map((n)=>n.toFixed(precision)).toString()),
      aplabel.concat((this.ap_rt).map((n)=>n.toFixed(precision)).toString()),
    ].join('\n');

    console.log(CSV); 

    var csvFile = new Blob([CSV], {type: 'text/csv'});
    FileSaver.saveAs(csvFile, `rt60-${this.uuid}.csv`);
  }


  // setters and getters
  get unitsConstant(){
    return RT_CONSTANTS[useAppStore.getState().units];
  }
  get room(){
    return useContainer.getState().containers[this.roomID] as Room; 
  }
  get noResults(){
    if (this.sabine_rt.length === 0 && this.eyring_rt.length === 0  && this.ap_rt.length === 0 ){
      return true;
    }else{
      return false;
    }
  }
  get displayVolume(){
    return roundTo(this.volume, 2);
  }

  set displayVolume(volume: number){
    this.volume = volume;
  }
}


export default RT60;



// this allows for nice type checking with 'on' and 'emit' from messenger
declare global {
  interface EventTypes {
    ADD_RT60: RT60 | undefined,
    REMOVE_RT60: string,
    RT60_SET_PROPERTY: {
      uuid: string;
      property: keyof RT60;
      value: RT60[EventTypes["RT60_SET_PROPERTY"]["property"]]; 
    }
    UPDATE_RT60: string; 
    DOWNLOAD_RT60_RESULTS: string; 
  }
}

// add event listener 
on("ADD_RT60", addSolver(RT60)); 
on("UPDATE_RT60", (uuid: string) => void (useSolver.getState().solvers[uuid] as RT60).calculate());
on("REMOVE_RT60", removeSolver); 
on("DOWNLOAD_RT60_RESULTS", (uuid: string) => void (useSolver.getState().solvers[uuid] as RT60).downloadRT60AsCSV()); 
on("RT60_SET_PROPERTY", setSolverProperty); 

