import {remountFloats,separateSupplies,resolveRocks} from './spatial.js?v=raft6b';
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const key = (x, z) => `${x},${z}`;
export const ROUTE = 82;
export const BUILD = {
  deck: {wood:3, barrels:0, cloth:0},
  float: {wood:1, barrels:1, cloth:0},
  sail: {wood:3, barrels:0, cloth:1},
  roof: {wood:3, barrels:0, cloth:1},
};
export class RaftGame {
  constructor(saved=null) {
    Object.assign(this, {time:0,distance:0,raftX:0,lateral:0,wood:3,barrels:0,cloth:0,
      cells:[{x:0,z:0},{x:1,z:0},{x:0,z:1},{x:1,z:1}],floats:[],fixtures:[],
      health:74,flood:12,roll:-.11,rollV:0,pitch:0,speed:0,events:[],resources:[],
      hook:null,nextId:0,spawnTimer:0,launched:false,practicing:false,braced:false,bailing:false,done:false,lost:false,
      repaired:0,survived:0,collected:0,built:{deck:0,float:0,sail:0,roof:0},wavePassed:new Set(),rocksHit:new Set()});
    if(saved?.version===3) {
      for(const k of ['time','distance','raftX','wood','barrels','cloth','health','flood','repaired','survived','collected'])
        if(Number.isFinite(saved[k])) this[k]=saved[k];
      for(const k of ['cells','floats','fixtures']) if(Array.isArray(saved[k])&&saved[k].length<=24) this[k]=saved[k].map(p=>({...p}));
      this.launched=saved.launched??(saved.built?.sail>0);this.built={...this.built,...saved.built};this.wavePassed=new Set(saved.wavePassed||[]);this.rocksHit=new Set(saved.rocksHit||[]);
      this.done=!!saved.done;this.lost=!!saved.lost;this.distance=clamp(this.distance,0,ROUTE);this.flood=clamp(this.flood,0,100);this.health=clamp(this.health,0,100);
    }
    this.hazards=[{id:0,x:-2.8,z:-24,r:.95},{id:1,x:2.8,z:-47,r:1.1},{id:2,x:-2.7,z:-67,r:1}];
    this.floats=remountFloats(this.cells,this.floats);for(let i=0;i<5;i++)this.spawn(i);separateSupplies(this);
  }
  get progress(){return this.distance/ROUTE;}
  get capacity(){return 7+Math.max(0,this.cells.length-4)*5;}
  get load(){return this.wood+this.barrels*2+this.cloth;}
  get lowSide(){return this.roll<0?'right':'left';}
  get stability(){return clamp(1-Math.abs(this.roll)/.36,0,1);}
  get storm(){if(this.practicing||this.distance>=ROUTE)return 0;const t=this.time%46;return this.time>24&&t>28?Math.sin((t-28)/18*Math.PI):0;}
  get raining(){return !this.practicing&&this.distance<ROUTE&&this.time>42&&this.time%72>34;}
  get inventoryMass(){return Math.min(this.load,18)*.014;}
  get balanceTarget(){const deck=this.cells.reduce((n,p)=>n+p.x-.5,0)/this.cells.length;const lift=this.floats.reduce((n,p)=>n+(p.x-.5+p.dx*.7)*.075,0);return clamp(-.06-this.inventoryMass-deck*.045+lift,-.27,.27);}
  get waveProtection(){return Math.min(.80,this.floats.length*.20+(this.braced?.30:0));}
  get sailOpen(){return this.built.sail>0&&!(this.braced&&this.storm>.2);}
  get travelSpeed(){return (.33+(this.sailOpen?.30:0))*(1-this.flood*.006)*(0.87+this.stability*.13);}
  get readyToDock(){return this.distance>=ROUTE&&!this.done&&!this.lost;}
  get occupied(){return this.fixtures.map(p=>key(p.x,p.z));}
  event(type,data={}){this.events.push({type,...data});}
  toJSON(){const out={version:3};for(const k of ['time','distance','raftX','wood','barrels','cloth','health','flood','cells','floats','fixtures','built','repaired','survived','collected','done','lost','launched'])out[k]=this[k];out.wavePassed=[...this.wavePassed];out.rocksHit=[...this.rocksHit];return out;}
  hasCell(x,z){return this.cells.some(p=>p.x===x&&p.z===z);}
  choices(mode){
    if(mode==='deck') {if(this.cells.length>=12)return [];const out=[],seen=new Set();for(const c of this.cells)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){const x=c.x+dx,z=c.z+dz,k=key(x,z);if(this.hasCell(x,z)||Math.abs(x)>3||Math.abs(z)>3||seen.has(k))continue;seen.add(k);out.push({x,z});}return out;}
    if(mode==='float'){const out=[];for(const c of this.cells)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]])if(!this.hasCell(c.x+dx,c.z+dz)&&!this.floats.some(p=>p.x===c.x&&p.z===c.z&&p.dx===dx&&p.dz===dz))out.push({...c,dx,dz});return out;}
    if(!['sail','roof'].includes(mode)||this.built[mode]>=1)return [];
    return this.cells.filter(c=>!(c.x>=0&&c.x<=1&&c.z>=0&&c.z<=1)&&!this.occupied.includes(key(c.x,c.z))).map(c=>({...c}));
  }
  canBuild(mode){const c=BUILD[mode];return !!c&&!this.hook&&!this.done&&!this.lost&&this.choices(mode).length>0&&this.wood>=c.wood&&this.barrels>=c.barrels&&this.cloth>=c.cloth;}
  build(mode,p){if(!this.canBuild(mode)||!this.choices(mode).some(q=>q.x===p.x&&q.z===p.z&&(mode!=='float'||q.dx===p.dx&&q.dz===p.dz)))return false;
    const before={capacity:this.capacity,protection:this.waveProtection,speed:this.travelSpeed};const c=BUILD[mode];this.wood-=c.wood;this.barrels-=c.barrels;this.cloth-=c.cloth;
    if(mode==='deck'){this.cells.push({...p});this.floats=remountFloats(this.cells,this.floats);}else if(mode==='float')this.floats.push({...p});else this.fixtures.push({...p,mode});this.built[mode]++;
    separateSupplies(this);this.event('build',{mode,p,before,after:{capacity:this.capacity,protection:this.waveProtection,speed:this.travelSpeed}});return true;
  }
  spawn(index=null){const i=index??this.nextId,kind=i%3===1?'barrel':'wood';this.resources.push({id:this.nextId++,kind,x:index===0?2.3:Math.sin(i*2.4)*3.1,z:-this.distance-(index===0?.8:index!==null?2+(i%3)*2:10+(i%3)*2),phase:i*.7,life:0});}
  loot(kind){return kind==='barrel'?{wood:0,barrels:1,cloth:1}:{wood:2,barrels:0,cloth:0};}
  canCollect(r){if(!r||this.hook||this.done||this.lost)return false;const cost=r.kind==='barrel'?3:2;return this.load+cost<=this.capacity&&Math.hypot(r.x-this.raftX,r.z+this.distance)<11;}
  collect(id){const r=this.resources.find(p=>p.id===id);if(!this.canCollect(r))return false;this.hook={...r,t:0,duration:1.65};this.resources=this.resources.filter(p=>p!==r);this.event('hook',{resource:r});return true;}
  discard(){if(this.done||this.lost)return false;const kind=this.barrels>0?'barrels':this.cloth>0?'cloth':this.wood>0?'wood':null;if(!kind)return false;this[kind]--;this.event('discard',{kind});return true;}
  repair(){if(this.wood<1||this.health>=99||this.done||this.lost)return false;this.wood--;const before=this.health;this.health=Math.min(100,this.health+26);this.repaired++;this.event('repair',{amount:Math.round(this.health-before)});return true;}
  dock(){if(!this.readyToDock)return false;this.done=true;this.event('complete');return true;}
  update(dt,input=false){
    if(this.done||this.lost||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,1/30);const {brace=false,steer=0,practice=false}=typeof input==='boolean'?{brace:input}:input;this.practicing=practice;
    if(this.readyToDock){this.speed=0;this.braced=this.bailing=false;return;}
    if(!practice)this.time+=dt;this.braced=brace&&!practice;this.bailing=brace&&!practice&&this.storm<.25&&this.flood>.05;
    this.lateral+=(clamp(practice?0:steer,-1,1)*1.45-this.lateral)*Math.min(1,dt*5);this.raftX=clamp(this.raftX+this.lateral*dt,-4.4,4.4);
    if(this.hook&&!brace){this.hook.t+=dt;if(this.hook.t>=this.hook.duration){const loot=this.loot(this.hook.kind);this.wood+=loot.wood;this.barrels+=loot.barrels;this.cloth+=loot.cloth;this.collected++;this.event('collected',{kind:this.hook.kind,loot});this.hook=null;}}
    this.spawnTimer+=dt;if(this.spawnTimer>=4.2&&this.resources.length<12){this.spawnTimer=0;this.spawn();}
    if(practice){separateSupplies(this);this.speed=0;return;}
    this.resources=this.resources.filter(r=>{r.z+=dt*.045;r.life+=dt;return r.z< -this.distance+5.5;});
    const rain=this.raining?(this.built.roof?.07:.60):0,leak=(100-this.health)*.0035;
    const priorFlood=this.flood;this.flood=clamp(this.flood+(rain+leak-(this.bailing?12:0))*dt,0,100);
    if(this.bailing&&priorFlood>1&&this.flood<=1)this.event('dry');
    if(this.flood>72)this.health=Math.max(0,this.health-(this.flood-72)*.025*dt);
    const target=this.balanceTarget+Math.sin(this.time*1.6)*(.018+this.storm*.095)*(1-Math.min(.75,this.floats.length*.22));
    this.rollV+=((target-this.roll)*(brace?18:11)-this.rollV*(brace?8:4))*dt;this.roll+=this.rollV*dt;
    this.pitch=Math.sin(this.time*1.25)*(.018+this.storm*.05)*(1-Math.min(.6,this.floats.length*.15));
    this.speed=this.travelSpeed;this.distance=Math.min(ROUTE,this.distance+this.speed*dt);
    const cycle=Math.floor(this.time/46);if(this.storm>.82&&!this.wavePassed.has(cycle)){
      this.wavePassed.add(cycle);const protection=this.waveProtection,damage=(18+Math.abs(this.roll)*38)*(1-protection),water=31*(1-protection);
      this.health=Math.max(0,this.health-damage);this.flood=clamp(this.flood+water,0,100);this.survived++;this.event('wave',{damage:Math.round(damage),water:Math.round(water),saved:Math.round(31-water),protected:protection>.25});
    }
    resolveRocks(this);separateSupplies(this);
    if(this.health<=0){this.lost=true;this.event('lost');}
  }
}
