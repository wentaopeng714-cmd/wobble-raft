export const CELL=1.45;
export const HARBOR={x:-4,z:-98,r:5};
export const HOME={x:-.725,z:.725};
export const STORAGE={minX:.04,maxX:1.41,minZ:-1.41,maxZ:-.04};
export const local=p=>({x:(p.x-.5)*CELL,z:(p.z-.5)*CELL});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const same=(a,b)=>a.x===b.x&&a.z===b.z&&a.dx===b.dx&&a.dz===b.dz;
export function outerSlots(cells){const out=[];for(const c of cells)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]])if(!cells.some(q=>q.x===c.x+dx&&q.z===c.z+dz))out.push({...c,dx,dz});return out;}
export function remountFloats(cells,floats){
 const slots=outerSlots(cells),used=[];
 for(const f of floats){if(slots.some(p=>same(p,f))&&!used.some(p=>same(p,f))){used.push({...f,stowed:false});continue;}
  const candidates=slots.filter(p=>!used.some(q=>same(p,q))).sort((a,b)=>(Math.abs(a.x-f.x)+Math.abs(a.z-f.z)+(a.dx===f.dx&&a.dz===f.dz?0:1))-(Math.abs(b.x-f.x)+Math.abs(b.z-f.z)+(b.dx===f.dx&&b.dz===f.dz?0:1)));
  used.push(candidates[0]?{...candidates[0],stowed:false}:{...cells[used.filter(p=>p.stowed).length%cells.length],dx:0,dz:0,stowed:true});
 }return used;
}
export function floatPosition(p){const c=local(p);return p.stowed?{x:c.x,z:c.z,y:-.82,yaw:0}:{x:c.x+p.dx*1.13,z:c.z+p.dz*1.13,y:-.24,yaw:p.dx?Math.PI/2:0};}
export function hullRects(g){return [...g.cells.map(p=>{const c=local(p);return {minX:c.x-CELL/2,maxX:c.x+CELL/2,minZ:c.z-CELL/2,maxZ:c.z+CELL/2};}),...g.floats.filter(p=>!p.stowed).map(p=>{const c=floatPosition(p),rx=p.dx?.37:.56,rz=p.dz?.37:.56;return {minX:c.x-rx,maxX:c.x+rx,minZ:c.z-rz,maxZ:c.z+rz};})];}
export const debrisRadius=r=>r.kind==='wood'?.70:.55;
function mergedIntervals(intervals){const out=[];for(const a of intervals.sort((a,b)=>a[0]-b[0])){const last=out[out.length-1];if(last&&a[0]<=last[1])last[1]=Math.max(last[1],a[1]);else out.push([...a]);}return out;}
export function pushOutsideHull(g,r,rects=hullRects(g)){
 const z=r.z+g.distance,rad=debrisRadius(r)+.05,intervals=rects.filter(a=>z>a.minZ-rad&&z<a.maxZ+rad).map(a=>[a.minX-rad+g.raftX,a.maxX+rad+g.raftX]);
 for(const [a,b]of mergedIntervals(intervals))if(r.x>a&&r.x<b)r.x=r.x-(a+.01)<b+.01-r.x?a-.01:b+.01;
 for(const rock of g.hazards||[]){const dz=Math.abs(r.z-rock.z),rr=rock.r*1.2+rad;if(dz<rr){const dx=Math.sqrt(rr*rr-dz*dz);if(Math.abs(r.x-rock.x)<dx)r.x=rock.x+(r.x<rock.x?-1:1)*(dx+.02);}}
}
export function separateSupplies(g){const rects=hullRects(g),placed=[];for(const r of g.resources){pushOutsideHull(g,r,rects);const side=r.x<g.raftX?-1:1;for(let pass=0;pass<=placed.length;pass++){let touched=false;for(const p of placed){const need=debrisRadius(r)+debrisRadius(p)+.04,dz=Math.abs(r.z-p.z);if(dz>=need)continue;const dx=Math.sqrt(need*need-dz*dz);if(Math.abs(r.x-p.x)<dx){r.x=p.x+side*(dx+.01);pushOutsideHull(g,r,rects);touched=true;}}if(!touched)break;}placed.push(r);}}
export function resolveRocks(g){
 for(const rock of g.hazards){const rad=rock.r*1.2+.10,z=rock.z+g.distance,intervals=[];
  for(const a of hullRects(g)){const dz=Math.max(a.minZ-z,0,z-a.maxZ);if(dz>=rad)continue;const reach=Math.sqrt(rad*rad-dz*dz);intervals.push([rock.x-a.maxX-reach,rock.x-a.minX+reach]);}
  for(const [a,b]of mergedIntervals(intervals))if(g.raftX>a&&g.raftX<b){const left=a-.01,right=b+.01;g.raftX=Math.abs(left-g.raftX)<Math.abs(right-g.raftX)?left:right;g.lateral=0;if(!g.rocksHit.has(rock.id)){g.rocksHit.add(rock.id);const damage=12*(1-Math.min(.65,g.floats.length*.18));g.health=Math.max(0,g.health-damage);g.flood=clamp(g.flood+12,0,100);g.event('collision',{damage:Math.round(damage)});}break;}
 }
}
export function salvageEndpoint(g,source){
 const s={x:source.x-g.raftX,z:source.z+g.distance},rad=debrisRadius(source)+.16;let best=null;
 for(const a of hullRects(g)){const p={x:clamp(s.x,a.minX,a.maxX),z:clamp(s.z,a.minZ,a.maxZ)},d=Math.hypot(s.x-p.x,s.z-p.z);if(!best||d<best.d)best={...p,d};}
 if(!best||best.d<.001)return {...s};const offset=Math.min(rad,best.d);return {x:best.x+(s.x-best.x)/best.d*offset,z:best.z+(s.z-best.z)/best.d*offset};
}
export function cargoLayout(g){
 const out=[];for(let i=0;i<Math.min(g.wood,14);i++)out.push({kind:'wood',x:.40,y:.105+Math.floor(i/2)*.085,z:-1.10+(i%2)*.21,w:.62,h:.07,d:.15});
 for(let i=0;i<Math.min(g.barrels,3);i++)out.push({kind:'barrel',x:1.10,y:.23,z:-1.10+i*.34,w:.28,h:.34,d:.28});
 for(let i=0;i<Math.min(g.cloth,3);i++)out.push({kind:'cloth',x:.40,y:.11+i*.10,z:-.40,w:.52,h:.09,d:.24});return out;
}
export function walkSafe(g,p,r=.42){
 const supported=q=>g.cells.some(c=>{const a=local(c);return Math.abs(q.x-a.x)<=CELL/2+1e-6&&Math.abs(q.z-a.z)<=CELL/2+1e-6;});
 for(let i=0;i<8;i++){const t=i*Math.PI/4;if(!supported({x:p.x+Math.cos(t)*r,z:p.z+Math.sin(t)*r}))return false;}
 if(p.x>STORAGE.minX-r&&p.x<STORAGE.maxX+r&&p.z>STORAGE.minZ-r&&p.z<STORAGE.maxZ+r)return false;
 for(const f of g.fixtures){const c=local(f),x=p.x-c.x,z=p.z-c.z;if(f.mode==='sail'&&Math.abs(x)<.70+r&&Math.abs(z)<.20+r)return false;
  if(f.mode==='roof'){for(const sx of [-.65,.65])for(const sz of [-.65,.65])if(Math.hypot(x-sx,z-sz)<r+.06)return false;if(Math.abs(x)<.66+r&&Math.abs(z+.66)<.04+r)return false;}}
 return true;
}
export function deckPath(g,start,goal){
 const step=CELL/6,cells=g.cells.map(local),minX=Math.min(...cells.map(c=>c.x)),maxX=Math.max(...cells.map(c=>c.x)),minZ=Math.min(...cells.map(c=>c.z)),maxZ=Math.max(...cells.map(c=>c.z)),nodes=[];const byId=new Map();
 for(let ix=-3;ix<=Math.round((maxX-minX)/step)+3;ix++)for(let iz=-3;iz<=Math.round((maxZ-minZ)/step)+3;iz++){const p={x:minX+ix*step,z:minZ+iz*step,ix,iz};if(walkSafe(g,p)){nodes.push(p);byId.set(ix+','+iz,p);}}
 if(!nodes.length)return [];const near=q=>nodes.reduce((a,b)=>Math.hypot(b.x-q.x,b.z-q.z)<Math.hypot(a.x-q.x,a.z-q.z)?b:a),a=near(start),b=near(goal);if(Math.hypot(b.x-goal.x,b.z-goal.z)>.22)return [];
 const id=n=>n.ix+','+n.iz,queue=[a],prev=new Map([[id(a),null]]);while(queue.length){const n=queue.shift();if(n===b){const path=[];let q=b;while(q){path.unshift({x:q.x,z:q.z});q=prev.get(id(q));}if(walkSafe(g,goal))path.push({...goal});return path;}
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const q=byId.get((n.ix+dx)+','+(n.iz+dz));if(q&&!prev.has(id(q))&&walkSafe(g,{x:(n.x+q.x)/2,z:(n.z+q.z)/2})){prev.set(id(q),n);queue.push(q);}}}
 return [];
}
function segmentHits(a,b,box){let low=0,high=1;for(const [axis,min,max]of [['x',box.minX,box.maxX],['z',box.minZ,box.maxZ]]){const delta=b[axis]-a[axis];if(Math.abs(delta)<1e-8){if(a[axis]<=min||a[axis]>=max)return false;}else{let t0=(min-a[axis])/delta,t1=(max-a[axis])/delta;if(t0>t1)[t0,t1]=[t1,t0];low=Math.max(low,t0);high=Math.min(high,t1);if(low>=high)return false;}}return high>1e-5&&low<.99999;}
export function airObstacles(g){return g.fixtures.map(f=>{const c=local(f),rx=f.mode==='roof'?.86:.84,rz=f.mode==='roof'?.86:.28;return {minX:c.x-rx,maxX:c.x+rx,minZ:c.z-rz,maxZ:c.z+rz};});}
export function airPath(g,start,end,roof=null){
 const boxes=airObstacles(g),inside=(p,a)=>p.x>a.minX&&p.x<a.maxX&&p.z>a.minZ&&p.z<a.maxZ;
 let door=start;const useDoor=roof&&boxes.some(a=>inside(start,a));if(useDoor){const c=local(roof);door={x:c.x,z:c.z+.93};}
 const nodes=[door,end];for(const a of boxes)for(const x of [a.minX-.025,a.maxX+.025])for(const z of [a.minZ-.025,a.maxZ+.025]){const p={x,z};if(!boxes.some(b=>inside(p,b)))nodes.push(p);}
 const dist=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),seen=new Set();dist[0]=0;
 for(let count=0;count<nodes.length;count++){let best=-1;for(let i=0;i<nodes.length;i++)if(!seen.has(i)&&(best<0||dist[i]<dist[best]))best=i;if(best<0||!Number.isFinite(dist[best]))break;if(best===1)break;seen.add(best);
  for(let i=0;i<nodes.length;i++)if(!seen.has(i)&&!boxes.some(a=>segmentHits(nodes[best],nodes[i],a))){const d=dist[best]+Math.hypot(nodes[i].x-nodes[best].x,nodes[i].z-nodes[best].z);if(d<dist[i]){dist[i]=d;previous[i]=best;}}}
 if(!Number.isFinite(dist[1]))return [start,door,end];const out=[];let i=1;while(i>=0){out.unshift(nodes[i]);i=previous[i];}if(useDoor)out.unshift(start);return out;
}
export function polylineAt(points,t){if(points.length<2)return points[0];const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.z-points[i].z)),total=lengths.reduce((a,b)=>a+b,0);let distance=clamp(t,0,1)*total;for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const f=lengths[i]>.0001?clamp(distance/lengths[i],0,1):1;return {x:points[i].x+(points[i+1].x-points[i].x)*f,z:points[i].z+(points[i+1].z-points[i].z)*f};}distance-=lengths[i];}return points[points.length-1];}
