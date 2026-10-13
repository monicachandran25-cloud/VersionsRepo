/* Infinity Hub Contracting — 3D scenes (Three.js r147).
   A · hero building · C · capability models · E · project drum · F · quality/safety rings · G · logo mark */
(function(){
  var IH=window.IH=window.IH||{};
  var T=window.THREE;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var mobile=window.innerWidth<760;
  function ok(){ try{ var c=document.createElement('canvas'); return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl'))); }catch(e){ return false; } }
  if(!T||!ok()){
    document.documentElement.classList.add('no-gl');
    var hf=document.createElement('div'); hf.className='hero__fallback'; var hg=document.getElementById('heroGL'); hg.parentNode.insertBefore(hf,hg);
    if(IH.heroReady) IH.heroReady();
    return;
  }


  var V3=T.Vector3, DPR=Math.min(window.devicePixelRatio||1,mobile?1.6:2);
  function col(h){ return new T.Color(h).convertSRGBToLinear(); }
  function clamp(x,a,b){ return x<a?a:x>b?b:x; }
  function ease(x){ x=clamp(x,0,1); return 1-Math.pow(1-x,3); }
  function mkRenderer(canvas,alpha){
    var r=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:!!alpha,powerPreference:'high-performance'});
    r.setPixelRatio(DPR); r.outputEncoding=T.sRGBEncoding; r.toneMapping=T.ACESFilmicToneMapping; r.toneMappingExposure=1;
    return r;
  }
  var envTex=null;
  function env(r){ if(envTex) return envTex; if(!T.RoomEnvironment) return null; var pm=new T.PMREMGenerator(r); envTex=pm.fromScene(new T.RoomEnvironment(),.04).texture; return envTex; }

  /* one loop drives every visible scene */
  var scenes=[], clock=new T.Clock();
  function register(s,el){ s.on=false; scenes.push(s);
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ s.on=es[0].isIntersecting; },{rootMargin:'120px 0px'}).observe(el); else s.on=true; }
  (function loop(){ var dt=Math.min(clock.getDelta(),.05), t=clock.elapsedTime; scenes.forEach(function(s){ if(s.on) s.frame(dt,t); }); requestAnimationFrame(loop); })();

  /* =====================================================================
     LOADER — a welding spark fabricates the infinity mark as the page loads
     ===================================================================== */
  (function bootGL(){
    var cv=document.getElementById('bootGL'), root=document.documentElement; if(!cv||!root.classList.contains('booting')) return;
    var r=mkRenderer(cv,true); r.setClearColor(0x000000,0); r.toneMappingExposure=1.1;
    var sc=new T.Scene(); sc.environment=env(r);
    var cam=new T.PerspectiveCamera(30,1,.1,200);
    var key=new T.DirectionalLight(0xffffff,1.2); key.position.set(-3,5,8); sc.add(key);
    var grp=new T.Group(); sc.add(grp);
    // infinity (lemniscate) with a gentle twist so the two passes cross in front of each other
    function L(u,tg){ var a=u*Math.PI*2, s=Math.sin(a), c=Math.cos(a), d=1+s*s; return (tg||new V3()).set(3.3*c/d,3.3*s*c/d,.6*s); }
    var C=new T.Curve(); C.getPoint=function(u,tg){ return L(u,tg); };
    var SEG=640, RAD=28, tube=new T.TubeGeometry(C,SEG,.19,RAD,true), per=RAD*6;
    var red=new T.MeshPhysicalMaterial({color:col('#b3121b'),metalness:.3,roughness:.26,clearcoat:1,clearcoatRoughness:.1,emissive:col('#ff2a2a'),emissiveIntensity:0});
    var mesh=new T.Mesh(tube,red); tube.setDrawRange(0,0); grp.add(mesh);
    // the drawing it follows: a dashed construction line
    var gp=[]; for(var i=0;i<=360;i++) gp.push(L(i/360));
    var gg=new T.BufferGeometry().setFromPoints(gp), ghost=new T.Line(gg,new T.LineDashedMaterial({color:col('#5a5560'),dashSize:.09,gapSize:.09,transparent:true,opacity:.9})); ghost.computeLineDistances(); grp.add(ghost);
    // welding tip, its light and sparks
    var tip=new T.Mesh(new T.SphereGeometry(.11,16,12),new T.MeshBasicMaterial({color:col('#fff1d6')})); grp.add(tip);
    var glow=new T.PointLight(col('#ff9a3c'),2.2,4); tip.add(glow);
    var halo=new T.Sprite(new T.SpriteMaterial({color:col('#ff8a2a'),transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,map:(function(){ var c=document.createElement('canvas'); c.width=c.height=64; var x=c.getContext('2d'), g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=g; x.fillRect(0,0,64,64); return new T.CanvasTexture(c); })()}));
    halo.scale.setScalar(.9); tip.add(halo);
    var NS=220, sp=new Float32Array(NS*3), vel=[], life=new Float32Array(NS), next=0;
    for(var k=0;k<NS;k++){ sp[k*3+1]=-99; vel.push(new V3()); }
    var sg=new T.BufferGeometry(); sg.setAttribute('position',new T.BufferAttribute(sp,3));
    var sparks=new T.Points(sg,new T.PointsMaterial({color:col('#ffb35c'),size:.055,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false})); grp.add(sparks);
    function emit(p,n){ for(var j=0;j<n;j++){ var k=next; next=(next+1)%NS; sp[k*3]=p.x; sp[k*3+1]=p.y; sp[k*3+2]=p.z; vel[k].set((Math.random()-.5)*3.2,Math.random()*2.6+.4,(Math.random()-.5)*3.2); life[k]=.5+Math.random()*.5; } }
    var W=1,H=1; function resize(){ W=cv.clientWidth||innerWidth; H=cv.clientHeight||innerHeight; r.setSize(W,H,false); cam.aspect=W/H;
      var z=Math.max(15.5,10.2/(2*Math.tan(15*Math.PI/180)*cam.aspect)); cam.position.set(0,.4,z); cam.lookAt(0,.25,0); cam.updateProjectionMatrix(); grp.position.y=W<700?1.6:(H<820?1.25:.9); }
    resize(); addEventListener('resize',resize);
    var shown=0, last=performance.now(), t=0, exitT=-1, tp=new V3(), alive=true;
    IH.bootExit=function(){ if(exitT<0) exitT=0; };
    (function loop(now){ if(!alive) return; var dt=Math.min(.05,(now-last)/1000||0); last=now; t+=dt;
      var target=Math.min(1,IH.bootP||0); shown+=(target-shown)*Math.min(1,dt*8);
      var segs=shown>.985?SEG:Math.floor(shown*SEG); tube.setDrawRange(0,segs*per);
      var drawing=shown<.995&&exitT<0; L(shown,tp); tip.position.copy(tp); tip.visible=drawing; if(drawing&&!reduce) emit(tp,3);
      for(var k=0;k<NS;k++){ if(life[k]<=0) continue; life[k]-=dt; vel[k].y-=7.5*dt; sp[k*3]+=vel[k].x*dt; sp[k*3+1]+=vel[k].y*dt; sp[k*3+2]+=vel[k].z*dt; if(life[k]<=0) sp[k*3+1]=-99; }
      sg.attributes.position.needsUpdate=true;
      ghost.material.opacity=.9*(1-shown*.85);
      red.emissiveIntensity=shown>=.995?(.12+Math.sin(t*4)*.06):0;
      grp.rotation.y=reduce?0:Math.sin(t*.7)*.32; grp.rotation.x=reduce?0:-.12+Math.sin(t*.5)*.05;
      if(exitT>=0){ exitT+=dt; var e=Math.min(1,exitT/1.1), q=e*e*(3-2*e); grp.rotation.y+=q*Math.PI; grp.scale.setScalar(1+q*2.6); grp.position.z=q*4; if(exitT>1.6||!root.classList.contains('booting')){ alive=false; r.dispose(); return; } }
      r.render(sc,cam); requestAnimationFrame(loop); })(last);
  })();

  /* materials */
  function std(c,o){ o=o||{}; return new T.MeshStandardMaterial({color:col(c),roughness:o.r!=null?o.r:.7,metalness:o.m||0,emissive:o.e?col(o.e):undefined,emissiveIntensity:o.ei||1,side:o.side||T.FrontSide,transparent:!!o.t,opacity:o.o!=null?o.o:1}); }
  function box(w,h,d,mat,x,y,z,parent){ var m=new T.Mesh(new T.BoxGeometry(w,h,d),mat); m.position.set(x||0,y||0,z||0); m.castShadow=m.receiveShadow=true; if(parent) parent.add(m); return m; }
  function cyl(r1,r2,h,mat,x,y,z,parent,seg){ var m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg||16),mat); m.position.set(x||0,y||0,z||0); m.castShadow=m.receiveShadow=true; if(parent) parent.add(m); return m; }
  // a member between two points (beams, rafters, braces, ropes)
  function member(a,b,th,mat,parent,round){
    var d=new V3().subVectors(b,a), len=d.length();
    var m=round?new T.Mesh(new T.CylinderGeometry(th,th,len,10),mat):new T.Mesh(new T.BoxGeometry(th,len,th),mat);
    m.position.copy(a).addScaledVector(d,.5); m.quaternion.setFromUnitVectors(new V3(0,1,0),d.normalize()); m.castShadow=m.receiveShadow=true; if(parent) parent.add(m); return m;
  }
  // tensioned fabric between 4 corners (bilinear hypar with sag)
  function sail(c0,c1,c2,c3,mat,parent,sag,nx,nz){
    nx=nx||24; nz=nz||16; var g=new T.PlaneGeometry(1,1,nx,nz), p=g.attributes.position;
    for(var i=0;i<p.count;i++){ var u=p.getX(i)+.5, v=p.getY(i)+.5;
      var a=new V3().lerpVectors(c0,c1,u), b=new V3().lerpVectors(c3,c2,u), q=new V3().lerpVectors(a,b,v);
      q.y-=(sag||0)*Math.sin(u*Math.PI)*Math.sin(v*Math.PI); p.setXYZ(i,q.x,q.y,q.z); }
    g.computeVertexNormals(); var m=new T.Mesh(g,mat); m.castShadow=true; m.receiveShadow=true; if(parent) parent.add(m); return m;
  }
  function car(color,x,z,rot,parent){
    var g=new T.Group(), body=std(color,{r:.35,m:.5}), glass=std('#1b1d24',{r:.15,m:.2});
    box(4.3,.75,1.8,body,0,.65,0,g); box(2.4,.6,1.62,glass,-.2,1.3,0,g); box(2.3,.08,1.66,body,-.2,1.63,0,g);
    [[-1.4,.82],[1.4,.82],[-1.4,-.82],[1.4,-.82]].forEach(function(w){ var c=cyl(.36,.36,.26,std('#111114',{r:.9}),w[0],.36,w[1],g,14); c.rotation.x=Math.PI/2; });
    g.position.set(x,0,z); g.rotation.y=rot||0; parent.add(g); return g;
  }
  function tree(x,z,s,parent){ var g=new T.Group(); cyl(.12,.16,1.4*s,std('#5b4636'),0,.7*s,0,g,8);
    var c=new T.Mesh(new T.IcosahedronGeometry(1.1*s,0),std('#3f5a45',{r:.9})); c.position.y=2.1*s; c.castShadow=true; g.add(c); g.position.set(x,0,z); parent.add(g); return g; }
  function edges(obj,mat,thr){
    obj.updateMatrixWorld(true); var segs=[];
    obj.traverse(function(o){ if(!o.isMesh||o.userData.noEdge) return; var e=new T.EdgesGeometry(o.geometry,thr||25), a=e.attributes.position, v=new V3();
      for(var i=0;i<a.count;i++){ v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld); segs.push(v.x,v.y,v.z); } e.dispose(); });
    var g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(segs,3)); return new T.LineSegments(g,mat);
  }

  /* =====================================================================
     A · HERO — one dark, detailed building on a white page. The four steps
     tell the project: drawn as lines, surveyed, built up floor by floor, lit.
     ===================================================================== */
  (function hero(){
    var canvas=document.getElementById('heroGL'), section=document.getElementById('top'), tagBox=document.getElementById('heroTags');
    var renderer=mkRenderer(canvas,true); renderer.setClearColor(0x000000,0); renderer.localClippingEnabled=true;
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
    var scene=new T.Scene(); scene.environment=env(renderer);
    var camera=new T.PerspectiveCamera(24,1,.5,200);
    scene.add(new T.HemisphereLight(col('#ffffff'),col('#c9c9c4'),.7));
    var key=new T.DirectionalLight(col('#fff4e6'),1.6); key.position.set(-9,15,11); key.castShadow=true; key.shadow.mapSize.set(2048,2048);
    var kc=key.shadow.camera; kc.left=-15; kc.right=15; kc.top=15; kc.bottom=-15; kc.near=1; kc.far=60; key.shadow.bias=-.0004; key.shadow.normalBias=.02; key.shadow.radius=7; scene.add(key);
    var rim=new T.DirectionalLight(col('#dfe8ff'),.55); rim.position.set(12,8,-10); scene.add(rim);
    var floor=new T.Mesh(new T.PlaneGeometry(90,90),new T.ShadowMaterial({opacity:.16})); floor.rotation.x=-Math.PI/2; floor.position.y=-2.7; floor.receiveShadow=true; scene.add(floor);
    var warmLight=new T.PointLight(col('#ffae5c'),0,18,2); warmLight.position.set(-.5,3.4,5); scene.add(warmLight);
    var clipP=new T.Plane(new V3(0,-1,0),100), clipped=[];
    function C(m){ m.clippingPlanes=[clipP]; m.clipShadows=true; clipped.push(m); return m; }
    function rbox(w,h,d,r,mat,x,y,z,parent){ var s=new T.Shape(), b=Math.min(.12,h*.2,w*.2,d*.2), hw=w/2-b, hd=d/2-b; r=Math.max(.01,Math.min(r-b,hw-.01,hd-.01));
      s.moveTo(-hw+r,-hd); s.lineTo(hw-r,-hd); s.quadraticCurveTo(hw,-hd,hw,-hd+r); s.lineTo(hw,hd-r); s.quadraticCurveTo(hw,hd,hw-r,hd); s.lineTo(-hw+r,hd); s.quadraticCurveTo(-hw,hd,-hw,hd-r); s.lineTo(-hw,-hd+r); s.quadraticCurveTo(-hw,-hd,-hw+r,-hd);
      var g=new T.ExtrudeGeometry(s,{depth:h-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:10});
      g.rotateX(-Math.PI/2); g.translate(0,-h/2+b,0); var m=new T.Mesh(g,mat); m.position.set(x,y,z); m.castShadow=m.receiveShadow=true; parent.add(m); m.userData.vol=[w,h,d]; return m; }
    function room(w,h,seed){ var cw=512, ch=Math.round(512*h/w), c=document.createElement('canvas'); c.width=cw; c.height=ch; var x=c.getContext('2d'), rnd=(function(s){ return function(){ s=(s*9301+49297)%233280; return s/233280; }; })(seed);
      var gr=x.createLinearGradient(0,0,0,ch); gr.addColorStop(0,'#ffdca8'); gr.addColorStop(.65,'#ffb15e'); gr.addColorStop(1,'#e2803a'); x.fillStyle=gr; x.fillRect(0,0,cw,ch);
      x.fillStyle='rgba(255,250,235,.9)'; for(var i=0;i<4;i++) x.fillRect(cw*(.1+i*.22),ch*.06,cw*.12,ch*.025);
      x.fillStyle='rgba(150,92,48,.55)'; x.fillRect(0,ch*.86,cw,ch*.14);
      var n=Math.max(3,Math.round(cw/120)); for(var k=0;k<n;k++){ var px=cw*(k+.3+rnd()*.4)/n, kind=Math.floor(rnd()*4); x.fillStyle='rgba(110,64,32,'+(.5+rnd()*.2)+')';
        if(kind===0){ x.fillRect(px-36,ch*.62,72,6); x.fillRect(px-30,ch*.62,4,ch*.24); x.fillRect(px+26,ch*.62,4,ch*.24); }
        else if(kind===1){ x.fillRect(px-22,ch*.34,44,ch*.52); x.fillStyle='rgba(255,236,200,.5)'; for(var q=0;q<3;q++) x.fillRect(px-18,ch*(.4+q*.14),36,3); }
        else if(kind===2){ x.beginPath(); x.arc(px,ch*.5,18,0,7); x.fill(); x.fillRect(px-2,ch*.5,4,ch*.36); }
        else { x.fillRect(px-2,ch*.3,3,ch*.56); x.beginPath(); x.moveTo(px-16,ch*.32); x.lineTo(px+15,ch*.32); x.lineTo(px+8,ch*.22); x.lineTo(px-9,ch*.22); x.fill(); } }
      var t=new T.CanvasTexture(c); t.encoding=T.sRGBEncoding; t.anisotropy=4; return t; }
    // dark palette
    var body=C(std('#2a2e33',{r:.5,m:.18})), body2=C(std('#353a40',{r:.55,m:.12})), slabM=C(std('#3d4248',{r:.5,m:.1})), trim=C(std('#121416',{r:.38,m:.45})),
        fin=C(std('#1a1d20',{r:.42,m:.35})), railM=C(std('#d6e4ea',{r:.05,t:true,o:.22})), glassM=C(std('#e4eef0',{r:.04,t:true,o:.14})), green=C(std('#4d6b43',{r:.85})), green2=C(std('#66854f',{r:.85})),
        bark=C(std('#4a3a2c',{r:.9})), cushion=C(std('#c9c1b4',{r:.9})), solarM=C(std('#1c2a3c',{r:.22,m:.5})), acM=C(std('#4c5157',{r:.5,m:.3}));
    var glows=[];
    function glowM(c,e){ var m=C(std(c,{e:e,ei:.1,r:.45})); glows.push(m); return m; }
    var ventM=glowM('#ffcf98','#ff9d45'), lampM=glowM('#fff6ea','#ffd9a6'), ledM=glowM('#ffe2bd','#ffb46a'), screenM=glowM('#c9e6ee','#9bd4e4');
    function windowPanel(w,h,seed,x,y,z,ry,parent){ var tex=room(w,h,seed), m=C(new T.MeshStandardMaterial({map:tex,color:col('#5b5d5a'),emissiveMap:tex,emissive:new T.Color(1,1,1),emissiveIntensity:.1,roughness:.9}));
      var g=new T.Group(); g.position.set(x,y,z); g.rotation.y=ry||0; parent.add(g); g.add(new T.Mesh(new T.PlaneGeometry(w,h),m)); glows.push(m);
      var gl=new T.Mesh(new T.PlaneGeometry(w,h),glassM); gl.position.z=.03; g.add(gl);
      [[0,h/2],[0,-h/2]].forEach(function(b){ var m2=new T.Mesh(new T.BoxGeometry(w+.14,.09,.1),trim); m2.position.set(b[0],b[1],.03); g.add(m2); });
      var cols=Math.max(1,Math.round(w/1.5)); for(var i=0;i<=cols;i++){ var v=new T.Mesh(new T.BoxGeometry(.06,h,.08),trim); v.position.set(-w/2+i*w/cols,0,.04); g.add(v); }
      return g; }
    function bx(w,h,d,m,x,y,z,p){ var o=box(w,h,d,m,x,y,z,p); return o; }
    var B=new T.Group(); scene.add(B); var inner=new T.Group(); B.add(inner);
    // base, slab, edge light
    rbox(7.2,1.1,4.4,.6,body2,.6,-.75,-.2,inner);
    [-1.6,.6,2.8].forEach(function(x){ var v=new T.Mesh(new T.BoxGeometry(1.2,.2,.06),ventM); v.position.set(x,-.75,2.02); inner.add(v); });
    rbox(11.6,.42,6.6,.8,slabM,0,-.21,0,inner);
    bx(10.4,.035,.05,ledM,0,-.36,3.31,inner);
    // ground floor core, fins, glazing, entrance
    rbox(6.8,2.9,4.6,.55,body,1.8,1.45,-.8,inner);
    windowPanel(4.4,2.15,11,1.1,1.3,1.52,0,inner);
    windowPanel(2.6,2.15,23,-1.62,1.3,-.8,-Math.PI/2,inner);
    for(var f=0;f<6;f++) bx(.32,2.5,.07,fin,5.36,1.35,-2.7+f*.72,inner);
    bx(.95,2.1,.1,trim,4.5,1.05,1.55,inner); bx(1.7,.08,1.1,trim,4.5,2.35,2.05,inner);
    var sc=new T.Mesh(new T.BoxGeometry(.48,.3,.03),screenM); sc.position.set(4.5,1.55,1.62); inner.add(sc);
    // terrace: lamps, lounge, planter, glass balustrade
    [[-4.6,1.9],[-2.5,2.6]].forEach(function(p){ var l=new T.Mesh(new T.SphereGeometry(.46,32,24),lampM); l.position.set(p[0],.46,p[1]); l.castShadow=true; inner.add(l); });
    bx(1.6,.32,.7,cushion,-3.7,.16,-.2,inner); bx(1.6,.42,.18,cushion,-3.7,.38,-.58,inner); bx(.7,.3,.7,bark,-2.3,.15,.6,inner);
    bx(1.4,.55,.6,fin,-4.8,.28,-2.5,inner); [[-5.2,.85,-2.5],[-4.75,.95,-2.45],[-4.35,.82,-2.55]].forEach(function(q){ var s=new T.Mesh(new T.IcosahedronGeometry(.36,1),green); s.position.set(q[0],q[1],q[2]); s.castShadow=true; inner.add(s); });
    bx(4.0,.95,.04,railM,-3.8,.5,3.18,inner); bx(4.05,.05,.07,trim,-3.8,.99,3.18,inner);
    bx(.04,.95,3.0,railM,-5.72,.5,1.7,inner); bx(.07,.05,3.05,trim,-5.72,.99,1.7,inner);
    // tree at the front corner
    var tr=new T.Group(); tr.position.set(5.0,0,2.55); inner.add(tr); var tk=cyl(.07,.1,1.6,bark,0,.8,0,tr,8);
    [[0,1.95,0,.62],[.32,1.6,.18,.44],[-.28,1.7,-.12,.46],[0,2.35,.05,.4]].forEach(function(q,i){ var s=new T.Mesh(new T.IcosahedronGeometry(q[3],1),i%2?green2:green); s.position.set(q[0],q[1],q[2]); s.castShadow=true; tr.add(s); });
    tr.traverse(function(o){ if(o.isMesh) o.castShadow=true; });
    // first-floor pod: ribbon window, cove light and downlights underneath
    rbox(10.6,3.2,5.8,1.1,body,-.3,4.5,-.3,inner);
    windowPanel(8.4,1.9,7,-.6,4.5,2.62,0,inner);
    windowPanel(3.6,1.9,31,-5.62,4.5,-.3,-Math.PI/2,inner);
    bx(9.4,.04,.07,ledM,-.6,2.93,2.48,inner);
    [[-4.6,1.6],[-2.6,1.6],[-4.6,-.4],[-2.6,-.4]].forEach(function(q){ var d=new T.Mesh(new T.CylinderGeometry(.14,.14,.03,16),lampM); d.position.set(q[0],2.88,q[1]); inner.add(d); });
    // roof: plant room, air-con units, solar panels, mast and beacon
    rbox(3.4,1.5,4.2,.5,body2,3.1,6.85,-.8,inner);
    [[2.4,-1.7],[3.7,-1.7]].forEach(function(q){ bx(.95,.5,.95,acM,q[0],7.86,q[1],inner); var fan=new T.Mesh(new T.CylinderGeometry(.34,.34,.04,20),trim); fan.position.set(q[0],8.12,q[1]); inner.add(fan); });
    [1.9,3.0,4.1].forEach(function(x){ var p=bx(.95,.05,.75,solarM,x,6.42,1.95,inner); p.rotation.x=-.42; bx(.05,.3,.05,trim,x,6.25,2.15,inner); });
    cyl(.045,.045,2.4,trim,4.1,8.7,-.2,inner,8);
    var beaconM=new T.MeshStandardMaterial({color:col('#ff3b2f'),emissive:col('#ff2a1a'),emissiveIntensity:1.2}); C(beaconM); var beacon=new T.Mesh(new T.SphereGeometry(.13,16,12),beaconM); beacon.position.set(4.1,9.95,-.2); inner.add(beacon);
    // concept lines: outlines of the main volumes, shown before the building exists
    var lineM=new T.LineBasicMaterial({color:col('#1d2024'),transparent:true,opacity:.6}), lines=new T.Group(); inner.add(lines);
    inner.updateMatrixWorld(true);
    inner.children.slice().forEach(function(o){ if(!o.userData.vol) return; var v=o.userData.vol, l=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(v[0],v[1],v[2])),lineM); l.position.copy(o.position); l.rotation.copy(o.rotation); lines.add(l); });
    // step 3: steel pergola rises on the roof terrace
    var perg=new T.Group(); perg.position.set(-2.6,6.1,-.4); inner.add(perg); var steel=std('#16191c',{r:.4,m:.5}), wood=std('#b0804f',{r:.7});
    [[-2.2,-1.8],[2.2,-1.8],[-2.2,1.8],[2.2,1.8]].forEach(function(c){ box(.12,1.5,.12,steel,c[0],.75,c[1],perg); });
    box(4.8,.16,.14,steel,0,1.55,-1.8,perg); box(4.8,.16,.14,steel,0,1.55,1.8,perg);
    for(var i=0;i<14;i++) box(.09,.1,4.1,wood,-2.2+i*.338,1.69,0,perg);
    perg.children.forEach(function(o){ o.userData.y0=o.position.y; });
    // step 2: survey plane
    var scanM=new T.MeshBasicMaterial({color:col('#ff3b2f'),transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});
    var scan=new T.Mesh(new T.PlaneGeometry(13.2,8.2),scanM); scan.rotation.x=-Math.PI/2; inner.add(scan);
    var scanEdge=new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(13.2,8.2)),new T.LineBasicMaterial({color:col('#ff3b2f'),transparent:true,opacity:0})); scanEdge.rotation.x=-Math.PI/2; inner.add(scanEdge);
    // one label per step, pinned to the model
    var TAGS=[['Concept drawing',new V3(4.9,6.2,2.6)],['3D site survey',new V3(6.6,0,4.1)],['Steel pergola going up',new V3(-.4,7.9,-2.2)],['Lights on · handover',new V3(3.2,5.6,2.65)]];
    var tagEls=TAGS.map(function(t){ var s=document.createElement('span'); s.className='htag mono'; s.innerHTML='<i></i>'+t[0]; tagBox.appendChild(s); return s; });

    var W=1,H=1, px=0, tpx=0, yaw=-.42, vel=0, drag=false, lx=0, lastIn=-9, lv=0, build=0, perP=0, scanA=0, lineA=.6, clk=0;
    canvas.addEventListener('pointerdown',function(e){ drag=true; lx=e.clientX; lastIn=clk; canvas.classList.add('is-drag'); try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
    canvas.addEventListener('pointermove',function(e){ if(!drag) return; var dx=e.clientX-lx; lx=e.clientX; vel=dx*.006; yaw+=dx*.008; lastIn=clk; });
    function up(){ drag=false; canvas.classList.remove('is-drag'); } canvas.addEventListener('pointerup',up); canvas.addEventListener('pointercancel',up);
    section.addEventListener('pointermove',function(e){ if(!canHover) return; var r=section.getBoundingClientRect(); tpx=(e.clientX-r.left)/r.width-.5; },{passive:true});
    function resize(){ W=canvas.clientWidth; H=canvas.clientHeight; renderer.setSize(W,H,false); camera.aspect=W/H; var a=W/H, wide=a>1.05;
      camera.fov=wide?24:30; if(wide) camera.setViewOffset(W,H,-W*(a<1.4?.25:.21),H*.02,W,H); else camera.setViewOffset(W,H,0,-H*.19,W,H); camera.updateProjectionMatrix(); }
    resize(); window.addEventListener('resize',resize);
    var LV=[0,0,.3,1], tmp=new V3();
    var lastNow=performance.now();
    function frame(dt,t){ clk=t; var now=performance.now(); dt=Math.min(.25,(now-lastNow)/1000); lastNow=now;
      var p=IH.heroProgress||0, st=IH.heroStep==null?3:IH.heroStep, a=W/H, wide=a>1.05, k=Math.min(1,dt*3);
      px+=(tpx-px)*.05;
      if(!drag){ yaw+=vel; vel*=.93; if(t-lastIn>3) yaw+=((-.42+px*.3+(reduce?0:Math.sin(t*.2)*.06))-yaw)*.02; }
      var d=(wide?47*Math.max(1,1.45/a):84)+p*8; camera.position.set(Math.sin(.18)*d,d*.36,Math.cos(.18)*d); camera.lookAt(0,3.1,0);
      B.rotation.y=yaw+p*.35; B.position.y=(reduce?0:Math.sin(t*.8)*.14)-p*1.5;
      // build: the solid rises through a clipping plane
      build+=((st>=2?1:0)-build)*Math.min(1,dt*1.5); clipP.constant=B.position.y-2+build*12.5;
      lineA+=((st>=2?.1:.6)-lineA)*k; lineM.opacity=lineA;
      lv+=(LV[st]-lv)*k; glows.forEach(function(m){ m.emissiveIntensity=.06+lv*(m===lampM?2.4:m===ventM?2.2:m===ledM?3:2.8); }); warmLight.intensity=lv*2.6;
      beaconM.emissiveIntensity=build>.9?.6+.8*(.5+.5*Math.sin(t*3.2)):0;
      scanA+=((st===1?1:0)-scanA)*Math.min(1,dt*4); var sy=-.6+((t*.32)%1)*9; scan.position.y=scanEdge.position.y=sy; scanM.opacity=.14*scanA; scanEdge.material.opacity=.9*scanA; scan.visible=scanEdge.visible=scanA>.01;
      var pt=(st>=2&&build>.8?1:0); perP+=Math.max(-dt*1.4,Math.min(dt*.9,pt-perP)); var pk=perg.children.length;
      perg.children.forEach(function(o,i){ var q=clamp(perP*pk*1.15-i,0,1), e=ease(q); o.visible=q>.02; o.position.y=o.userData.y0+(1-e)*2.2; });
      // labels
      B.updateMatrixWorld();
      TAGS.forEach(function(tg,i){ tmp.copy(tg[1]); if(i===1) tmp.y=sy; tmp.applyMatrix4(inner.matrixWorld).project(camera);
        var x=(tmp.x*.5+.5)*W, y=(-tmp.y*.5+.5)*H; tagEls[i].style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'; tagEls[i].classList.toggle('on',i===st); });
      renderer.render(scene,camera);
      if(!frame.done){ frame.done=true; if(IH.heroReady) IH.heroReady(); }
    }
    register({frame:frame},section);
  })();

  /* =====================================================================
     C · CAPABILITIES — one procedural model per discipline
     ===================================================================== */
  (function caps(){
    var canvas=document.getElementById('capGL'), stage=document.getElementById('capStage');
    var renderer=mkRenderer(canvas,true); renderer.setClearColor(0x000000,0);
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
    var scene=new T.Scene(); scene.environment=env(renderer);
    var camera=new T.PerspectiveCamera(30,1,.1,200);
    scene.add(new T.HemisphereLight(col('#e7ebf8'),col('#1a1a1f'),.6));
    var key=new T.DirectionalLight(col('#fff3e6'),2); key.position.set(-6,12,8); key.castShadow=true; key.shadow.mapSize.set(1024,1024);
    var ks=key.shadow.camera; ks.left=-8; ks.right=8; ks.top=8; ks.bottom=-8; key.shadow.bias=-.0005; key.shadow.normalBias=.02; scene.add(key);
    var rim=new T.DirectionalLight(col('#ff6b6f'),.7); rim.position.set(8,4,-8); scene.add(rim);
    var floor=new T.Mesh(new T.CircleGeometry(9,64),new T.ShadowMaterial({opacity:.38})); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);
    var rings=new T.Group(); scene.add(rings);
    [3.5,5.5,7.5].forEach(function(r,i){ var m=new T.Mesh(new T.RingGeometry(r,r+.02,96),new T.MeshBasicMaterial({color:col('#3a3a44'),transparent:true,opacity:.7-i*.18})); m.rotation.x=-Math.PI/2; m.position.y=.005; rings.add(m); });
    var pivot=new T.Group(); scene.add(pivot);
    var edgeMat=new T.LineBasicMaterial({color:col('#ffffff'),transparent:true,opacity:.16,depthWrite:false});

    var steel=std('#8d8e98',{r:.38,m:.8}), steelD=std('#5d5e68',{r:.45,m:.7}), red=std('#ce2128',{r:.45,m:.25}), white=std('#f1efea',{r:.6}),
        wood=std('#a8754b',{r:.6}), woodD=std('#6e4a31',{r:.6}), leather=std('#8a4a2b',{r:.55}), dark=std('#18181d',{r:.4}), glassM=new T.MeshPhysicalMaterial({color:col('#c9d6e3'),roughness:.05,metalness:0,transmission:0,transparent:true,opacity:.28}),
        core=std('#efc24a',{r:.85}), fabric=std('#ebe1cb',{r:.9,side:T.DoubleSide}), canvasM=std('#dedbd3',{r:.95}), glow=std('#fff1d6',{e:'#ffe2b0',ei:2.2});

    var B={};
    B.fitout=function(){ var g=new T.Group();
      box(7,.18,5.4,wood,0,.09,0,g); box(7,3.2,.18,white,0,1.78,-2.6,g); box(.18,3.2,5.4,white,-3.4,1.78,0,g);
      // feature ceiling with cove light
      box(4.4,.14,3,white,.6,3.3,-.6,g); box(4.6,.05,3.2,glow,.6,3.22,-.6,g);
      // TV wall with timber slats
      for(var i=0;i<14;i++) box(.12,2.5,.08,i%2?wood:woodD,-.8+i*.2,1.45,-2.47,g);
      box(1.7,.95,.06,dark,.5,1.65,-2.4,g);
      box(2.6,.35,.5,woodD,.5,.35,-2.2,g);
      // sofa
      box(2.6,.45,1,leather,.6,.4,.9,g); box(2.6,.55,.25,leather,.6,.75,1.33,g); box(.25,.6,1,leather,-.6,.6,.9,g); box(.25,.6,1,leather,1.8,.6,.9,g);
      // kitchen run on the side wall
      box(.65,.9,3,white,-3,.54,.2,g); box(.7,.05,3.05,std('#2c2c33',{r:.2,m:.3}),-3,1.01,.2,g); box(.38,.75,3,woodD,-3.12,2.4,.2,g);
      // glass partition
      box(.06,2.9,2,glassM,2.6,1.6,-1.4,g); box(.08,.08,2,steelD,2.6,3.05,-1.4,g);
      var pend=new T.Mesh(new T.SphereGeometry(.22,20,14),glow); pend.position.set(.6,2.3,.9); g.add(pend);
      member(new V3(.6,3.25,.9),new V3(.6,2.5,.9),.01,dark,g,true);
      return g; };
    B.steel=function(){ var g=new T.Group(), span=5.6, eave=3, ridge=4.1;
      for(var i=0;i<4;i++){ var x=-3.3+i*2.2;
        member(new V3(x,0,-span/2),new V3(x,eave,-span/2),.22,steel,g); member(new V3(x,0,span/2),new V3(x,eave,span/2),.22,steel,g);
        member(new V3(x,eave,-span/2),new V3(x,ridge,0),.2,steel,g); member(new V3(x,eave,span/2),new V3(x,ridge,0),.2,steel,g);
        box(.5,.08,.5,red,x,.04,-span/2,g); box(.5,.08,.5,red,x,.04,span/2,g); }
      for(var p=0;p<=4;p++){ var z=span/2*p/4, y=eave+(ridge-eave)*(1-p/4)+.14;
        member(new V3(-3.5,y,z),new V3(3.5,y,z),.08,steelD,g); if(p>0) member(new V3(-3.5,y,-z),new V3(3.5,y,-z),.08,steelD,g); }
      [[-span/2],[span/2]].forEach(function(z){ member(new V3(-3.3,0,z[0]),new V3(-1.1,eave,z[0]),.035,red,g,true); member(new V3(-1.1,0,z[0]),new V3(-3.3,eave,z[0]),.035,red,g,true); });
      member(new V3(1.1,0,-span/2),new V3(3.3,eave,-span/2),.035,red,g,true); member(new V3(3.3,0,-span/2),new V3(1.1,eave,-span/2),.035,red,g,true);
      return g; };
    B.mezz=function(){ var g=new T.Group();
      [[-2.6,-1.4],[0,-1.4],[2.6,-1.4],[-2.6,1.4],[0,1.4],[2.6,1.4]].forEach(function(c){ box(.16,2.6,.16,steel,c[0],1.3,c[1],g); box(.4,.06,.4,red,c[0],.03,c[1],g); });
      box(6,.12,.22,steelD,0,2.55,-1.4,g); box(6,.12,.22,steelD,0,2.55,1.4,g); for(var j=0;j<7;j++) box(.1,.12,2.8,steelD,-2.9+j*.97,2.55,0,g);
      box(6.1,.08,3.2,std('#73747d',{r:.55,m:.5}),0,2.66,0,g);
      // stair down the side
      for(var s=0;s<10;s++) box(.95,.06,.3,steelD,3.6,.24+s*.25,-1.25+s*.28,g);
      member(new V3(3.1,.2,-1.35),new V3(3.1,2.65,1.4),.06,steel,g); member(new V3(4.1,.2,-1.35),new V3(4.1,2.65,1.4),.06,steel,g);
      member(new V3(4.1,1.1,-1.35),new V3(4.1,3.55,1.4),.03,red,g,true);
      // guardrails
      [[-3,-1.6,3,-1.6],[-3,-1.6,-3,1.6],[-3,1.6,3,1.6]].forEach(function(r){ member(new V3(r[0],3.6,r[1]),new V3(r[2],3.6,r[3]),.03,red,g,true); member(new V3(r[0],3.15,r[1]),new V3(r[2],3.15,r[3]),.02,steel,g,true); });
      for(var q=-3;q<=3;q+=1) cyl(.025,.025,.95,steel,q,3.15,-1.6,g,6);
      // storage underneath
      [[-1.8,0],[ .9,.3]].forEach(function(c){ box(1.2,.9,1,std('#c8a477',{r:.9}),c[0],.45,c[1],g); box(1,.7,.9,std('#b48d60',{r:.9}),c[0]+.1,1.25,c[1],g); });
      return g; };
    B.fab=function(){ var g=new T.Group(), n=16, rise=.22;
      cyl(.09,.09,n*rise+1.3,steel,0,(n*rise+1.3)/2,0,g,16);
      var pts=[];
      for(var i=0;i<n;i++){ var a=i*Math.PI*2/12, y=.25+i*rise;
        var t=new T.Mesh(new T.BoxGeometry(1.15,.06,.42),i%4===0?red:steelD); t.position.set(Math.cos(a)*.62,y,Math.sin(a)*.62); t.rotation.y=-a; t.castShadow=t.receiveShadow=true; g.add(t);
        cyl(.018,.018,.95,steel,Math.cos(a)*1.17,y+.5,Math.sin(a)*1.17,g,6); pts.push(new V3(Math.cos(a)*1.17,y+.98,Math.sin(a)*1.17)); }
      var curve=new T.CatmullRomCurve3(pts), rail=new T.Mesh(new T.TubeGeometry(curve,120,.035,8),red); rail.castShadow=true; g.add(rail);
      box(1.4,.08,1.4,steelD,.6,.25+n*rise,-.4,g);
      box(1.6,.12,1.6,steelD,0,.06,0,g);
      return g; };
    B.panel=function(){ var g=new T.Group(); g.userData.float=[];
      for(var k=0;k<4;k++){ var p=new T.Group(); p.position.set(0,.5+k*.85,0); p.rotation.y=k*.06; g.add(p); g.userData.float.push(p);
        box(5.6,.035,1.3,white,0,-.12,0,p); box(5.6,.2,1.3,core,0,0,0,p); box(5.6,.035,1.3,white,0,.12,0,p);
        for(var r=0;r<5;r++) box(5.6,.1,.12,white,0,.18,-.52+r*.26,p); }
      return g; };
    B.shade=function(){ var g=new T.Group();
      [-2.6,2.6].forEach(function(x){ box(.24,3.3,.24,steel,x,1.65,0,g); box(.6,.08,.6,red,x,.04,0,g);
        member(new V3(x,3.3,0),new V3(x,2.85,3.2),.16,steel,g); member(new V3(x,3.3,0),new V3(x,2.85,-3.2),.16,steel,g); });
      member(new V3(-2.8,3.35,0),new V3(2.8,3.35,0),.14,steelD,g);
      sail(new V3(-3.3,3.42,0),new V3(3.3,3.42,0),new V3(3.3,2.9,3.4),new V3(-3.3,2.9,3.4),fabric,g,.18);
      sail(new V3(-3.3,3.42,0),new V3(3.3,3.42,0),new V3(3.3,2.9,-3.4),new V3(-3.3,2.9,-3.4),fabric,g,.18);
      [[-1.3,1.9,'#e9e9e6'],[1.4,1.9,'#2a2b31'],[0,-1.9,'#7b1418']].forEach(function(c){ var cg=car(c[2],c[0],c[1],Math.PI/2,g); cg.scale.setScalar(.55); });
      return g; };
    var ringSize=6;
    B.ring=function(){ var g=new T.Group(), s=ringSize*.62, h=.9;
      box(s+.5,h,s+.5,dark,0,h/2,0,g); box(s+.3,.06,s+.3,canvasM,0,h+.03,0,g);
      var logo=new T.Mesh(new T.CircleGeometry(s*.13,48),red); logo.rotation.x=-Math.PI/2; logo.position.y=h+.065; g.add(logo);
      var c=s/2, P=[[-c,-c],[c,-c],[c,c],[-c,c]];
      P.forEach(function(p,k){ cyl(.08,.08,1.5,[red,white,std('#2b4ea2',{r:.4}),white][k],p[0],h+.75,p[1],g,12); });
      for(var r=0;r<4;r++) for(var k=0;k<4;k++){ var a=P[k], b=P[(k+1)%4], y=h+.38+r*.33; member(new V3(a[0],y,a[1]),new V3(b[0],y,b[1]),.03,r%2?white:red,g,true); }
      for(var st=0;st<3;st++) box(.9,.12,.32,steelD,c+.75,.15+st*.28,c-.4-st*.3,g);
      return g; };
    var ORDER=['fitout','steel','mezz','fab','panel','shade','ring'], built={}, cur=null, curKey=null;
    IH.capB=B;
    function make(k){
      var g=B[k](); g.updateMatrixWorld(true);
      // centre and scale to the stage
      var bb=new T.Box3().setFromObject(g), size=bb.getSize(new V3()), ctr=bb.getCenter(new V3());
      var s=6.4/Math.max(size.x,size.z,size.y*1.3); g.scale.setScalar(s); g.position.set(-ctr.x*s,-bb.min.y*s,-ctr.z*s);
      var holder=new T.Group(); holder.add(g); g.updateMatrixWorld(true);
      var e=edges(g,edgeMat,30); holder.add(e); holder.userData.lines=e; holder.userData.model=g;
      return holder;
    }
    function animateIn(h){
      if(!window.gsap||reduce) return;
      var kids=[]; h.userData.model.traverse(function(o){ if(o.isMesh) kids.push(o); });
      kids.forEach(function(o,i){ var y=o.position.y; gsap.fromTo(o.position,{y:y+3},{y:y,duration:.9,ease:'expo.out',delay:i*.012}); gsap.fromTo(o.scale,{x:.001,y:.001,z:.001},{x:1,y:1,z:1,duration:.8,ease:'expo.out',delay:i*.012}); });
      h.userData.lines.material.opacity=0; gsap.to(h.userData.lines.material,{opacity:.16,duration:1.2,delay:.4});
    }
    function show(i){
      var k=ORDER[i]; if(k===curKey&&k!=='ring') return; curKey=k;
      var old=cur;
      if(k==='ring'&&built.ring){ pivot.remove(built.ring); built.ring=null; }
      if(!built[k]) built[k]=make(k);
      cur=built[k]; pivot.add(cur); cur.visible=true; animateIn(cur);
      if(old&&old!==cur){ if(window.gsap&&!reduce) gsap.to(old.scale,{x:.001,y:.001,z:.001,duration:.45,ease:'expo.in',onComplete:function(){ old.visible=false; old.scale.set(1,1,1); pivot.remove(old); }}); else { old.visible=false; pivot.remove(old); } }
      spinV+=.06;
    }
    IH.capScene={show:show,ringSize:function(s){ ringSize=s; curKey=null; show(6); }};

    // drag to rotate with inertia; idle spin
    var rotY=-.6, spinV=0, drag=false, lx=0, lastInput=-10;
    canvas.addEventListener('pointerdown',function(e){ drag=true; lx=e.clientX; canvas.setPointerCapture(e.pointerId); lastInput=clock.elapsedTime; });
    canvas.addEventListener('pointermove',function(e){ if(!drag) return; var dx=e.clientX-lx; lx=e.clientX; spinV=dx*.006; rotY+=dx*.008; lastInput=clock.elapsedTime; });
    canvas.addEventListener('pointerup',function(){ drag=false; }); canvas.addEventListener('pointercancel',function(){ drag=false; });
    function resize(){ var w=stage.clientWidth, h=stage.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
      var d=w/h<1?19:16.5; camera.position.set(0,7.2,d); camera.lookAt(0,1.6,0); }
    resize(); window.addEventListener('resize',resize);
    function frame(dt,t){
      if(!drag){ rotY+=spinV; spinV*=.94; if(t-lastInput>2.5&&!reduce) rotY+=dt*.22; }
      pivot.rotation.y=rotY;
      if(cur&&cur.userData.model.userData.float) cur.userData.model.userData.float.forEach(function(p,k){ p.position.y=.5+k*(.85+.35*(.5+.5*Math.sin(t*.9)))+Math.sin(t*1.3+k)*.04; });
      renderer.render(scene,camera);
    }
    register({frame:frame},stage);
    show(IH.capIndex?IH.capIndex():0);
  })();

  /* =====================================================================
     E · OUR WORK — a corridor of 3D models on plinths. Scrolling flies the
     camera through it; the nearest model turns towards you and is captioned.
     ===================================================================== */
  (function works(){
    var canvas=document.getElementById('galGL'), wbox=document.getElementById('gallery'); if(!canvas||!IH.capB) return;
    var renderer=mkRenderer(canvas,true); renderer.setClearColor(0x000000,0);
    var scene=new T.Scene(); scene.environment=env(renderer); scene.fog=new T.Fog(col('#0b0b0d'),16,70);
    var camera=new T.PerspectiveCamera(42,1,.1,200);
    scene.add(new T.HemisphereLight(col('#f2f2ff'),col('#1a1a1f'),.9));
    var key=new T.DirectionalLight(col('#fff1e2'),1.6); key.position.set(-6,14,10); scene.add(key);
    var rim=new T.DirectionalLight(col('#ff5257'),.6); rim.position.set(8,4,-12); scene.add(rim);
    var SP=11;
    var gp=[]; for(var gx=-24;gx<=24;gx+=2) gp.push(gx,0,14, gx,0,-110); for(var gz=14;gz>=-110;gz-=2) gp.push(-24,0,gz, 24,0,gz);
    var gg=new T.BufferGeometry(); gg.setAttribute('position',new T.Float32BufferAttribute(gp,3)); scene.add(new T.LineSegments(gg,new T.LineBasicMaterial({color:col('#23232a')})));
    var dp=[]; for(var i=0;i<500;i++) dp.push((Math.random()-.5)*44,Math.random()*14,14-Math.random()*124);
    var dg=new T.BufferGeometry(); dg.setAttribute('position',new T.Float32BufferAttribute(dp,3)); var dust=new T.Points(dg,new T.PointsMaterial({color:col('#9a9aa6'),size:.06,transparent:true,opacity:.6})); scene.add(dust);
    // a tensile sail model for the corridor
    function sailModel(){ var g=new T.Group(), steel=std('#1b1d22',{r:.4,m:.6}), fab=std('#ece6d6',{r:.85,side:T.DoubleSide});
      var P=[[-3,-2.2,4.2],[3,-2.2,2.4],[3,2.2,4.4],[-3,2.2,2.6]];
      P.forEach(function(p){ cyl(.08,.1,p[2]+.3,steel,p[0],(p[2]+.3)/2,p[1],g,10); });
      var geo=new T.PlaneGeometry(1,1,20,14), q=geo.attributes.position;
      for(var k=0;k<q.count;k++){ var u=q.getX(k)+.5, v=q.getY(k)+.5, a=new V3().lerpVectors(new V3(P[0][0]+.2,P[0][2],P[0][1]+.2),new V3(P[1][0]-.2,P[1][2],P[1][1]+.2),u), b=new V3().lerpVectors(new V3(P[3][0]+.2,P[3][2],P[3][1]-.2),new V3(P[2][0]-.2,P[2][2],P[2][1]-.2),u), r=new V3().lerpVectors(a,b,v); r.y-=.35*Math.sin(u*Math.PI)*Math.sin(v*Math.PI); q.setXYZ(k,r.x,r.y,r.z); }
      geo.computeVertexNormals(); g.add(new T.Mesh(geo,fab));
      P.forEach(function(p){ var b=box(.5,.1,.5,std('#ce2128',{r:.5}),p[0],.05,p[1],g); }); return g; }
    var plinthM=std('#16161b',{r:.6,m:.2}), edgeM=new T.LineBasicMaterial({color:col('#ffffff'),transparent:true,opacity:.14,depthWrite:false}), redM=new T.MeshBasicMaterial({color:col('#ff5257')});
    var items=IH.PHOTOS.map(function(p,i){
      var g=new T.Group(), m=p.key==='sail'?sailModel():IH.capB[p.key](); m.updateMatrixWorld(true);
      var bb=new T.Box3().setFromObject(m), sz=bb.getSize(new V3()), c=bb.getCenter(new V3()), s=5.2/Math.max(sz.x,sz.z,sz.y*1.2);
      m.scale.setScalar(s); m.position.set(-c.x*s,-bb.min.y*s+.5,-c.z*s); var spin=new T.Group(); spin.add(m); m.updateMatrixWorld(true);
      var e=edges(m,edgeM,30); spin.add(e); g.add(spin);
      var pl=new T.Mesh(new T.CylinderGeometry(3.6,3.8,.5,64),plinthM); pl.position.y=.25; g.add(pl);
      var ring=new T.Mesh(new T.TorusGeometry(3.62,.025,8,96),redM); ring.rotation.x=Math.PI/2; ring.position.y=.51; g.add(ring);
      var hit=new T.Mesh(new T.CylinderGeometry(3.6,3.6,6,16),new T.MeshBasicMaterial({visible:false})); hit.position.y=3; g.add(hit);
      scene.add(g); var it={g:g,spin:spin,ring:ring,hit:hit,p:p,on:true,k:i,pos:new V3(),tgt:new V3(),s:1,ts:1,rot:i*.7}; hit.userData.it=it; return it; });
    var members=items.slice(), mob=false;
    function layout(cat){ members=items.filter(function(it){ return cat==='all'||it.p.cat===cat; });
      items.forEach(function(it){ it.on=members.indexOf(it)>=0; if(!it.on){ it.tgt.y=-8; } });
      members.forEach(function(it,k){ var side=k%2?1:-1; it.k=k; it.tgt.set(side*(mob?2.4:6.4),0,-k*SP); }); }
    IH.gallery={filter:layout};
    var W=1,H=1;
    function curCat(){ var b=document.querySelector('#filters [aria-pressed="true"]'); return b?b.dataset.cat:'all'; }
    function resize(){ W=wbox.clientWidth; H=wbox.clientHeight; renderer.setSize(W,H,false); camera.aspect=W/H; mob=W<760; camera.fov=mob?60:42; camera.updateProjectionMatrix(); layout(curCat()); }
    resize(); items.forEach(function(it){ it.pos.copy(it.tgt); }); window.addEventListener('resize',resize);
    var mp=new T.Vector2(-9,-9), px=0, py=0, tpx=0, tpy=0, drag=false, lx=0, moved=0, dragT=0, ray=new T.Raycaster(), hov=null, travel=0;
    canvas.addEventListener('pointermove',function(e){ var r=canvas.getBoundingClientRect(); mp.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1); tpx=mp.x; tpy=mp.y;
      if(drag){ var dx=e.clientX-lx; lx=e.clientX; moved+=Math.abs(dx); dragT-=dx*.005; } });
    canvas.addEventListener('pointerleave',function(){ mp.set(-9,-9); tpx=tpy=0; drag=false; canvas.classList.remove('is-drag'); });
    canvas.addEventListener('pointerdown',function(e){ drag=true; moved=0; lx=e.clientX; canvas.classList.add('is-drag'); });
    canvas.addEventListener('pointerup',function(){ drag=false; canvas.classList.remove('is-drag'); if(moved<6&&hov&&IH.openWork) IH.openWork(hov.p); });
    var cap=document.getElementById('galCap'), capN=document.getElementById('galCapN'), capT=document.getElementById('galCapT'), capC=document.getElementById('galCapC'), bar=document.getElementById('galBar'), tmp=new V3();
    function frame(dt,t){
      var n=members.length, maxT=Math.max(0,n-1), P=(IH.galP||0)*maxT; dragT=clamp(dragT,-P,maxT-P);
      var now=performance.now(), rdt=Math.min((now-(frame.last||now))/1000,.25); frame.last=now; travel+=(clamp(P+dragT,0,maxT)-travel)*(1-Math.exp(-rdt*5)); px+=(tpx-px)*.05; py+=(tpy-py)*.05;
      var camZ=17-travel*SP; camera.position.set(px*(mob?.8:2),(mob?7.4:6.4)+py*1.2,camZ); camera.lookAt(px*.6,1.6,camZ-17);
      ray.setFromCamera(mp,camera); var hits=ray.intersectObjects(members.map(function(it){ return it.hit; })); hov=hits.length?hits[0].object.userData.it:null; canvas.classList.toggle('is-hov',!!hov);
      camera.updateMatrixWorld(); var best=null, bd=1e9; members.forEach(function(it){ var d=camZ-it.pos.z; if(d<7) return; tmp.set(0,2,0).add(it.pos).project(camera); if(tmp.z>1||Math.abs(tmp.x)>.82||tmp.y<-.8||tmp.y>.9) return; var sc=Math.abs(d-(mob?11:15)); if(sc<bd){ bd=sc; best=it; } });
      var focus=hov||best;
      items.forEach(function(it){
        it.pos.lerp(it.tgt,.07); it.g.position.copy(it.pos);
        var f=it===focus?1:0; it.ts=it.on?(mob?.55:1)*(1+f*.06):.001; it.s+=(it.ts-it.s)*.1; it.g.scale.setScalar(Math.max(.001,it.s));
        it.rot+=dt*(reduce?0:(f?.35:.12)); it.spin.rotation.y=it.rot+(f?Math.atan2(-it.pos.x,8)*.0:0);
        it.ring.material=redM; it.ring.scale.setScalar(1+f*.02); it.g.visible=it.s>.01; });
      dust.rotation.y=reduce?0:t*.01;
      if(focus&&focus.on){ tmp.set(0,6.4*focus.s,0).add(focus.pos).project(camera);
        if(tmp.z<1){ var hw=cap.offsetWidth/2+16; cap.style.transform=mob?'translate('+hw.toFixed(1)+'px,'+(H*.8).toFixed(1)+'px)':'translate('+clamp((tmp.x*.5+.5)*W,hw,W-hw).toFixed(1)+'px,'+Math.max(H*(H<800?.5:.44),(-tmp.y*.5+.5)*H).toFixed(1)+'px)'; cap.classList.add('on');
          capN.textContent=('0'+(focus.k+1)).slice(-2)+' / '+('0'+n).slice(-2); capT.textContent=focus.p.name; capC.textContent=IH.catName(focus.p.cat)+' · Click to view'; } else cap.classList.remove('on'); }
      else cap.classList.remove('on');
      bar.style.transform='scaleX('+(maxT?travel/maxT:1).toFixed(3)+')';
      renderer.render(scene,camera);
    }
    register({frame:frame},wbox);
  })();

  /* =====================================================================
     D · HOW WE WORK — one small 3D object per stage, drawn into the feature card
     and the stage cards from a single canvas (scissor views)
     ===================================================================== */
  (function procGL(){
    var canvas=document.getElementById('procGL'), wrap=document.getElementById('proc'); if(!canvas||!wrap) return;
    var renderer=mkRenderer(canvas,true); renderer.setClearColor(0x000000,0); renderer.autoClear=false;
    var scene=new T.Scene(); scene.environment=env(renderer);
    scene.add(new T.HemisphereLight(col('#ffffff'),col('#b9b2a8'),.75));
    var key=new T.DirectionalLight(col('#fff4ea'),1.5); key.position.set(-4,8,6); scene.add(key);
    var camera=new T.PerspectiveCamera(26,1,.1,100);
    var ink=std('#24262c',{r:.42,m:.55}), ink2=std('#3a3d45',{r:.5,m:.4}), red=std('#ce2128',{r:.38,m:.15}), white=std('#f2f1ed',{r:.6}), paper=std('#ebe4d6',{r:.8}), grey=std('#a9adb5',{r:.45,m:.5}), glass=new T.MeshPhysicalMaterial({color:col('#d9eef7'),roughness:.05,metalness:0,transmission:.6,transparent:true,opacity:.45});
    var M=[];
    // 01 clipboard with the requirement
    M.push(function(){ var g=new T.Group(), b=new T.Group(); g.add(b);
      box(2.2,.12,3,ink,0,0,0,b); box(1.9,.04,2.5,white,0,.08,.12,b); box(.9,.16,.34,red,0,.14,-1.28,b); box(.5,.1,.2,grey,0,.24,-1.28,b);
      [[-.15,1.3],[-.4,1.1],[-.65,1.3],[-.9,.8],[.2,1.2],[.45,.9]].forEach(function(l){ box(l[1],.02,.07,ink2,-.85+l[1]/2,.11,l[0]+.2,b); });
      box(.22,.02,.22,red,.62,.11,.62,b); var pen=cyl(.07,.07,2.2,std('#e9b949',{r:.5}),0,0,0,g,12); pen.rotation.z=Math.PI/2; pen.rotation.y=.6; pen.position.set(.35,.32,.55);
      var tip=new T.Mesh(new T.ConeGeometry(.07,.22,12),paper); tip.rotation.z=Math.PI/2; tip.position.set(-1.21,0,0); pen.add(tip); tip.rotation.z=-Math.PI/2; tip.position.set(0,-1.2,0);
      b.rotation.x=-.5; return g; });
    // 02 survey tripod with a total station
    M.push(function(){ var g=new T.Group(), top=new V3(0,2.4,0);
      for(var k=0;k<3;k++){ var a=k/3*Math.PI*2+.4; member(top,new V3(Math.cos(a)*1.05,0,Math.sin(a)*1.05),.07,k?ink:ink2,g,true); cyl(.05,.09,.12,red,Math.cos(a)*1.05,.06,Math.sin(a)*1.05,g,8); }
      cyl(.36,.36,.14,ink,0,2.46,0,g,24); cyl(.1,.1,.2,grey,0,2.62,0,g,12);
      box(.62,.62,.42,red,0,3.0,0,g); box(.5,.1,.3,ink,0,3.36,0,g);
      var sc=cyl(.15,.17,.8,ink,0,3.02,0,g,20); sc.rotation.x=Math.PI/2; var lens=cyl(.12,.12,.04,glass,0,3.02,.42,g,20); lens.rotation.x=Math.PI/2;
      box(.3,.22,.04,std('#9fd3f0',{e:'#5fb6e8',ei:.6,r:.2}),0,2.98,-.23,g); return g; });
    // 03 drawings, a rolled sheet and a scale rule
    M.push(function(){ var g=new T.Group();
      [[0,0,0,paper],[.12,.04,-.1,white],[.24,.08,-.2,white]].forEach(function(q){ var sh=box(2.6,.03,1.8,q[3],q[0],q[1],q[2],g); sh.rotation.y=q[0]*.6; });
      var top=new T.Group(); top.position.set(.24,.1,-.2); top.rotation.y=.144; g.add(top);
      [[0,-.6,2,.03],[0,.6,2,.03],[-1,0,.03,1.23],[1,0,.03,1.23],[.2,0,.03,1.2],[-.4,.1,1.2,.03]].forEach(function(l){ box(l[2],.012,l[3],l[2]>1||l[3]>1?ink2:red,l[0],0,l[1],top); });
      var roll=cyl(.24,.24,2.5,paper,-.2,.32,.95,g,24); roll.rotation.z=Math.PI/2; var band=cyl(.25,.25,.16,red,0,0,0,roll,24); band.position.y=.5;
      var rule=box(1.8,.06,.22,red,.5,.15,-1.1,g); rule.rotation.y=-.3; return g; });
    // 04 planning board (a programme of bars)
    M.push(function(){ var g=new T.Group(), b=new T.Group(); g.add(b);
      box(3.1,.14,2.3,white,0,0,0,b); box(3.1,.04,.3,ink,0,.09,-1,b);
      [[0,-.6,1.1,ink2],[1,-.25,1.0,red],[2,.2,1.2,ink2],[3,.55,.9,red],[4,.95,.8,ink]].forEach(function(r){ box(r[2],.16,.24,r[3],-1.3+r[1]+r[2]/2+.3,.15,-.62+r[0]*.36,b); });
      box(.04,.3,2,red,.55,.17,.05,b); [-1,-.4,.2,.8,1.4].forEach(function(x){ box(.012,.02,2,grey,x,.08,.1,b); });
      b.rotation.x=-.35; return g; });
    // 05 fabricated I-beam with a welded plate
    M.push(function(){ var g=new T.Group(), sh=new T.Shape(), w=.5, h=.7, tf=.08, tw=.06;
      sh.moveTo(-w,-h); sh.lineTo(w,-h); sh.lineTo(w,-h+tf); sh.lineTo(tw,-h+tf); sh.lineTo(tw,h-tf); sh.lineTo(w,h-tf); sh.lineTo(w,h); sh.lineTo(-w,h); sh.lineTo(-w,h-tf); sh.lineTo(-tw,h-tf); sh.lineTo(-tw,-h+tf); sh.lineTo(-w,-h+tf); sh.closePath();
      var beam=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:3.2,bevelEnabled:false}),ink); beam.position.z=-1.6; beam.rotation.y=Math.PI/2; beam.position.set(-1.6,0,0); g.add(beam);
      box(.06,1.4,1,red,1.63,0,0,g); [[-.3,.45],[.3,.45],[-.3,-.45],[.3,-.45]].forEach(function(b2){ var bo=cyl(.06,.06,.12,grey,1.69,b2[1],b2[0],g,8); bo.rotation.z=Math.PI/2; });
      var sp=new T.Group(); g.add(sp); for(var k=0;k<14;k++){ var m=box(.03,.03,.03,std('#ffb347',{e:'#ff8a1f',ei:2.2}),1.75+Math.random()*.5,-.2+Math.random()*.7,-.5+Math.random()*.4,sp); }
      g.rotation.y=.2; return g; });
    // 06 mobilisation: a truck carrying beams
    M.push(function(){ var g=new T.Group();
      box(1.05,1.05,1.25,red,1.45,.75,0,g); box(.06,.42,1.05,std('#2a3644',{r:.15,m:.3}),1.98,.98,0,g); box(.5,.36,.06,std('#2a3644',{r:.15,m:.3}),1.6,.98,.63,g);
      box(2.7,.16,1.25,ink,-.5,.3,0,g); box(3.8,.12,.2,ink2,0,.18,0,g);
      [[1.45,.55],[1.45,-.55],[-.3,.55],[-.3,-.55],[-1.3,.55],[-1.3,-.55]].forEach(function(w){ var wh=cyl(.27,.27,.2,ink2,w[0],.27,w[1],g,20); wh.rotation.x=Math.PI/2; var hub=cyl(.11,.11,.21,grey,0,0,0,wh,12); });
      [[.3,-.35],[.5,0],[.3,.35],[.6,-.18],[.6,.18]].forEach(function(b2,k){ box(2.8,.16,.16,k%2?grey:std('#55585f',{r:.4,m:.6}),-.55,.38+b2[0]*.5,b2[1],g); });
      box(.05,.6,1.2,ink,.86,.6,0,g); return g; });
    // 07 execution: the steel frame
    M.push(function(){ return IH.capB&&IH.capB.steel?IH.capB.steel():new T.Group(); });
    // 08 inspection: magnifier over a panel with a check
    M.push(function(){ var g=new T.Group();
      var pnl=new T.Group(); g.add(pnl); box(3,.22,1.9,std('#c6cad1',{r:.45,m:.55}),0,0,0,pnl); for(var k=0;k<6;k++) box(.14,.08,1.9,std('#b1b6be',{r:.45,m:.55}),-1.25+k*.5,.15,0,pnl);
      var ck=new T.Group(); ck.position.set(.8,.24,.35); pnl.add(ck); var c1=box(.5,.08,.12,red,-.12,0,.1,ck); c1.rotation.y=-.8; var c2=box(.9,.08,.12,red,.2,0,-.12,ck); c2.rotation.y=.75;
      var mg=new T.Group(); mg.position.set(-.35,1.25,.15); mg.rotation.set(-1.05,0,.35); g.add(mg);
      var rim=new T.Mesh(new T.TorusGeometry(.62,.09,16,48),ink); mg.add(rim); var gl=new T.Mesh(new T.CylinderGeometry(.6,.6,.03,40),glass); gl.rotation.x=Math.PI/2; mg.add(gl);
      var hd=cyl(.09,.11,1.1,red,0,-1.2,0,mg,16); cyl(.12,.12,.16,ink,0,-.66,0,mg,16); return g; });
    // 09 handover: the key
    M.push(function(){ var g=new T.Group(), k=new T.Group(); g.add(k);
      var bow=new T.Mesh(new T.TorusGeometry(.48,.15,18,40),red); bow.position.x=-1.15; k.add(bow);
      var sh=cyl(.11,.11,2.1,red,.1,0,0,k,16); sh.rotation.z=Math.PI/2; [[.75,.3],[.95,.22],[1.12,.36]].forEach(function(t){ box(.14,t[1],.12,red,t[0],-t[1]/2-.05,0,k); });
      box(.28,.3,.3,red,-.55,0,0,k); var ring=new T.Mesh(new T.TorusGeometry(.26,.035,10,28),grey); ring.position.set(-1.6,-.45,0); ring.rotation.y=Math.PI/2; k.add(ring);
      var tag=box(.62,.9,.04,white,-1.8,-1.15,.05,k); tag.rotation.z=.2; box(.4,.05,.05,ink2,-1.8,-1.05,.08,k); box(.3,.05,.05,ink2,-1.82,-1.2,.08,k);
      k.rotation.set(-.35,.3,-.25); return g; });

    // blob shadow
    var sc=document.createElement('canvas'); sc.width=sc.height=128; var sx=sc.getContext('2d'), gr=sx.createRadialGradient(64,64,4,64,64,62); gr.addColorStop(0,'rgba(20,16,18,.38)'); gr.addColorStop(1,'rgba(20,16,18,0)'); sx.fillStyle=gr; sx.fillRect(0,0,128,128);
    var shTex=new T.CanvasTexture(sc);
    var models=M.map(function(fn){ var raw=fn(), piv=new T.Group(), spin=new T.Group(); raw.updateMatrixWorld(true);
      var bb=new T.Box3().setFromObject(raw), sz=bb.getSize(new V3()), c=bb.getCenter(new V3()), s=2.3/Math.max(sz.x,sz.y,sz.z);
      raw.scale.multiplyScalar(s); raw.position.sub(c.multiplyScalar(s)); spin.add(raw); piv.add(spin);
      var shd=new T.Mesh(new T.PlaneGeometry(2.3,2.3),new T.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false})); shd.rotation.x=-Math.PI/2; shd.position.y=-sz.y*s/2-.18; piv.add(shd);
      piv.visible=false; scene.add(piv); return {piv:piv,spin:spin,shd:shd,base:-sz.y*s/2}; });
    // views
    var featEl=document.getElementById('pfeatObj'), prow=document.getElementById('prow');
    var feat={el:featEl,cur:IH.procActive||0,prev:-1,t:1,yaw:0,drag:0,vy:0};
    var smalls=[].slice.call(document.querySelectorAll('.pcard__obj')).map(function(el){ var card=el.closest('.pcard'); var v={el:el,card:card,m:+el.dataset.m,boost:0,hov:false}; if(canHover){ card.addEventListener('pointerenter',function(){ v.hov=true; }); card.addEventListener('pointerleave',function(){ v.hov=false; }); } return v; });
    var down=false, lx=0;
    featEl.addEventListener('pointerdown',function(e){ down=true; lx=e.clientX; try{ featEl.setPointerCapture(e.pointerId); }catch(_){} });
    featEl.addEventListener('pointermove',function(e){ if(!down) return; var dx=e.clientX-lx; lx=e.clientX; feat.vy=dx*.012; feat.drag+=dx*.012; });
    function up(){ down=false; } featEl.addEventListener('pointerup',up); featEl.addEventListener('pointercancel',up);
    var W=1,H=1,cr=null;
    function resize(){ W=wrap.clientWidth; H=wrap.clientHeight; renderer.setSize(W,H,false); }
    resize(); if('ResizeObserver' in window) new ResizeObserver(resize).observe(wrap); else window.addEventListener('resize',resize);
    function view(r,clip,vis,dist){
      var x=r.left-cr.left, y=r.top-cr.top, w=r.width, h=r.height; if(w<4||h<4) return;
      var cx0=Math.max(x,clip.left-cr.left), cy0=Math.max(y,clip.top-cr.top), cx1=Math.min(x+w,clip.right-cr.left), cy1=Math.min(y+h,clip.bottom-cr.top); if(cx1<=cx0||cy1<=cy0) return;
      renderer.setViewport(x,H-y-h,w,h); renderer.setScissor(cx0,H-cy1,cx1-cx0,cy1-cy0); renderer.setScissorTest(true);
      camera.aspect=w/h; var fit=dist/Math.min(1,camera.aspect*.9); camera.position.set(0,Math.sin(.42)*fit,Math.cos(.42)*fit); camera.lookAt(0,-.05,0); camera.updateProjectionMatrix();
      models.forEach(function(m){ m.piv.visible=false; }); vis(); renderer.render(scene,camera);
    }
    function frame(dt,t){
      cr=canvas.getBoundingClientRect(); renderer.setScissorTest(false); renderer.clear();
      var a=IH.procActive||0; if(a!==feat.cur){ feat.prev=feat.cur; feat.cur=a; feat.t=0; }
      feat.t=Math.min(1,feat.t+dt*2.2); if(!down){ feat.drag+=feat.vy; feat.vy*=.92; }
      var idle=reduce?0:t*.35;
      var fr=featEl.getBoundingClientRect();
      view(fr,cr,function(){ var e=ease(feat.t), m=models[feat.cur];
        m.piv.visible=true; m.piv.scale.setScalar(.2+.8*e); m.spin.rotation.y=idle+feat.drag-(1-e)*2.4; m.piv.position.y=(reduce?0:Math.sin(t*1.3)*.06)+(1-e)*.5; m.shd.material.opacity=e;
        if(feat.prev>=0&&feat.t<1&&feat.prev!==feat.cur){ var p=models[feat.prev]; p.piv.visible=true; p.piv.scale.setScalar(Math.max(.001,1-e*1.4)); p.spin.rotation.y=idle+feat.drag+e*2.4; p.piv.position.y=-e*.6; p.shd.material.opacity=1-e; }
      },5.9);
      var pr0=prow.getBoundingClientRect(), pl=parseFloat(getComputedStyle(prow).paddingLeft), pr={left:pr0.left+pl,right:pr0.right,top:pr0.top,bottom:pr0.bottom};
      smalls.forEach(function(v){ if(v.card.classList.contains('is-cur')) return; v.boost+=((v.hov?1:0)-v.boost)*.08;
        view(v.el.getBoundingClientRect(),pr,function(){ var m=models[v.m]; m.piv.visible=true; m.piv.scale.setScalar(1+v.boost*.08); m.piv.position.y=v.boost*.12; m.spin.rotation.y=-.6+(reduce?0:Math.sin(t*.6+v.m)*.35)+v.boost*1.2; m.shd.material.opacity=1; },4.6); });
      renderer.setScissorTest(false);
    }
    register({frame:frame},wrap);
  })();

  /* =====================================================================
     F · QUALITY + SAFETY + COMMUNICATION — three interlocking rings
     ===================================================================== */
  /* F · quality/safety is now a light SVG diagram (see main.js) */

  /* =====================================================================
     G · the logo's infinity mark, extruded
     ===================================================================== */
  (function mark(){
    var canvas=document.getElementById('markGL'), box=document.getElementById('markWrap');
    if(!T.SVGLoader) return;
    var renderer=mkRenderer(canvas,true); renderer.setClearColor(0x000000,0);
    var scene=new T.Scene(); scene.environment=env(renderer);
    var camera=new T.PerspectiveCamera(26,2,.1,100); camera.position.set(0,0,12);
    var d=new T.DirectionalLight(0xffffff,1.4); d.position.set(-4,6,8); scene.add(d); scene.add(new T.AmbientLight(0xffffff,.25));
    var data=new T.SVGLoader().parse('<svg xmlns="http://www.w3.org/2000/svg"><path d="'+IH.MARK+'"/></svg>');
    var shapes=[]; data.paths.forEach(function(p){ shapes=shapes.concat(T.SVGLoader.createShapes(p)); });
    var geo=new T.ExtrudeGeometry(shapes,{depth:60,bevelEnabled:true,bevelThickness:10,bevelSize:6,bevelSegments:5,curveSegments:48});
    geo.center(); geo.computeBoundingBox();
    var w=geo.boundingBox.max.x-geo.boundingBox.min.x, s=7.4/w;
    var mesh=new T.Mesh(geo,new T.MeshPhysicalMaterial({color:col('#ce2128'),metalness:.3,roughness:.22,clearcoat:1,clearcoatRoughness:.12}));
    mesh.scale.set(s,-s,s); var grp=new T.Group(); grp.add(mesh); scene.add(grp);
    var mx=0,my=0; window.addEventListener('pointermove',function(e){ mx=e.clientX/innerWidth-.5; my=e.clientY/innerHeight-.5; },{passive:true});
    function resize(){ var W=box.clientWidth, H=box.clientHeight; renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix(); }
    resize(); window.addEventListener('resize',resize);
    function frame(dt,t){ grp.rotation.y+=((reduce?0:Math.sin(t*.5)*.35)+mx*.9-grp.rotation.y)*.06; grp.rotation.x+=(my*.5+(reduce?0:Math.sin(t*.4)*.08)-grp.rotation.x)*.06; grp.position.y=reduce?0:Math.sin(t*.8)*.12; renderer.render(scene,camera); }
    register({frame:frame},box);
  })();
})();
