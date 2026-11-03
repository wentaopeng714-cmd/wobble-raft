import {T} from './shared/core.js?v=raft6b';
import {surfaceHeight} from './water.js?v=raft6b';
import {local,CELL} from './spatial.js?v=raft6b';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function swellHeight(x,z,g,time){if(g.storm<=.04)return -100;const offset=-12+(g.time%46-28)/18*22,lx=x-g.raftX,lz=z+g.distance-offset-Math.sin(lx*.8+time)*.20,fade=1-((v)=>{v=clamp(v,0,1);return v*v*(3-2*v);})((Math.abs(lx)-4.2)/2.3);if(Math.abs(lz)>1.9||fade<=0)return -100;const crest=Math.max(0,Math.cos(lz/1.9*Math.PI/2))**3;return crest*(.6+g.storm*.9)*fade-.42;}
export const seaLevel=(x,z,g,time)=>Math.max(surfaceHeight(x,z,time,g.storm),swellHeight(x,z,g,time));
export function vesselPose(g,time,dt=1/60,previousY=null){
 const offset=-12+(g.time%46-28)/18*22,lift=g.storm>.04?Math.max(0,Math.cos(clamp(Math.max(0,Math.abs(offset)-1.2)/2.4,0,1)*Math.PI/2))**3*(.6+g.storm*.9):0;
 const sea=surfaceHeight(g.raftX,-g.distance,time,g.storm),dx=surfaceHeight(g.raftX+.55,-g.distance,time,g.storm)-surfaceHeight(g.raftX-.55,-g.distance,time,g.storm),dz=surfaceHeight(g.raftX,-g.distance+.55,time,g.storm)-surfaceHeight(g.raftX,-g.distance-.55,time,g.storm);
 const roll=g.roll+dx*.25,pitch=g.pitch-dz*.25-Math.sin(clamp(offset/1.9,-1,1)*Math.PI/2)*lift*.14,yaw=-g.lateral*.07;
 const matrix=new T.Matrix4().makeRotationFromEuler(new T.Euler(pitch,yaw,roll)),q=new T.Vector3();let minimum=-100;
 for(const cell of g.cells){const p=local(cell);for(const x of [-CELL/2+.01,-CELL/4,0,CELL/4,CELL/2-.01])for(const z of [-CELL/2+.01,-CELL/4,0,CELL/4,CELL/2-.01]){q.set(p.x+x,-.14,p.z+z).applyMatrix4(matrix);minimum=Math.max(minimum,seaLevel(g.raftX+q.x,-g.distance+q.z,g,time)+.075-q.y);}}
 const target=Math.max(minimum,sea+.35+lift*.80-g.flood*.003+Math.min(3,g.floats.length)*.055),y=previousY===null?target:Math.max(minimum,previousY+(target-previousY)*(1-Math.exp(-dt*6)));
 return {y,pitch,yaw,roll,minimum};
}
