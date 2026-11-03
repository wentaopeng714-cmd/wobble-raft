import {T,group,box,roundBox,sphere as smoothSphere,cyl,rod,material,lerp,clamp} from './shared/core.js?v=raft6b';
function sphere(p,r,c,x=0,y=0,z=0,sx=1,sy=1,sz=1){const m=new T.Mesh(new T.IcosahedronGeometry(r,0),material(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;p.add(m);return m;}
const ease=(a,b,dt)=>lerp(a,b,1-Math.exp(-dt*11));
export function survivor(parent){
 const root=group(parent),hips=group(root,0,.82,0),body=group(hips,0,.38,0);
 roundBox(body,.61,.65,.37,.08,0x1d9fa8,0,0,0);
 for(const side of [-1,1]){roundBox(body,.23,.56,.13,.045,0xfba041,side*.18,0,.23);box(body,.025,.55,.02,0xf6c177,side*.18,.01,.305);}
 box(body,.48,.08,.075,0x3a4050,0,-.09,.31);box(body,.10,.11,.08,0xdad6bb,0,-.09,.36);
 const head=group(body,0,.65,0);roundBox(head,.85,.77,.62,.12,0xf3c894,0,0,0);
 sphere(head,.085,0xefbd88,-.455,-.035,0);sphere(head,.085,0xefbd88,.455,-.035,0);
 roundBox(head,.88,.27,.67,.09,0x49313c,0,.29,-.025);
 for(const [x,y,rot] of [[-.25,.22,-.4],[-.08,.26,-.3],[.09,.30,.4],[.26,.31,.6]]){const lock=roundBox(head,.26,.22,.15,.04,0x49313c,x,y,.25);lock.rotation.z=rot;}
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=384;const ctx=canvas.getContext('2d'),texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const face=new T.Mesh(new T.PlaneGeometry(.80,.58),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));face.position.set(0,-.035,.347);head.add(face);
 const arms=[],legs=[];
 for(const side of [-1,1]){
   const shoulder=group(body,side*.36,.24,0);sphere(shoulder,.11,0x1d9fa8);rod(shoulder,[0,-.03,0],[0,-.27,0],.075,0xf3c894);
   const elbow=group(shoulder,0,-.28,0);sphere(elbow,.077,0xf3c894);rod(elbow,[0,0,0],[0,-.27,0],.065,0xf3c894);
   const hand=group(elbow,0,-.29,0);sphere(hand,.09,0xf3c894,0,0,0,.85,1,.8);arms.push({shoulder,elbow,hand,side});
   const thigh=group(hips,side*.18,0,0);roundBox(thigh,.26,.34,.29,.035,0x28647e,0,-.15,0);
   const knee=group(thigh,0,-.34,0);sphere(knee,.072,0xf3c894);rod(knee,[0,0,0],[0,-.31,0],.07,0xf3c894);
   const foot=group(knee,0,-.32,0);roundBox(foot,.27,.16,.40,.055,0x594442,0,-.035,.075);box(foot,.28,.035,.41,0x283346,0,-.126,.075);legs.push({thigh,knee,foot,side});
 }
 const grip=group(arms[1].hand);rod(grip,[0,0,0],[0,0,.47],.028,0x94623b);const hook=new T.Mesh(new T.TorusGeometry(.09,.025,6,16,Math.PI*1.5),material(0xc1d8df));hook.position.z=.51;hook.rotation.x=Math.PI/2;grip.add(hook);
 const hammer=group(arms[1].hand);rod(hammer,[0,0,0],[0,0,.40],.035,0x855337);roundBox(hammer,.30,.16,.20,.035,0x9cb5c6,0,0,.42);hammer.visible=false;
 const bench=group(root,0,0,.62);roundBox(bench,.78,.09,.43,.025,0xc59259,0,.65,0);for(const side of [-1,1])box(bench,.09,.60,.12,0x8c6746,side*.29,.30,0);bench.visible=false;
 const bucket=group(arms[1].hand);const cup=cyl(bucket,.16,.23,0xdba268,0,0,.13,.21,true);cup.rotation.x=.3;bucket.visible=false;
 let faceKey='',faceClock=0;
 function paint(expression,blink,look){
   const stamp=expression+':'+blink+':'+Math.round(look*3);if(stamp===faceKey)return;faceKey=stamp;ctx.clearRect(0,0,512,384);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=12;
   const worried=['worried','brace','hurt'].includes(expression),happy=['happy','win'].includes(expression),closed=blink||expression==='brace';
   for(const side of [-1,1]){const x=256+side*98;
     ctx.fillStyle='#ec9b7e';ctx.globalAlpha=.50;ctx.beginPath();ctx.ellipse(x+side*25,254,30,14,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
     ctx.strokeStyle='#392e39';ctx.fillStyle='#fffcdf';
     if(closed){ctx.beginPath();ctx.moveTo(x-28,183);ctx.quadraticCurveTo(x,expression==='brace'?172:195,x+28,183);ctx.stroke();}
     else{ctx.beginPath();ctx.ellipse(x,183,33,worried?47:39,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#253d4c';ctx.beginPath();ctx.ellipse(x+look*8,187,17,worried?25:23,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+look*8-5,176,7,0,Math.PI*2);ctx.fill();}
     ctx.strokeStyle='#573c40';ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(x-29,132+(worried?-side*10:happy?4:0));ctx.quadraticCurveTo(x,111+(happy?-10:0),x+29,132+(worried?side*10:happy?4:0));ctx.stroke();
   }
   ctx.fillStyle='#4a303a';ctx.strokeStyle='#4a303a';ctx.lineWidth=13;ctx.beginPath();
   if(expression==='hurt'||expression==='worried'){ctx.ellipse(256,283,19,expression==='hurt'?28:21,0,0,Math.PI*2);ctx.fill();}
   else if(happy){ctx.moveTo(206,265);ctx.quadraticCurveTo(256,287,306,265);ctx.quadraticCurveTo(292,334,256,326);ctx.quadraticCurveTo(220,330,206,265);ctx.fill();ctx.fillStyle='#fff8de';ctx.fillRect(218,273,77,15);ctx.fillStyle='#ed8d83';ctx.beginPath();ctx.ellipse(256,316,22,9,0,0,Math.PI*2);ctx.fill();}
   else if(expression==='brace'){ctx.moveTo(226,282);ctx.lineTo(286,282);ctx.stroke();}
   else{ctx.moveTo(225,270);ctx.quadraticCurveTo(256,300,287,270);ctx.stroke();}
   texture.needsUpdate=true;
 }
 function pose(dt,{time=0,state='idle',phase=0,roll=0,look=0,wet=0,confined=false}={}){
   faceClock+=dt;const blink=faceClock%4.2>4.04;const expression=state==='win'?'win':state==='hurt'?'hurt':state==='brace'?'brace':state==='wave'||state==='wet'?'worried':state==='happy'||state==='build'?'happy':'neutral';paint(expression,blink,look);
   // Feet stay planted. Hip compression is balanced by thigh and knee flexion.
   const crouch=state==='brace'?.15:state==='bail'?.09:state==='build'?.05:0;
   hips.position.y=ease(hips.position.y,.82-crouch,dt);const bend=Math.acos(clamp((.66-crouch)/.66,0,1)),walk=state==='walk'?Math.sin(time*9):0;
   legs.forEach(l=>{l.thigh.rotation.x=ease(l.thigh.rotation.x,-bend+walk*l.side*.34,dt);l.knee.rotation.x=ease(l.knee.rotation.x,bend*2+Math.max(0,-walk*l.side)*.40,dt);l.foot.rotation.x=-l.thigh.rotation.x-l.knee.rotation.x;l.thigh.rotation.z=ease(l.thigh.rotation.z,l.side*(state==='brace'?.10:.015),dt);});
   body.position.y=.38+Math.sin(time*1.5)*.007;body.rotation.z=ease(body.rotation.z,clamp(-roll*.55,confined?-.035:-.3,confined?.035:.3),dt);body.rotation.x=ease(body.rotation.x,state==='brace'?.12:state==='bail'?.16:state==='build'?.10:0,dt);
   head.rotation.y=ease(head.rotation.y,look*.28,dt);head.rotation.z=ease(head.rotation.z,-roll*.20,dt);head.rotation.x=ease(head.rotation.x,state==='build'||state==='bail'?.12:state==='wave'?-.05:0,dt);
   arms.forEach((arm,i)=>{
     let sx=.05,sz=-arm.side*.10,ex=-.16;
     if(state==='cast'){const p=clamp(phase,0,1);sx=i===1?(p<.28?.75:-1.05):-.35;ex=p<.28?-1.6:p<.58?-.15:-1.0+Math.sin(p*20)*.16;sz=-arm.side*.13;}
     if(state==='build'){sx=i===1?-.65-Math.sin(phase*18)*.28:-.45;ex=i===1?-.8+Math.sin(phase*18)*.35:-.65;}
     if(state==='brace'){sx=-.35;ex=-.85;sz=-arm.side*.28;}
     if(state==='bail'){const p=time*5;sx=-.45-Math.sin(p)*.35;ex=-.8+Math.cos(p)*.35;sz=-arm.side*.12;}
     if(state==='win'||state==='happy'){sx=state==='win'?-.25:-.15;sz=arm.side*(state==='win'?2.25:.30);ex=state==='win'?-.45+Math.sin(time*6+i)*.10:-.65;}
     if(confined){if(state==='bail'||state==='cast')sz=0;if(state==='win')sz=arm.side*.35;}
     arm.shoulder.rotation.x=ease(arm.shoulder.rotation.x,sx,dt);arm.shoulder.rotation.z=ease(arm.shoulder.rotation.z,sz,dt);arm.elbow.rotation.x=ease(arm.elbow.rotation.x,ex,dt);
   });
   grip.visible=state==='cast';hammer.visible=bench.visible=state==='build';bucket.visible=state==='bail';bucket.scale.setScalar(confined?.70:1);if(state==='build'){root.updateMatrixWorld(true);const hand=root.worldToLocal(arms[1].hand.getWorldPosition(new T.Vector3()));const contact=Math.asin(clamp((hand.y-.86)/.42,-.9,.9)),swing=lerp(-.22,contact,(1+Math.sin(phase*18))/2);hammer.rotation.x=swing-arms[1].shoulder.rotation.x-arms[1].elbow.rotation.x-body.rotation.x;}
 }
 paint('neutral',false,0);return {root,hips,body,head,arms,legs,grip,hammer,bucket,bench,pose};
}
