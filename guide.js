import {BUILD,key} from './engine.js?v=raft6b';
export const names={deck:['DECK','甲板'],float:['FLOAT','浮桶'],sail:['SAIL','船帆'],roof:['ROOF','雨棚']};
export function shortages(g,kind){const cost=BUILD[kind];if(!cost)return [];return ['wood','barrels','cloth'].filter(k=>g[k]<cost[k]).map(k=>({kind:k,amount:cost[k]-g[k]}));}
export function recommendedPlace(g,kind){
 const options=g.choices(kind),score=p=>kind==='float'?Math.abs(p.z-.5)+((g.roll<0?p.x:-p.x)<.5?3:0):kind==='deck'?(p.x>1?0:5)+Math.abs(p.z-.5)*2+Math.abs(p.x-1.5)*2:p.z*2-p.x*.25;
 return options.sort((a,b)=>score(a)-score(b))[0]||null;
}
export function samePlace(a,b){return !!a&&!!b&&key(a.x,a.z)===key(b.x,b.z)&&a.dx===b.dx&&a.dz===b.dz;}
export function guideStep(g,mode=null){
 if(g.done||g.lost)return {id:'finished'};
 if(mode)return {id:'place',build:mode};
 if(g.readyToDock)return {id:'land'};
 if(g.hook)return {id:'reel'};
 const gather=kind=>{
  const item=g.resources.filter(r=>r.kind===kind&&g.canCollect(r)).sort((a,b)=>Math.hypot(a.x-g.raftX,a.z+g.distance)-Math.hypot(b.x-g.raftX,b.z+g.distance))[0];
  if(item)return {id:'gather',kind,resource:item};
  const weight=kind==='barrel'?3:2;
  if(g.load+weight>g.capacity){if(g.canBuild('deck'))return {id:'build',build:'deck'};return {id:'drop'};}
  return {id:'wait',kind};
 };
 const obtain=kind=>{const missing=shortages(g,kind);if(missing.length)return {...gather(missing.some(s=>s.kind==='wood')?'wood':'barrel'),for:kind};return {id:'build',build:kind};};
 if(!g.launched){
  if(g.built.deck===0){if(g.collected===0&&g.load+2<=g.capacity)return {...gather('wood'),for:'deck'};return obtain('deck');}
  if(!g.built.sail){if(!g.choices('sail').length)return obtain('deck');return obtain('sail');}
  return {id:'launch'};
 }
 if(g.storm>.25)return {id:'brace'};
 if(g.flood>20)return {id:'bail'};
 if(g.health<55)return g.wood?{id:'patch'}:gather('wood');
 if(!g.built.float)return obtain('float');
 if(!g.built.roof){if(!g.choices('roof').length)return {...obtain('deck'),purpose:'roof'};return obtain('roof');}
 if(g.flood>3)return {id:'bail'};
 return {id:'sail'};
}
