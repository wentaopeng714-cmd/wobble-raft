import {T} from './shared/core.js?v=raft6b';
import {HARBOR} from './spatial.js?v=raft6b';
// A shared wave field keeps the visible surface, floating raft and foam together.
export function surfaceHeight(x,z,time,storm=0){return -.38+Math.sin(x*.48+z*.70-time*1.35)*(.13+storm*.13)+Math.sin(-x*.87+z*.38-time*.94)*.075+Math.sin(x*1.34+z*.91-time*1.8)*.028;}
export function ocean(world){
 const uniforms={time:{value:0},storm:{value:0},boat:{value:new T.Vector2()},bounds:{value:new T.Vector4(-1.45,1.45,-1.45,1.45)}};
 const shader=`
 uniform float time;uniform float storm;
 float wave(vec2 p){return sin(dot(p,vec2(.48,.70))-time*1.35)*(.13+storm*.13)+sin(dot(p,vec2(-.87,.38))-time*.94)*.075+sin(dot(p,vec2(1.34,.91))-time*1.8)*.028;}
 vec2 slope(vec2 p){return cos(dot(p,vec2(.48,.70))-time*1.35)*(.13+storm*.13)*vec2(.48,.70)+cos(dot(p,vec2(-.87,.38))-time*.94)*.075*vec2(-.87,.38)+cos(dot(p,vec2(1.34,.91))-time*1.8)*.028*vec2(1.34,.91);}
 `;
 const mat=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,side:T.FrontSide,
 vertexShader:shader+`varying vec3 wp;void main(){vec3 p=position;vec3 origin=(modelMatrix*vec4(position,1.)).xyz;p.y+=wave(origin.xz);wp=(modelMatrix*vec4(p,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);}`,
 fragmentShader:shader+`
 varying vec3 wp;uniform vec2 boat;uniform vec4 bounds;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 void main(){
   vec2 p=wp.xz;vec2 grad=slope(p);
   // Small travelling ripples break reflections without turning the sea into stripes.
   grad+=vec2(cos(p.x*5.8+p.y*2.2+sin(p.y*2.3+time*.2)-time*2.1),sin(p.x*2.7-p.y*6.4+sin(p.x*1.8-time*.3)+time*1.8))*.035;
   vec3 n=normalize(vec3(-grad.x,1.,-grad.y));
   vec3 view=normalize(cameraPosition-wp);float fresnel=.025+.42*pow(1.-max(dot(n,view),0.),4.);
   float cove=1.-smoothstep(4.,10.,distance(p,vec2(-10.,4.)));float shore=1.-smoothstep(4.5,10.,distance(p,vec2(${HARBOR.x.toFixed(1)},${HARBOR.z.toFixed(1)})));
   float shallow=max(cove,shore);float farFade=smoothstep(15.,95.,distance(cameraPosition.xz,p));
   vec3 deep=mix(vec3(.025,.34,.43),vec3(.015,.22,.35),farFade);
   vec3 color=mix(deep,vec3(.06,.63,.62),shallow*.78);
   color+=vec3(.015,.055,.05)*wave(p);
   vec3 refl=reflect(-view,n);float cloud=noise(refl.xz*5.+vec2(time*.008,0.));
   vec3 sky=mix(vec3(.27,.53,.68),vec3(.74,.86,.88),smoothstep(.20,.85,refl.y));sky=mix(sky,vec3(.85,.92,.90),smoothstep(.66,.83,cloud)*.23);
   color=mix(color,sky,fresnel);
   vec3 sun=normalize(vec3(-.42,.82,-.58));float spec=max(dot(n,normalize(sun+view)),0.);
   float glint=pow(spec,110.)*.30+pow(spec,24.)*.065;color+=vec3(.98,.92,.73)*glint*(1.-storm*.45);
   float crest=sin(dot(p,vec2(.48,.70))-time*1.35);float broken=noise(p*2.8+vec2(time*.10,-time*.13));
   float foam=smoothstep(.93,.995,crest)*smoothstep(.58,.82,broken)*(.16+storm*.32);
   vec2 local=p-boat,center=vec2(bounds.x+bounds.y,bounds.z+bounds.w)*.5,halfSize=vec2(bounds.y-bounds.x,bounds.w-bounds.z)*.5;
   vec2 q=abs(local-center)-halfSize;float edge=length(max(q,0.))+min(max(q.x,q.y),0.);
   float contact=(1.-smoothstep(.04,.19,abs(edge+.015+wave(p)*.08)))*smoothstep(.20,.65,broken)*.45;
   float coastDist=min(abs(distance(p,vec2(-10.,4.))-4.3),abs(distance(p,vec2(${HARBOR.x.toFixed(1)},${HARBOR.z.toFixed(1)}))-5.2));
   float coast=(1.-smoothstep(.10,.65,coastDist+sin(time*1.1+p.x*2.)*.15))*smoothstep(.24,.68,broken)*.5;
   color=mix(color,vec3(.79,.94,.91),clamp(foam+contact+coast,0.,.75));
   color=mix(color,color*vec3(.79,.87,.99),storm*.35);
   // Genuine translucency reveals the shallow coast and immersed barrel bottoms.
   float alpha=clamp(.96-shallow*.22+fresnel*.1+foam*.2,.73,.99);
   gl_FragColor=vec4(color,alpha);
 }`});
 const geo=new T.PlaneGeometry(180,220,144,176);geo.rotateX(-Math.PI/2);const water=new T.Mesh(geo,mat);water.position.y=-.38;water.renderOrder=-1;world.scene.add(water);
 return {mesh:water,uniforms,height:surfaceHeight};
}
