import {T,group,box,roundBox,sphere,cyl,rod,mesh,material,ring,label,asset} from './shared/core.js?v=raft6b';
import {CELL,local,floatPosition,HARBOR} from './spatial.js?v=raft6b';
export {CELL,local};
export {ocean} from './water.js?v=raft6b';
export function survivor(parent){const root=group(parent),body=group(root,0,1.12,0),torso=roundBox(body,.57,.62,.33,.07,0x32a9aa,0,0,0);for(const s of [-1,1])roundBox(body,.18,.56,.12,.04,0xf6a143,s*.19,.02,.22);box(body,.40,.08,.07,0x314456,0,-.06,.30);box(body,.09,.10,.08,0xddd6ba,0,-.06,.35);const head=group(body,0,.61,0);sphere(head,.32,0xf4c78e,0,0,0,1,1.14,.85,true);sphere(head,.33,0x4b3545,0,.18,-.04,1.04,.62,.93,true);for(let i=0;i<5;i++){const hair=mesh(head,new T.ConeGeometry(.14,.29,4),0x4b3545,-.25+i*.12,.29+Math.sin(i)*.025,.13,true);hair.rotation.z=(i-2)*-.22;}for(const s of [-1,1]){sphere(head,.026,0x302b43,s*.115,.01,.27,1,1.4,.5);sphere(head,.035,0xea9a74,s*.20,-.1,.23,1.3,.6,.5);}const mouth=box(head,.11,.025,.022,0x794a4e,0,-.14,.29);const arms=[];for(const s of [-1,1]){const arm=group(body,s*.34,.15,0);rod(arm,[0,0,0],[s*.2,-.28,.05],.09,0xf1bd84);sphere(arm,.095,0xf4c78e,s*.2,-.30,.05,1,1.1,.9);arms.push(arm);}const legs=[];for(const s of [-1,1]){const leg=group(root,s*.17,.80,0);roundBox(leg,.24,.32,.27,.03,0x3c6e94,0,-.11,0);rod(leg,[0,-.2,0],[s*.06,-.47,.04],.07,0xf2bf87);roundBox(leg,.25,.23,.40,.05,0x5a4c50,s*.055,-.57,.10);box(leg,.26,.045,.41,0x293549,s*.055,-.70,.10);legs.push(leg);}const grip=group(arms[1],.20,-.30,.05);rod(grip,[0,0,0],[0,0,.65],.035,0x88603d);const hook=new T.Mesh(new T.TorusGeometry(.10,.023,5,14,Math.PI*1.5),material(0xc8d7dc));hook.position.set(0,0,.68);hook.rotation.x=Math.PI/2;grip.add(hook);const hammer=group(arms[0],-.20,-.30,.05);rod(hammer,[0,0,0],[0,0,.46],.042,0x946240);roundBox(hammer,.36,.18,.20,.035,0xb3c8d7,0,0,.49);hammer.visible=false;return {root,body,head,mouth,arms,legs,grip,hammer};}
export function deck(parent,p){const c=local(p),g=group(parent,c.x,.0,c.z);for(let i=0;i<4;i++){const plank=box(g,CELL-.025,.20,CELL/4-.025,[0xc68b51,0xdeaa65,0xe6b576,0xc88b52][i],0,-.04,(i-1.5)*CELL/4,true);for(const side of [-1,1])sphere(plank,.018,0x7d675a,side*.48,.108,0,1,.5,1);}for(const x of [-.54,.54])box(g,.12,.18,CELL+.06,0x856246,x,-.20,0);return g;}
export function flotation(parent,p){const c=floatPosition(p),g=group(parent,c.x,0,c.z);const barrel=cyl(g,.36,1.06,0x508fd2,0,c.y,0,.36,true);barrel.rotation.z=Math.PI/2;for(const x of [-.36,.36]){const band=cyl(g,.377,.09,0xa0b3ce,x,c.y,0,.377,true);band.rotation.z=Math.PI/2;}sphere(g,.08,0x244264,.535,c.y,0,.3,1,1);for(const x of [-.32,.32])rod(g,[x,c.y+.38,-.32],[x,c.y+.38,.32],.025,0xd1aa67);g.rotation.y=c.yaw;return g;}
export function railing(parent,p){const c=local(p),g=group(parent,c.x+p.dx*.70,0,c.z+p.dz*.70);g.rotation.y=p.dx?Math.PI/2:0;for(const x of [-.58,.58]){roundBox(g,.13,1.05,.14,.025,0x996c44,x,.43,0);for(const y of [.55,.70])cyl(g,.105,.065,0xd7bc80,x,y,0);}rod(g,[-.6,.68,0],[.6,.68,0],.045,0xe1bf7a);rod(g,[-.6,.38,0],[.6,.38,0],.035,0xd5b074);return g;}
export function woodPile(parent){const g=group(parent,1.0,.16,-.45);for(let i=0;i<7;i++){const p=box(g,1.1,.14,.28,i%2?0xe4b175:0xc59259,(i%2)*.05,.10+Math.floor(i/2)*.16,(i%2-.5)*.30,true);p.rotation.y=Math.sin(i)*.12;}for(const x of [-.32,.32])rod(g,[x,.12,-.35],[x,.64,.36],.035,0xddc58b);return g;}
export function resource(parent,r){const g=group(parent,r.x,0,r.z);if(r.kind==='barrel'){const b=cyl(g,.32,.83,0x559ce3,0,0,0,.32,true);b.rotation.z=Math.PI/2;for(const x of [-.27,.27]){const b=cyl(g,.338,.08,0xb4c7da,x,0,0,.338,true);b.rotation.z=Math.PI/2;}}else for(let i=0;i<2;i++){const p=box(g,1.05,.14,.27,i?0xe8be7b:0xd49854,i*.13,i*.12,0,true);p.rotation.y=i*.18;}const glow=ring(g,r.kind==='barrel'?.59:.68,0xa6f4df,0,-.12,0);glow.renderOrder=4;return {root:g,glow};}
export function ghost(parent,mode,p){
 const c=local(p),g=group(parent,c.x,0,c.z);
 if(mode==='deck')deck(g,{x:.5,z:.5});
 else if(mode==='float')flotation(g,{x:.5,z:.5,dx:p.dx,dz:p.dz});
 else fixture(g,{x:.5,z:.5,mode});
 g.traverse(n=>{if(!n.isMesh)return;n.renderOrder=4;n.material=new T.MeshBasicMaterial({color:0x76ffce,transparent:true,opacity:.42,depthWrite:false,side:T.DoubleSide});for(const child of [...n.children])if(child.isMesh)n.remove(child);});
 const pad=ring(g,.76,0x79ffcf,0,.18,0);return {root:g,p,mode,pad,anchor:mode==='float'?g.children[0]:g};
}
export async function islands(world){const near=group(world.root,-8,-.3,-10),sand=cyl(near,6,.45,0xf2d18d,0,0,0,5.3);const far=group(world.root,-6,-.3,-50);cyl(far,4.5,.65,0xf1d49d,0,0,0,4.1);const results=await Promise.allSettled([asset('rocks-sand-a',near,2.3,-1,.2,-.5),asset('palm-detailed-bend',near,4.5,2,.15,-1.5),asset('palm-detailed-bend',far,4.0,2,.25,-2.0),asset('rocks-sand-a',far,2.2,-2,.2,-1),asset('tower-complete-small',far,2,-.8,.3,-1)]);for(const r of results)if(r.status==='rejected')console.warn('Optional island prop unavailable',r.reason);const tower=group(far,3.2,.4,-2);tower.scale.setScalar(.32);label(far,'LIGHTHOUSE',3.2,1.0,-1.8,'#3c647a','#fff0cb',1.8);for(let i=0;i<4;i++)box(far,1.05,.15,.33,0xc68b51,4.15,.55,-2+i*.32,true);cyl(tower,.76,5.2,0xfff0d1,0,2.6,0,.58,true);for(const y of [1.7,3.4])cyl(tower,.75,.7,0xe07861,0,y,0,.65);cyl(tower,.9,.17,0x4b607f,0,5.25,0,.9);cyl(tower,.5,.7,0xffdf7d,0,5.6,0,.5,true);mesh(tower,new T.ConeGeometry(.85,.7,8),0xe87d5b,0,6.2,0,true);return {near,far,tower};}
export function incomingSwell(world){
 const geo=new T.PlaneGeometry(13,3.8,40,24);geo.rotateX(-Math.PI/2);const uniforms={power:{value:0},time:{value:0}};
 const mat=new T.ShaderMaterial({uniforms,transparent:true,side:T.DoubleSide,depthWrite:false,
 vertexShader:`uniform float power;uniform float time;varying float crest;varying float sideFade;varying vec3 wp;void main(){vec3 p=position;sideFade=1.-smoothstep(4.2,6.5,abs(p.x));float t=max(0.,cos(p.z/1.9*1.570796));crest=pow(t,3.);p.y=crest*(.6+power*.9)*sideFade-.42;p.z+=sin(p.x*.8+time)*.20;wp=(modelMatrix*vec4(p,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);}`,
 fragmentShader:`uniform float time;varying float crest;varying float sideFade;varying vec3 wp;void main(){if(crest<.025||sideFade<.01)discard;vec3 n=normalize(cross(dFdx(wp),dFdy(wp)));if(n.y<0.)n=-n;vec3 v=normalize(cameraPosition-wp);float shine=pow(max(dot(n,normalize(v+normalize(vec3(-.42,.82,-.58)))),0.),48.);vec3 col=mix(vec3(.018,.32,.43),vec3(.08,.58,.62),pow(crest,.65));col+=vec3(.54,.74,.77)*shine*.20;float breakup=.5+.27*sin(wp.x*9.+sin(wp.z*11.)+time*2.)+.23*sin(wp.x*17.-time*1.8);float foam=smoothstep(.90,.995,crest)*smoothstep(.20,.72,breakup);col=mix(col,vec3(.87,.96,.92),foam*.83);gl_FragColor=vec4(col,smoothstep(.025,.25,crest)*.87*sideFade);}`});
 const mesh=new T.Mesh(geo,mat);mesh.frustumCulled=false;mesh.renderOrder=3;world.root.add(mesh);mesh.visible=false;return {mesh,uniforms};
}

export function fixture(parent,p){
 const c=local(p),g=group(parent,c.x,0,c.z),cloths=[];
 if(p.mode==='sail'){
   rod(g,[0,.10,0],[0,2.9,0],.055,0x9b6a42);rod(g,[-.64,2.65,0],[.64,2.65,0],.035,0xbd9a63);
   const geo=new T.PlaneGeometry(1.25,1.8,8,8);geo.translate(0,-.9,0);const sail=new T.Mesh(geo,new T.MeshToonMaterial({color:0xfff0bd,side:T.DoubleSide}));sail.position.set(0,2.62,0);sail.castShadow=true;g.add(sail);cloths.push(sail);
   rod(g,[-.59,2.6,0],[-.59,.9,.1],.016,0xcaa16b);rod(g,[.59,2.6,0],[.59,.9,.1],.016,0xcaa16b);
   const band=box(g,1.24,.24,.025,0xe88751,0,1.69,.12);cloths.push(band);
 }else{
   for(const x of [-.65,.65])for(const z of [-.65,.65])rod(g,[x,.08,z],[x,2.52,z],.045,0xa57442);
   // Open front edge lets the player see the occupant under the shelter.
   const roof=box(g,1.52,.10,1.35,0xeaa05a,0,2.56,-.1,true);roof.rotation.x=.10;
   for(const x of [-.49,0,.49])box(g,.23,.025,1.35,0xffd98b,x,2.63,-.1);
   rod(g,[-.65,1.85,-.66],[.65,1.85,-.66],.035,0xa57442);
 }
 return {root:g,cloths,p};
}
export function seaCamera(world){
 world.camera=new T.PerspectiveCamera(54,1,.1,240);world.scene.fog=new T.Fog(0xa5dce7,55,140);
 world.resize=()=>{const r=world.canvas.getBoundingClientRect();world.renderer.setSize(r.width,r.height,false);world.camera.aspect=r.width/r.height;world.camera.fov=r.width/r.height>1.3?48:54;world.camera.updateProjectionMatrix();};
 world.follow=(x,z,dt,snap=false)=>{const target=new T.Vector3(x,.72,z-1.3);world.look.lerp(target,snap?1:1-Math.exp(-dt*3.8));world.camera.position.copy(world.look).add(new T.Vector3(4.8,6.1,10.0));world.camera.lookAt(world.look);world.sun.position.copy(world.look).add(new T.Vector3(-12,22,9));world.sun.target.position.copy(world.look);world.sun.target.updateMatrixWorld();};
 world.resize();
}
export async function seaRoute(world){
 const start=group(world.root,-10,-.3,4);cyl(start,4,.5,0xf2d18d,0,0,0,3.5);
 const end=group(world.root,HARBOR.x,-.3,HARBOR.z);cyl(end,5,.7,0xf2d18d,0,0,0,4.5);
 const tower=group(end,3.2,.5,-.5);tower.scale.setScalar(.72);cyl(tower,.66,4.5,0xffeed1,0,2.25,0,.52,true);for(const y of [1.2,2.7])cyl(tower,.66,.55,0xe57659,0,y,0,.60);cyl(tower,.79,.13,0x405d7e,0,4.55,0);cyl(tower,.44,.6,0xffe27c,0,4.9,0);mesh(tower,new T.ConeGeometry(.77,.65,8),0xd57051,0,5.50,0,true);
 const dockRoot=group(world.root),dockPlanks=[];for(let i=0;i<34;i++)dockPlanks.push(box(dockRoot,1.4,.14,.34,0xbf8752,-.8,.26,-95+i*.34,true));const dock={root:dockRoot,tip:{x:-.8,y:.33,z:-84},setReach(z){this.tip.z=z;const count=Math.max(1,Math.ceil((z+95)/.34));dockPlanks.forEach((p,i)=>{p.visible=i<count;p.position.z=-95+i*.34;});}};
 const assets=await Promise.allSettled([asset('palm-detailed-bend',start,4,0,.2,0),asset('rocks-sand-a',start,1.8,1,.2,1),asset('palm-detailed-bend',end,4,2,.2,-2),asset('rocks-sand-a',end,2.5,-1,.2,0)]);
 assets.filter(r=>r.status==='rejected').forEach(r=>console.warn('Optional island prop',r.reason));
 const clouds=group(world.root);for(let i=0;i<8;i++){const g=group(clouds,(i%2?1:-1)*(14+i*3),8+i%3,-15-i*16);for(let j=0;j<3;j++){const puff=mesh(g,new T.IcosahedronGeometry(1.3,0),0xe1f2ef,j*1.5,Math.sin(j)*.35,0);puff.scale.set(1.5,.45,1);}}
 return {start,end,tower,dock};
}

const flatMaterials=new Map();export function lowPoly(root){root.traverse(n=>{if(!n.isMesh)return;for(const child of [...n.children])if(child.isMesh&&child.material.side===T.BackSide&&child.scale.x>1)n.remove(child);const old=n.material;if(!old?.isMeshToonMaterial||old.flatShading)return;let mat=flatMaterials.get(old.uuid);if(!mat){mat=new T.MeshToonMaterial().copy(old);mat.flatShading=true;mat.onBeforeCompile=old.onBeforeCompile;mat.customProgramCacheKey=()=> 'raft-low-poly-v3';mat.needsUpdate=true;flatMaterials.set(old.uuid,mat);}n.material=mat;});}
