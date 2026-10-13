/* Infinity Hub Contracting — one WebGL layer, many views. Every model is a coloured 3D build with
   ink edge lines on top, like a coloured architectural illustration. */
(function(){
  var IH=window.IH=window.IH||{}, T=window.THREE, root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  function glOK(){ try{ var c=document.createElement('canvas'); return !!(c.getContext('webgl2')||c.getContext('webgl')); }catch(e){ return false; } }
  if(!T||!glOK()){ if(IH.bootDone) IH.bootDone(); return; }
  var V3=T.Vector3, DPR=Math.min(devicePixelRatio||1,2);
  var canvas=document.getElementById('gl');
  var R=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,premultipliedAlpha:false});
  R.setPixelRatio(DPR); R.setClearColor(0x000000,0); R.autoClear=false;
  function size(){ R.setSize(innerWidth,innerHeight,false); } size(); addEventListener('resize',size);

  /* ---------- shaders ---------- */
  var INK=new T.Color(0x282828), RED=new T.Color(0xfa3600);
  var fillVS='varying vec3 vN; varying vec3 vW; void main(){ vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }';
  var fillFS='uniform vec3 uCol; uniform vec3 uL; uniform float uFill; uniform float uClip; uniform float uDot; uniform float uRed; uniform float uOp;\n'+
    'varying vec3 vN; varying vec3 vW;\n'+
    'float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }\n'+
    'void main(){ if(vW.y<uClip) discard; vec3 n=normalize(vN); if(!gl_FrontFacing) n=-n;\n'+
    ' float lam=max(dot(n,normalize(uL)),0.0), sky=n.y*0.5+0.5; vec2 c=floor(gl_FragCoord.xy/uDot);\n'+
    ' float fz=step(h(c+17.3),uFill);\n'+
    ' vec3 base=uRed>0.5?vec3(0.98,0.21,0.0):uCol;\n'+
    ' vec3 col=base*(uRed>0.5?(0.82+0.2*lam):(0.5+0.38*lam+0.17*sky));\n'+
    ' col*=1.0+(h(c+3.7)-0.5)*0.06;\n'+
    ' gl_FragColor=vec4(col,fz*uOp); }';
  var lineVS='attribute float lineDistance; varying float vD; varying float vY; void main(){ vD=lineDistance; vec4 w=modelMatrix*vec4(position,1.0); vY=w.y; gl_Position=projectionMatrix*viewMatrix*w; }';
  var lineFS='uniform vec3 uInk; uniform float uA; uniform float uClip; uniform float uDash; varying float vD; varying float vY;\n'+
    'void main(){ if(vY<uClip) discard; if(uDash>0.0 && mod(vD,uDash*2.0)>uDash) discard; gl_FragColor=vec4(uInk,uA); }';
  var LIGHT=new V3(-.45,.85,.6);
  function fillMat(col,red,op){ return new T.ShaderMaterial({uniforms:{uCol:{value:new T.Color(col)},uL:{value:LIGHT},uFill:{value:1},uClip:{value:-1e4},uDot:{value:1.1*DPR},uRed:{value:red?1:0},uOp:{value:op==null?1:op}},
      vertexShader:fillVS,fragmentShader:fillFS,transparent:true,depthWrite:true,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,side:T.DoubleSide}); }
  function lineMat(a,dash,hidden,col){ var m=new T.ShaderMaterial({uniforms:{uInk:{value:(col||INK).clone()},uA:{value:a},uClip:{value:-1e4},uDash:{value:dash||0}},vertexShader:lineVS,fragmentShader:lineFS,transparent:true,depthWrite:false});
    if(hidden) m.depthFunc=T.GreaterDepth; return m; }

  /* ---------- paint + geometry helpers ---------- */
  // P(colour[,opacity]) sets the paint for the following shapes; NS keeps one scene's materials separate from another's
  var PAINT='#e9e2d4', OP=1, NS='', mats={};
  function P(c,op){ PAINT=c; OP=op==null?1:op; }
  function M(t,red){ var k=NS+'|'+PAINT+'|'+OP+'|'+(red?1:0); return mats[k]||(mats[k]=fillMat(PAINT,red,OP)); }
  function box(w,h,d,t,x,y,z,p,red){ var m=new T.Mesh(new T.BoxGeometry(w,h,d),M(t,red)); m.position.set(x,y,z); p.add(m); return m; }
  function boxA(x0,y0,z0,x1,y1,z1,t,p,red){ return box(x1-x0,y1-y0,z1-z0,t,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,p,red); }
  function cyl(r,h,t,x,y,z,p,seg){ var m=new T.Mesh(new T.CylinderGeometry(r,r,h,seg||18),M(t)); m.position.set(x,y,z); p.add(m); return m; }
  function member(a,b,th,t,p,round){ var d=new V3().subVectors(b,a), L=d.length();
    var m=new T.Mesh(round?new T.CylinderGeometry(th,th,L,8):new T.BoxGeometry(th,L,th),M(t)); m.position.copy(a).addScaledVector(d,.5); m.quaternion.setFromUnitVectors(new V3(0,1,0),d.normalize()); p.add(m); return m; }
  function sail(c0,c1,c2,c3,t,p,sag,red){ var g=new T.PlaneGeometry(1,1,16,10), q=g.attributes.position;
    for(var i=0;i<q.count;i++){ var u=q.getX(i)+.5, v=q.getY(i)+.5, a=new V3().lerpVectors(c0,c1,u), b=new V3().lerpVectors(c3,c2,u), r=new V3().lerpVectors(a,b,v); r.y-=(sag||0)*Math.sin(u*Math.PI)*Math.sin(v*Math.PI); q.setXYZ(i,r.x,r.y,r.z); }
    g.computeVertexNormals(); var m=new T.Mesh(g,M(t,red)); m.userData.edgeT=40; p.add(m); return m; }
  function car(x,z,rot,p,s,col){ var g=new T.Group(), keep=PAINT; col=col||'#b8352c';
    P(col); box(4.3,.75,1.8,0,0,.65,0,g); P('#5d7d93'); box(2.4,.6,1.62,0,-.2,1.3,0,g); P(col); box(2.3,.08,1.66,0,-.2,1.63,0,g);
    P('#26282a'); [[-1.4,.82],[1.4,.82],[-1.4,-.82],[1.4,-.82]].forEach(function(w){ var c=cyl(.36,.26,0,w[0],.36,w[1],g,12); c.rotation.x=Math.PI/2; });
    g.position.set(x,0,z); g.rotation.y=rot||0; g.scale.setScalar(s||1); p.add(g); P(keep); return g; }
  // one set of edge lines for a whole group
  function ink(group,opt){ opt=opt||{}; group.updateMatrixWorld(true); var pos=[], inv=new T.Matrix4().copy(group.matrixWorld).invert(), v=new V3();
    group.traverse(function(o){ if(!o.isMesh||o.userData.noEdge) return; var e=new T.EdgesGeometry(o.geometry,o.userData.edgeT||opt.thr||22), a=e.attributes.position;
      var mw=new T.Matrix4().multiplyMatrices(inv,o.matrixWorld); for(var i=0;i<a.count;i++){ v.fromBufferAttribute(a,i).applyMatrix4(mw); pos.push(v.x,v.y,v.z); } e.dispose(); });
    var g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
    var vis=new T.LineSegments(g,lineMat(opt.a!=null?opt.a:.7)); group.add(vis);
    var hid=null; if(opt.hidden){ hid=new T.LineSegments(g.clone(),lineMat(opt.ha||.3,opt.dash||.12,true)); hid.computeLineDistances(); group.add(hid); }
    return {vis:vis,hid:hid}; }
  // edge lines attached to every mesh, so they follow it when it moves, scales or hides
  function inkEach(group,a,thr){ var mat=lineMat(a||.6), list=[]; group.traverse(function(o){ if(o.isMesh&&!o.userData.noEdge) list.push(o); });
    list.forEach(function(o){ o.add(new T.LineSegments(new T.EdgesGeometry(o.geometry,o.userData.edgeT||thr||24),mat)); }); return mat; }
  // tree: branching trunk line work with low-poly foliage clouds
  function tree(x,z,h,a,seed,p){ var pts=[], tips=[], rnd=(function(s){ return function(){ s=(s*9301+49297)%233280; return s/233280; }; })(seed);
    function br(o,dir,len,d){ var e=o.clone().addScaledVector(dir,len); pts.push(o.x,o.y,o.z,e.x,e.y,e.z); if(d<=0){ tips.push(e); return; }
      var n=d>4?2:(rnd()<.6?2:3); for(var i=0;i<n;i++){ var nd=dir.clone().add(new V3(rnd()-.5,rnd()*.5,rnd()-.5).multiplyScalar(1.9)); nd.y=Math.max(nd.y,.12); nd.normalize(); br(e,nd,len*(.66+rnd()*.14),d-1); } }
    var tk=new V3(x,0,z), tt=new V3(x+.15,h*.2,z); pts.push(tk.x,tk.y,tk.z,tt.x,tt.y,tt.z); br(tt,new V3(.1,1,.05).normalize(),h*.19,6);
    var g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(pts,3)); p.add(new T.LineSegments(g,lineMat(a,0,false,new T.Color(0x4a3a2a))));
    var greens=['#7f9e5a','#6c8c4a','#93ad6a'];
    for(var k=0;k<7;k++){ var t=tips[Math.floor(rnd()*tips.length)]; P(greens[k%3],.92); var m=new T.Mesh(new T.IcosahedronGeometry(h*(.1+rnd()*.06),0),M(0));
      m.position.copy(t); m.rotation.set(rnd()*3,rnd()*3,0); m.scale.y=.75; m.userData.noEdge=true; p.add(m); } }

  /* ---------- loader: a coloured 3D building assembles itself, stage by stage ---------- */
  (function bootGL(){
    var cv=document.getElementById('bootGL'); if(!cv||!root.classList.contains('booting')) return;
    var BR=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true}); BR.setPixelRatio(DPR); BR.setClearColor(0x000000,0);
    var sc=new T.Scene(), cam=new T.PerspectiveCamera(28,1,.5,400), tgt=new V3(0,3.4,0);
    var parts=[];
    function part(i,build,from){ NS='boot'+i; var g=new T.Group(); build(g); ink(g,{a:.75}); g.userData.from=from||3.2; sc.add(g); parts[i]=g; return g; }
    // 001 the ground slab lands
    part(0,function(g){ P('#ddd5c4'); box(17,.5,11,0,0,.25,0,g); P('#cfc6b3'); box(6,.12,3.4,0,5.2,.56,3.2,g); });
    // 002 setting out: red pegs on the grid
    part(1,function(g){ [[-6.6,-4],[6.6,-4],[-6.6,3.6],[6.6,3.6],[0,-4],[0,3.6]].forEach(function(q){ box(.22,.9,.22,0,q[0],.95,q[1],g,true); }); });
    // 003 columns rise
    part(2,function(g){ P('#3b4048'); [-6.4,-2.1,2.1,6.4].forEach(function(x){ [-3.6,3.4].forEach(function(z){ box(.42,3.3,.42,0,x,2.15,z,g); }); }); });
    // 004 first floor slab
    part(3,function(g){ P('#e7e1d3'); box(14.2,.42,8.6,0,0,4,0,g); P('#3b4048'); box(14.4,.12,.2,0,0,3.75,4.32,g); });
    // 005 ground floor walls and glass
    part(4,function(g){ P('#ece5d6'); box(.3,3.3,8,0,-6.9,2.15,0,g); box(13.6,3.3,.3,0,0,2.15,-3.85,g); P('#8fa9b8',.85); for(var k=0;k<4;k++) box(3.1,3,.08,0,-4.8+k*3.25,2.05,3.45,g); P('#3b4048'); box(13.4,.1,.12,0,0,3.6,3.5,g); });
    // 006 upper columns and roof
    part(5,function(g){ P('#3b4048'); [[-6.4,-3.6],[1.4,-3.6],[-6.4,3.4],[1.4,3.4]].forEach(function(q){ box(.38,3,.38,0,q[0],5.7,q[1],g); }); P('#e7e1d3'); box(9.4,.42,8.6,0,-2.5,7.4,0,g); });
    // 007 upper walls, ribbon window and terrace rail
    part(6,function(g){ P('#d9cdb6'); box(8.6,1,.28,0,-2.5,4.75,3.5,g); box(8.6,.7,.28,0,-2.5,6.85,3.5,g); box(.3,2.9,7.6,0,-6.8,5.75,0,g); P('#8fa9b8',.85); box(8.4,1.4,.08,0,-2.5,5.95,3.45,g); P('#3b4048'); box(4.6,.06,.06,0,4.6,5,4.1,g); box(.06,.9,.06,0,2.4,4.65,4.1,g); box(.06,.9,.06,0,6.8,4.65,4.1,g); });
    // 008 the shade canopy over the terrace
    part(7,function(g){ P('#3b4048'); [[2.6,-3.4],[6.8,-3.4],[2.6,3.6],[6.8,3.6]].forEach(function(q,k){ box(.16,k%2?3.2:2.6,.16,0,q[0],4.2+(k%2?1.6:1.3),q[1],g); }); P('#fbf6ea'); sail(new V3(2.6,6.9,-3.4),new V3(6.8,7.6,-3.4),new V3(6.8,7.6,3.6),new V3(2.6,6.9,3.6),0,g,.35); },4);
    // 009 landscape
    part(8,function(g){ tree(-8.2,4.2,4.4,.55,7,g); tree(8.4,-4.6,3.8,.55,13,g); P('#9fb07c'); box(5,.25,1.2,0,-3.5,.62,4.6,g); });
    // 010 the sun rises
    var sun=part(9,function(g){ var m=new T.Mesh(new T.SphereGeometry(1.25,32,20),M(0,true)); m.position.set(-9,11.5,-8); m.userData.noEdge=true; g.add(m); },-6);
    parts.forEach(function(g){ g.userData.y0=g.position.y; });
    var W=1,H=1; function resize(){ W=cv.clientWidth; H=cv.clientHeight; BR.setSize(W,H,false); cam.aspect=W/H; cam.updateProjectionMatrix(); }
    resize(); addEventListener('resize',resize);
    var ready=false; Promise.all([document.fonts?document.fonts.ready:0,new Promise(function(r){ if(document.readyState==='complete') r(); else addEventListener('load',r); setTimeout(r,7000); })]).then(function(){ ready=true; });
    var t0=performance.now(), last=t0, shown=0, MIN=reduce?600:3600, doneAt=0, fired=false;
    function ez(x){ x=Math.max(0,Math.min(1,x)); return 1-Math.pow(1-x,3); }
    (function loop(now){ if(!root.classList.contains('booting')){ BR.dispose(); return; }
      var dt=Math.max(0,Math.min(.05,(now-last)/1000||0)); last=Math.max(last,now); var el=Math.max(0,now-t0);
      var target=Math.min(el/MIN,ready?1:.92); shown+=(target-shown)*Math.min(1,dt*6); if(target-shown<.002) shown=target;
      IH.bootProgress&&IH.bootProgress(shown);
      parts.forEach(function(g,i){ var q=ez((shown*10-i)/1.15), f=g.userData.from; g.position.y=g.userData.y0+(1-q)*f; g.visible=q>0;
        if(i===1){ var gone=ez((shown*10-3.4)/.9); q=q*(1-gone); g.visible=q>.01; }
        g.traverse(function(o){ var u=o.material&&o.material.uniforms; if(!u) return; if(u.uFill) u.uFill.value=Math.min(1,q*1.15); if(u.uA) u.uA.value=.75*Math.min(1,q*2.2); }); });
      var yaw=-.75+shown*.55+(reduce?0:Math.sin(el/2600)*.05), elev=.42-shown*.08, d=W<700?Math.max(96,58/(W/H)):(H<800?60:54);
      orbit(cam,tgt,yaw,elev,d); cam.setViewOffset(W,H,0,W<700?H*.02:H*.06,W,H);
      BR.render(sc,cam);
      if(shown>=1){ if(!doneAt) doneAt=now; if(now-doneAt>450&&!fired){ fired=true; IH.bootDone&&IH.bootDone(); } }
      requestAnimationFrame(loop); })(t0);
  })();
  NS='';

  /* ---------- views ---------- */
  var views=[];
  function view(el,o){ o.el=el; o.scene=o.scene||new T.Scene(); views.push(o); return o; }
  function rect(el){ return el.getBoundingClientRect(); }
  function setU(group,name,val){ group.traverse(function(o){ if(o.material&&o.material.uniforms&&o.material.uniforms[name]) o.material.uniforms[name].value=val; }); }
  function placeAt(node,pt,cam,r,host){ var tmp=placeAt.v||(placeAt.v=new V3()); tmp.copy(pt).project(cam); var hr=host.getBoundingClientRect();
    node.style.transform='translate('+((tmp.x*.5+.5)*r.width+r.left-hr.left)+'px,'+((-tmp.y*.5+.5)*r.height+r.top-hr.top)+'px)'; }
  function orbit(cam,tgt,yaw,el,d){ cam.position.set(tgt.x+Math.sin(yaw)*Math.cos(el)*d,tgt.y+Math.sin(el)*d,tgt.z+Math.cos(yaw)*Math.cos(el)*d); cam.lookAt(tgt); }
  function fitOrtho(cam,r,hh,minHw,sx,sy){ var a=r.width/r.height; if(minHw&&hh*a<minHw) hh=minHw/a; var hw=hh*a; sx=sx||0; sy=sy||0; cam.left=-hw-sx*hw; cam.right=hw-sx*hw; cam.top=hh-sy*hh; cam.bottom=-hh-sy*hh; cam.updateProjectionMatrix(); }
  var NARROW=function(){ return innerWidth<=820; };

  /* ===== A · hero: the villa elevation ===== */
  (function(){
    var el=document.getElementById('vHero'); if(!el) return;
    NS='hero'; var sc=new T.Scene(), g=new T.Group(); sc.add(g);
    P('#e6d8bf'); boxA(-19,-.06,-12,19,0,2,0,g).userData.noEdge=true;              // ground
    P('#d6c8ae'); boxA(-12.5,0,-10,13,.8,0,0,g);                                    // stone plinth
    P('#efe6d6'); boxA(-12,.8,-9,-5,7.8,-1,0,g);                                    // left wing
    P('#9a6a3f'); boxA(-12.05,1.2,-1.02,-8.4,3.8,-.98,0,g);                         // timber cladding panel
    P('#6f93ab'); boxA(-11.4,4.4,-1.05,-5.6,6.2,-.95,0,g); boxA(-7.8,1.6,-1.05,-5.6,3.4,-.95,0,g);   // windows
    P('#efe6d6'); boxA(5,.8,-8,12,6.3,-2,0,g);                                      // right wing
    P('#6f93ab'); boxA(5.6,2,-2.05,11.4,4.6,-1.95,0,g);
    P('#86aac0',.88); boxA(-5,.8,-7,5,8,-3,0,g);                                    // glass volume
    P('#2f3439'); for(var mx=-5;mx<=5.01;mx+=1.25) boxA(mx-.06,.8,-2.98,mx+.06,8,-2.9,0,g);
    boxA(-5,4.3,-2.98,5,4.45,-2.9,0,g);
    P('#cfc7b9'); boxA(-6,4.2,-8.5,6.5,4.6,.6,0,g); boxA(-6.2,8,-8,6.2,8.45,-2.2,0,g); // slabs
    P('#8a5a36'); boxA(-3.4,.8,-2.7,-3,10.6,-1.8,0,g); boxA(3,.8,-2.7,3.4,10.6,-1.8,0,g); // timber blade fins
    P('#2f3439'); [[5.6,-7.4],[11.4,-7.4],[5.6,-2.6],[11.4,-2.6]].forEach(function(c){ boxA(c[0]-.08,6.3,c[1]-.08,c[0]+.08,8.4,c[1]+.08,0,g); });
    boxA(5.4,8.4,-7.6,11.6,8.55,-7.3,0,g); boxA(5.4,8.4,-2.7,11.6,8.55,-2.4,0,g);
    P('#b07a47'); for(var sx=5.8;sx<=11.3;sx+=.55) boxA(sx-.05,8.55,-7.7,sx+.05,8.65,-2.3,0,g);
    P('#ddd1bb'); for(var s=0;s<6;s++) boxA(-17+s*.8,0,-6,-12.5,.14+s*.135,-1.5,0,g);   // entrance steps
    P('#bfb39d'); boxA(12,0,-3.5,15.5,1.7,0,0,g);                                    // planter wall
    P('#6f8f4c'); boxA(12.15,1.7,-3.35,15.35,2.35,-.15,0,g);                          // hedge
    P('#3a3f45'); member(new V3(17,0,-6),new V3(17,4.2,-6),.22,0,g); member(new V3(17,4.2,-6),new V3(17,3.6,.5),.18,0,g);
    P('#ce2128'); sail(new V3(15,4.25,-6.2),new V3(19,4.25,-6.2),new V3(19,3.65,.6),new V3(15,3.65,.6),0,g,.15);   // shade fabric
    car(17,-2,0,g,.7,'#3f6280');
    var lw=ink(g,{a:.62,thr:18});
    var trees=new T.Group(); g.add(trees);
    tree(-16.2,-4,10,.75,7,trees); tree(-14.4,-7,8,.45,3,trees); tree(15.2,-6,9,.7,11,trees); tree(13.6,-8,7.5,.45,5,trees);
    NS='';
    var cam=new T.OrthographicCamera(-1,1,1,-1,.1,200); var tgt=new V3(0,4.6,-4);
    var anchors=[new V3(-4.4,2.6,-2.85),new V3(8.6,7.4,-2.5)];
    var marksWrap=document.getElementById('heroMarks'), LABELS=[['C2 · Interior fit-out','#cap-fitout'],['C3 · Steel pergola','#cap-steel']];
    var marks=LABELS.map(function(l){ var a=document.createElement('a'); a.className='hero__mark mono'; a.href=l[1]; a.innerHTML='<i></i><span>'+l[0]+'</span>'; marksWrap.appendChild(a); return a; });
    var yaw=0, yawT=0, pitch=.04, px=0, built=1, fill=1, clip=-1e4;
    el.addEventListener('pointermove',function(e){ var r=rect(el); px=(e.clientX-r.left)/r.width-.5; },{passive:true});
    el.addEventListener('pointerleave',function(){ px=0; });
    var tmp=new V3(), t0=null;
    view(el,{scene:sc,camera:cam,always:true,frame:function(dt,t,r){
      if(t0===null) t0=t;
      // loader: plot the line work top to bottom, then the colour dissolves in
      if(!built){ var e=t-t0, p=Math.min(1,e/2.2), q=1-Math.pow(1-p,2); clip=11-q*11.2; IH.bootProgress&&IH.bootProgress(Math.min(1,p*.92+(fill*.08)));
        if(p>=1){ fill=Math.min(1,fill+dt*1.4); IH.bootProgress&&IH.bootProgress(.92+fill*.08); if(fill>=1){ built=1; IH.bootDone&&IH.bootDone(); } } }
      setU(g,'uClip',clip); setU(g,'uFill',fill);
      yawT=(fine?px*.55:0)+(reduce?0:Math.sin(t*.18)*.08); yaw+=(yawT-yaw)*.05;
      var asp=r.width/r.height, hw=asp>1.2?Math.max(26,asp*10.5):19, hh=Math.max(9.2,hw/asp); hw=hh*asp;
      cam.left=-hw; cam.right=hw; cam.top=hh; cam.bottom=-hh; cam.updateProjectionMatrix();
      cam.position.set(tgt.x+Math.sin(yaw)*60,tgt.y+Math.sin(pitch)*60,tgt.z+Math.cos(yaw)*60); cam.lookAt(tgt);
      if(!built&&IH.bootScanY){ tmp.set(0,Math.max(clip,0),0).project(cam); IH.bootScanY(r.top+(-tmp.y*.5+.5)*r.height-8); }
      anchors.forEach(function(a,i){ placeAt(marks[i],a,cam,r,el.parentNode); marks[i].style.transform+=' translate(-5px,-5px)'; marks[i].style.opacity=fill; });
    }});
  })();

  /* ===== capability models ===== */
  var B={};
  B.steel=function(g){ var span=5.6, eave=3, ridge=4.1;
    for(var i=0;i<5;i++){ var x=-4.4+i*2.2;
      P('#4f6274'); member(new V3(x,0,-span/2),new V3(x,eave,-span/2),.22,0,g); member(new V3(x,0,span/2),new V3(x,eave,span/2),.22,0,g);
      member(new V3(x,eave,-span/2),new V3(x,ridge,0),.2,0,g); member(new V3(x,eave,span/2),new V3(x,ridge,0),.2,0,g);
      boxA(x-.25,0,-span/2-.25,x+.25,.08,-span/2+.25,0,g,true); boxA(x-.25,0,span/2-.25,x+.25,.08,span/2+.25,0,g,true); }
    P('#d9a93a'); for(var p=0;p<=4;p++){ var z=span/2*p/4, y=eave+(ridge-eave)*(1-p/4)+.14; member(new V3(-4.6,y,z),new V3(4.6,y,z),.08,0,g); if(p) member(new V3(-4.6,y,-z),new V3(4.6,y,-z),.08,0,g); }
    P('#2b2b2b'); [-span/2,span/2].forEach(function(z){ member(new V3(-4.4,0,z),new V3(-2.2,eave,z),.035,0,g,true); member(new V3(-2.2,0,z),new V3(-4.4,eave,z),.035,0,g,true); });
    // half the roof clad in panels
    var L2=Math.hypot(span/2,ridge-eave), ang=Math.atan2(ridge-eave,span/2);
    [-1,1].forEach(function(sd){ var pn=new T.Group(); pn.position.set(2.75,(eave+ridge)/2+.3,sd*span/4); pn.rotation.x=sd*ang; g.add(pn); P('#c9d3db'); box(3.9,.12,L2,0,0,0,0,pn); P('#9fb0bd'); for(var r=0;r<7;r++) box(.08,.08,L2,0,-1.8+r*.6,.1,0,pn); });
  };
  B.shade=function(g){
    P('#ece9e2'); boxA(-4.2,-.05,-4.2,4.2,0,4.2,0,g).userData.noEdge=true;
    P('#f4f2ec'); [-2.4,0,2.4].forEach(function(x){ boxA(x-.04,0,-3.6,x+.04,.002,3.6,0,g).userData.noEdge=true; });
    [-2.6,2.6].forEach(function(x){ P('#3a3f45'); boxA(x-.12,0,-.12,x+.12,3.3,.12,0,g); boxA(x-.3,0,-.3,x+.3,.06,.3,0,g,true); member(new V3(x,3.3,0),new V3(x,2.85,3.2),.16,0,g); member(new V3(x,3.3,0),new V3(x,2.85,-3.2),.16,0,g); });
    P('#3a3f45'); member(new V3(-2.8,3.35,0),new V3(2.8,3.35,0),.14,0,g);
    P('#e9dcc0',.95); sail(new V3(-3.3,3.42,0),new V3(3.3,3.42,0),new V3(3.3,2.9,3.4),new V3(-3.3,2.9,3.4),0,g,.18);
    sail(new V3(-3.3,3.42,0),new V3(3.3,3.42,0),new V3(3.3,2.9,-3.4),new V3(-3.3,2.9,-3.4),0,g,.18);
    car(-1.3,1.9,Math.PI/2,g,.55,'#b8352c'); car(1.4,1.9,Math.PI/2,g,.55,'#e8e6e0'); car(0,-1.9,Math.PI/2,g,.55,'#3f6280');
  };
  B.fitout=function(g){ P('#c99f6b'); boxA(-3.5,0,-2.7,3.5,.18,2.7,0,g); P('#eee7da'); boxA(-3.5,.18,-2.7,3.5,3.4,-2.5,0,g); boxA(-3.5,.18,-2.5,-3.3,3.4,2.7,0,g);
    P('#f6f3ec'); boxA(-1.6,3.2,-2.1,2.8,3.32,.9,0,g); for(var i=0;i<14;i++){ P(i%2?'#8a5a36':'#a8733f'); boxA(-.8+i*.2-.05,.2,-2.5,-.8+i*.2+.05,2.7,-2.42,0,g); }
    P('#1f2326'); boxA(-.35,1.2,-2.42,1.35,2.15,-2.36,0,g); P('#6b4a2f'); boxA(-.8,.2,-2.45,1.8,.55,-1.95,0,g);
    P('#5d7a6e'); boxA(-.7,.2,.4,1.9,.65,1.4,0,g); boxA(-.7,.65,1.15,1.9,1.2,1.4,0,g); boxA(-.95,.2,.4,-.7,.85,1.4,0,g); boxA(1.9,.2,.4,2.15,.85,1.4,0,g);
    P('#d7c6a8'); boxA(-.5,.2,-.9,1.6,.42,-.1,0,g);
    P('#e3dccd'); boxA(-3.3,.2,-1.3,-2.65,1.1,1.7,0,g); P('#8a5a36'); boxA(-3.32,1.1,-1.32,-2.62,1.15,1.72,0,g); P('#9fb7c4'); boxA(-3.3,1.9,-1.3,-2.92,2.7,1.7,0,g);
    P('#3a3f45'); boxA(2.6,.2,-2.4,2.66,3.2,-.4,0,g); var lamp=new T.Mesh(new T.SphereGeometry(.22,14,10),M(0,true)); lamp.position.set(.6,2.3,.9); lamp.userData.noEdge=true; g.add(lamp); };
  B.mezz=function(g){ [[-2.6,-1.4],[0,-1.4],[2.6,-1.4],[-2.6,1.4],[0,1.4],[2.6,1.4]].forEach(function(c){ P('#3f5a75'); boxA(c[0]-.08,0,c[1]-.08,c[0]+.08,2.6,c[1]+.08,0,g); boxA(c[0]-.2,0,c[1]-.2,c[0]+.2,.05,c[1]+.2,0,g,true); });
    P('#3f5a75'); boxA(-3,2.5,-1.5,3,2.62,1.5,0,g); P('#a7b1b8'); boxA(-3.05,2.62,-1.6,3.05,2.7,1.6,0,g);
    P('#3f5a75'); for(var s=0;s<10;s++) boxA(3.15,.2+s*.25,-1.4+s*.28,4.05,.26+s*.25,-1.1+s*.28,0,g);
    P('#e2b23a'); member(new V3(4.1,1.1,-1.35),new V3(4.1,3.55,1.4),.03,0,g,true);
    [[-3,-1.6,3,-1.6],[-3,-1.6,-3,1.6],[-3,1.6,3,1.6]].forEach(function(r){ member(new V3(r[0],3.6,r[1]),new V3(r[2],3.6,r[3]),.03,0,g,true); });
    for(var q=-3;q<=3;q+=1) member(new V3(q,2.7,-1.6),new V3(q,3.6,-1.6),.02,0,g,true);
    P('#c8955a'); boxA(-2.3,0,-.5,-1.1,.9,.5,0,g); boxA(-2.2,.9,-.45,-1.2,1.6,.45,0,g); boxA(.4,0,-.4,1.6,.9,.6,0,g); P('#ece9e2'); boxA(-3.6,-.04,-2,4.4,0,2,0,g).userData.noEdge=true; };
  B.panel=function(g){ g.userData.float=[]; for(var k=0;k<4;k++){ var p=new T.Group(); p.position.y=.5+k*.85; p.rotation.y=k*.06; g.add(p); g.userData.float.push(p);
      P('#dfe6eb'); box(5.6,.035,1.3,0,0,-.12,0,p); P('#ebc547'); box(5.6,.2,1.3,0,0,0,0,p); P('#dfe6eb'); box(5.6,.035,1.3,0,0,.12,0,p); P('#b9c6cf'); for(var r=0;r<5;r++) box(5.6,.1,.12,0,0,.18,-.52+r*.26,p); } };
  var ringSize=6;
  B.ring=function(g){ var s=ringSize*.62, h=.9; P('#24324d'); boxA(-s/2-.25,0,-s/2-.25,s/2+.25,h,s/2+.25,0,g); P('#3f6280'); boxA(-s/2-.15,h,-s/2-.15,s/2+.15,h+.06,s/2+.15,0,g);
    var logo=new T.Mesh(new T.CircleGeometry(s*.13,40),M(0,true)); logo.rotation.x=-Math.PI/2; logo.position.y=h+.07; logo.userData.noEdge=true; g.add(logo);
    var c=s/2, Pp=[[-c,-c],[c,-c],[c,c],[-c,c]]; P('#d9dde0'); Pp.forEach(function(p,k){ var m=cyl(.08,1.5,0,p[0],h+.75,p[1],g,10); if(k===0) m.material=M(0,true); });
    for(var r=0;r<4;r++){ P(r%2?'#f2f2ee':'#ce2128'); for(var k=0;k<4;k++){ var a=Pp[k],b=Pp[(k+1)%4], y=h+.38+r*.33; member(new V3(a[0],y,a[1]),new V3(b[0],y,b[1]),.025,0,g,true); } }
    P('#3a3f45'); for(var st=0;st<3;st++) boxA(c+.4,0,c-.8-st*.3,c+1.2,.15+st*.28,c-.5-st*.3,0,g); };
  // one stage, one model at a time: the selected capability dissolves in, the previous one dissolves out
  (function(){
    var el=document.querySelector('[data-view="caps"]'); if(!el) return;
    var sc=new T.Scene(), piv=new T.Group(), cache={}, cur=null, prev=null, fadeIn=1, fadeOut=0; sc.add(piv);
    function make(key){ var holder=new T.Group(), model=new T.Group(); NS='cap-'+key+'-'+ringSize; B[key](model); NS=''; model.updateMatrixWorld(true);
      var bb=new T.Box3().setFromObject(model), sz=bb.getSize(new V3()), c=bb.getCenter(new V3()), k=6.4/Math.max(sz.x,sz.z,sz.y*1.3);
      model.scale.setScalar(k); model.position.set(-c.x*k,-bb.min.y*k,-c.z*k); holder.add(model); var L=ink(holder,{a:.55,thr:24}); holder.userData={model:model,lines:L.vis,key:key}; return holder; }
    function get(key){ if(!cache[key]) cache[key]=make(key); return cache[key]; }
    var clockT=0, tOut=0, tIn=-9;
    function show(key){ if(cur&&cur.userData.key===key) return; if(prev) piv.remove(prev); prev=cur; tOut=clockT; cur=get(key); piv.add(cur); fadeIn=0; tIn=-1; }
    IH.capShow=show; show(IH.capKey||'steel');
    IH.ringSize=function(sz){ ringSize=sz; if(cache.ring){ if(cur===cache.ring){ piv.remove(cur); cur=null; } delete cache.ring; } if(!cur||IH.capKey==='ring') show('ring'); };
    var cam=new T.PerspectiveCamera(30,1,.1,100), rotY=-.7, vel=0, drag=false, lx=0, last=-9, clk=0;
    el.addEventListener('pointerdown',function(e){ drag=true; lx=e.clientX; try{ el.setPointerCapture(e.pointerId); }catch(_){} last=clk; });
    el.addEventListener('pointermove',function(e){ if(!drag) return; var dx=e.clientX-lx; lx=e.clientX; vel=dx*.006; rotY+=dx*.008; last=clk; });
    el.addEventListener('pointerup',function(){ drag=false; }); el.addEventListener('pointercancel',function(){ drag=false; });
    function fade(h,v){ setU(h.userData.model,'uFill',v); h.userData.lines.material.uniforms.uA.value=.55*v; }
    view(el,{scene:sc,camera:cam,frame:function(dt,t,r){ clk=t; clockT=t;
      if(!drag){ rotY+=vel; vel*=.94; if(t-last>2.5&&!reduce) rotY+=dt*.2; } piv.rotation.y=rotY;
      if(prev){ fadeOut=Math.max(0,1-(t-tOut)*4); fade(prev,fadeOut); if(fadeOut<=0){ piv.remove(prev); prev=null; } }
      if(cur){ if(!prev){ if(tIn<0) tIn=t; fadeIn=reduce?1:Math.min(1,(t-tIn)*2.4); } fade(cur,fadeIn); var m=cur.userData.model; if(m.userData.float) m.userData.float.forEach(function(p,k){ p.position.y=.5+k*(.85+.3*(.5+.5*Math.sin(t*.9))); }); }
      cam.aspect=r.width/r.height; cam.fov=cam.aspect<1?40:30; cam.updateProjectionMatrix(); var d=cam.aspect<1?17:15.5; cam.position.set(0,6.4,d); cam.lookAt(0,1.7,0); }});
  })();

  /* ===== the floor plan as a coloured 3D model (plan units: 20 = 1 m) ===== */
  var WALLS=IH.WALLS||[];
  function pp(x,y){ return [(x-153)/20,(y-165)/20]; }
  function rectA(x,y,w,d,y0,y1,p,red){ var a=pp(x,y), b=pp(x+w,y+d); return boxA(a[0],y0,a[1],b[0],y1,b[1],0,p,red); }
  function planModel(ns,H){ NS=ns; H=H||1.35; var g=new T.Group(), floor=new T.Group(), det=new T.Group(), walls=[]; g.add(floor); g.add(det);
    P('#e4dccd'); rectA(36,26,234,278,-.18,0,floor);
    [['#d9b88a',46,36,154,84],['#cdd7dc',205,36,55,84],['#e6dac6',46,125,84,75],['#ebe5d9',135,125,125,85],['#d9b88a',46,205,84,89],['#c7ccd0',135,215,125,79]].forEach(function(z){ P(z[0]); rectA(z[1],z[2],z[3],z[4],0,.03,floor).userData.noEdge=true; });
    WALLS.forEach(function(w){ var wg=new T.Group(), a=pp(w[0]+w[2]/2,w[1]+w[3]/2); wg.position.set(a[0],0,a[1]); g.add(wg);
      P('#f3eee5'); box(w[2]/20,H,w[3]/20,0,0,H/2,0,wg); P('#3a3a3a'); box(w[2]/20+.002,.05,w[3]/20+.002,0,0,H+.025,0,wg); walls.push(wg); });
    // glazing in the wall gaps
    P('#8fb3c9',.75); [[95,31,20,4,'x'],[200,31,20,4,'x'],[160,295,20,4,'x'],[41,100,4,20,'z'],[261,140,4,20,'z']].forEach(function(o){ rectA(o[0],o[1],o[2],o[3],.45,H*.92,det); });
    // doors (open leaves)
    P('#9a6a3f'); [[80,294,-1],[46,230,1],[136,125,1],[195,215,1]].forEach(function(d,i){ var a=pp(d[0],d[1]), leaf=new T.Group(); leaf.position.set(a[0],0,a[1]); leaf.rotation.y=(i%2?1:-1)*.9; box(.05,H*.86,.95,0,0,H*.43,.48,leaf); det.add(leaf); });
    // bedroom
    P('#cfc6b6'); rectA(56,44,60,40,.03,.3,det); P('#f5f2ea'); rectA(58,46,56,36,.3,.42,det); P('#4f7590'); rectA(58,58,56,24,.42,.46,det); P('#ffffff'); rectA(60,47,24,9,.42,.52,det); rectA(88,47,24,9,.42,.52,det);
    // dining
    P('#8a5a36'); rectA(216,56,30,48,.03,.55,det); P('#2f3a44'); [62,74,86,98].forEach(function(y){ rectA(209,y-4,5,8,.03,.6,det); rectA(248,y-4,5,8,.03,.6,det); });
    // office desks + chairs
    for(var dr=0;dr<3;dr++) for(var dc=0;dc<2;dc++){ P('#c79a63'); rectA(56+dc*36,140+dr*18,30,8,.03,.5,det); P('#3e5566'); var c=pp(71+dc*36,155+dr*18); cyl(.16,.35,0,c[0],.2,c[1],det,10); }
    // stair
    P('#bfb6a6'); for(var st=0;st<7;st++) rectA(140,132+st*7,20,7,.03,.1+st*.12,det);
    // storage racks with cartons
    for(var rk=0;rk<4;rk++){ P('#4f6d8a'); rectA(146+rk*28,226,20,58,.03,1.05,det); P('#c8955a'); rectA(147+rk*28,232,18,20,1.05,1.25,det); rectA(147+rk*28,258,18,20,1.05,1.2,det); }
    // living
    P('#5d7a6e'); rectA(150,170,46,14,.03,.38,det); rectA(150,184,46,5,.03,.6,det); P('#d7c6a8'); rectA(160,148,26,14,.03,.3,det);
    inkEach(g,.42,26); NS='';
    return {g:g,floor:floor,det:det,walls:walls}; }

  // pinned plan: walls rise as you scroll, the camera turns slowly
  (function(){
    var el=document.getElementById('plan'); if(!el||!WALLS.length) return;
    var sc=new T.Scene(), m=planModel('pin'); sc.add(m.g);
    var cam=new T.OrthographicCamera(-1,1,1,-1,.1,200), tgt=new V3(0,.4,0), px=0, yaw=.55;
    el.addEventListener('pointermove',function(e){ var r=rect(el); px=(e.clientX-r.left)/r.width-.5; },{passive:true});
    var S=IH.plan||(IH.plan={w:[],d:0,f:0,p:0}), mk=IH.planMarks||[];
    view(el,{scene:sc,camera:cam,frame:function(dt,t,r){
      setU(m.floor,'uFill',S.f); m.floor.visible=S.f>0;
      m.walls.forEach(function(w,i){ var v=S.w[i]||0; w.visible=v>.01; w.scale.y=Math.max(.001,v); });
      m.det.visible=S.d>.01; m.det.scale.y=Math.max(.001,S.d);
      var yt=.55+S.p*.7+(fine?px*.35:0); yaw+=(yt-yaw)*.06;
      fitOrtho(cam,r,r.width>820?9.6:10.5,12.5); orbit(cam,tgt,yaw,.98-S.p*.12,50);
      mk.forEach(function(o){ var a=pp(o.x,o.y); placeAt(o.el,new V3(a[0],1.9,a[1]),cam,r,el); });
    }});
  })();

  /* ===== how we work: one coloured 3D scene per step ===== */
  function stepView(i,frame,scene,cam){ var el=document.querySelector('[data-view="step'+i+'"]'); if(!el) return; var v=view(el,{scene:scene,camera:cam,frame:frame}); v.gate=el.closest('.stepdraw'); return v; }
  // 1 · site survey: the plan with a survey sweep and the room under assessment outlined
  (function(){ var sc=new T.Scene(), m=planModel('s0',1.2); sc.add(m.g);
    var sweep=new T.Mesh(new T.PlaneGeometry(14,2.2),new T.MeshBasicMaterial({color:0xfa3600,transparent:true,opacity:.16,side:T.DoubleSide,depthWrite:false})); sweep.rotation.y=Math.PI/2; sweep.position.y=1.1; sc.add(sweep);
    var a=pp(46,125), b=pp(130,200), ol=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(b[0]-a[0]+.2,1.6,b[1]-a[1]+.2)),lineMat(.95,.14,false,RED)); ol.computeLineDistances(); ol.position.set((a[0]+b[0])/2,.8,(a[1]+b[1])/2); sc.add(ol);
    var cam=new T.OrthographicCamera(-1,1,1,-1,.1,200), tgt=new V3(0,.3,0);
    stepView(0,function(dt,t,r){ sweep.position.x=-6.5+((t*.18)%1)*13; fitOrtho(cam,r,9.5,11.5,NARROW()?-.1:0,NARROW()?.08:0); orbit(cam,tgt,.6+Math.sin(t*.25)*.12,1.0,50); },sc,cam); })();
  // 2 · scope & proposal: three floating drawing sheets, each carrying a model
  (function(){ var el=document.querySelector('[data-view="step1"]'); if(!el) return; var sc=new T.Scene(), stack=new T.Group(); sc.add(stack);
    var names=['Steel structure plan','Shade layout','Fit-out plan'], keys=['steel','shade','fitout'], sheets=[], labels=[];
    keys.forEach(function(k,i){ var s=new T.Group(); s.position.set(i*.35,i*2.3,-i*.2); stack.add(s); NS='sheet';
      P('#fbfaf5'); var paper=box(6.2,.08,4.4,0,0,0,0,s); var mdl=new T.Group(); B[k](mdl); mdl.updateMatrixWorld(true);
      var bb=new T.Box3().setFromObject(mdl), sz=bb.getSize(new V3()), c=bb.getCenter(new V3()), sk=Math.min(4.6/sz.x,3.2/sz.z,1.9/sz.y);
      mdl.scale.setScalar(sk); mdl.position.set(-c.x*sk,.04-bb.min.y*sk,-c.z*sk); s.add(mdl); ink(s,{a:.45,thr:26}); NS='';
      if(i===1){ var hl=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(6.3,.12,4.5)),lineMat(1,0,false,RED)); s.add(hl); }
      sheets.push(s); var lb=document.createElement('span'); lb.className='sl mono'+(i===1?' on':''); lb.textContent=names[i]; el.appendChild(lb); labels.push(lb); });
    var cam=new T.OrthographicCamera(-1,1,1,-1,.1,200), tgt=new V3(.35,2.6,0);
    stepView(1,function(dt,t,r){ sheets.forEach(function(s,i){ s.position.y=i*2.3+Math.sin(t*.8+i)*.12; s.rotation.y=Math.sin(t*.3+i*.6)*.06; });
      fitOrtho(cam,r,5.6,7.4,NARROW()?.2:0,NARROW()?-.05:0); orbit(cam,tgt,.75,.5,50); cam.updateMatrixWorld();
      sheets.forEach(function(s,i){ s.updateMatrixWorld(); placeAt(labels[i],new V3(-3.1,0,2.2).applyMatrix4(s.matrixWorld),cam,r,el); }); },sc,cam); })();
  // 3 · fabrication, welding, erection: the portal frame goes up piece by piece
  (function(){ var sc=new T.Scene(), g=new T.Group(); sc.add(g); NS='erect';
    P('#e3dccd'); boxA(-6.5,-.12,-4.5,6.5,0,4.5,0,g).userData.noEdge=true;
    var m=new T.Group(); g.add(m); B.steel(m); NS=''; inkEach(m,.5,24);
    var parts=m.children.slice(); parts.forEach(function(o){ o.userData.y0=o.position.y; });
    var cam=new T.OrthographicCamera(-1,1,1,-1,.1,200), tgt=new V3(0,1.8,0), t0=null;
    var v=stepView(2,function(dt,t,r){ if(t0===null||v.fresh){ t0=t; v.fresh=false; } var e=t-t0, k=reduce?parts.length:Math.min(parts.length,(e%9)/5.5*parts.length);
      parts.forEach(function(o,i){ var age=k-i; o.visible=age>0; var q=Math.min(1,Math.max(0,age)/2); o.position.y=o.userData.y0+(1-q*(2-q))*2.2; });
      fitOrtho(cam,r,6.4,9); orbit(cam,tgt,-.7+Math.sin(t*.2)*.15,.42,50); },sc,cam); })();
  // 4 · handover: inspection points across the finished plan, linked
  (function(){ var sc=new T.Scene(), m=planModel('s3',1.2); sc.add(m.g); NS='pins';
    var pts=[[80,70],[160,70],[232,80],[90,160],[180,150],[235,180],[80,250],[170,250],[232,262]], pins=[];
    pts.forEach(function(q){ var a=pp(q[0],q[1]), pg=new T.Group(); pg.position.set(a[0],0,a[1]); P('#fa3600'); cyl(.04,1.7,0,0,.85,0,pg,8); var hd=box(.34,.34,.34,0,0,1.85,0,pg,true); hd.userData.noEdge=true; P('#ffffff'); box(.14,.14,.36,0,0,1.85,0,pg).userData.noEdge=true; sc.add(pg); pins.push(pg); });
    var seg=[]; pts.forEach(function(a,i){ pts.forEach(function(b,j){ if(j>i&&Math.hypot(a[0]-b[0],a[1]-b[1])<100){ var p=pp(a[0],a[1]), q=pp(b[0],b[1]); seg.push(p[0],1.85,p[1],q[0],1.85,q[1]); } }); });
    var lg=new T.BufferGeometry(); lg.setAttribute('position',new T.Float32BufferAttribute(seg,3)); var net=new T.LineSegments(lg,lineMat(.9,.12,false,RED)); net.computeLineDistances(); sc.add(net); NS='';
    var cam=new T.OrthographicCamera(-1,1,1,-1,.1,200), tgt=new V3(0,.6,0), t0=null;
    var v=stepView(3,function(dt,t,r){ if(t0===null||v.fresh){ t0=t; v.fresh=false; } var e=reduce?99:t-t0;
      pins.forEach(function(p,i){ var q=Math.min(1,Math.max(0,(e-i*.18)/.4)); p.visible=q>0; p.scale.set(1,Math.max(.001,q),1); });
      net.material.uniforms.uA.value=Math.min(.9,Math.max(0,(e-1.6)*.9));
      fitOrtho(cam,r,9.5,11.5,NARROW()?.14:0,NARROW()?.08:0); orbit(cam,tgt,-.5+Math.sin(t*.22)*.12,.95,50); },sc,cam); })();

  /* ===== shade configurator: lit model with real sun shadows ===== */
  (function(){
    var el=document.getElementById('cfgView'); if(!el||!IH.cfgState) return;
    var S=IH.cfgState, tagBox=document.getElementById('cfgTags');
    R.shadowMap.enabled=true; R.shadowMap.type=T.PCFSoftShadowMap;
    var sc=new T.Scene();
    var hemi=new T.HemisphereLight(0xf7f3ea,0xb7b0a1,.8); sc.add(hemi);
    var sun=new T.DirectionalLight(0xfff4e2,1.1); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
    var scam=sun.shadow.camera; scam.left=-30; scam.right=30; scam.top=30; scam.bottom=-30; scam.near=1; scam.far=120; sun.shadow.bias=-.0004; sun.shadow.normalBias=.03; sc.add(sun); sc.add(sun.target);
    // the ground only shows shadows, so the paper colour of the page stays
    var gnd=new T.Mesh(new T.PlaneGeometry(160,160),new T.ShadowMaterial({opacity:.24})); gnd.rotation.x=-Math.PI/2; gnd.receiveShadow=true; sc.add(gnd);
    var root=new T.Group(); sc.add(root); var sunG=new T.Group(); sc.add(sunG);
    var disc=new T.Mesh(new T.SphereGeometry(.6,24,16),new T.MeshBasicMaterial({color:0xfa3600})); var halo=new T.Mesh(new T.SphereGeometry(1.15,24,16),new T.MeshBasicMaterial({color:0xfa3600,transparent:true,opacity:.16,depthWrite:false})); sc.add(disc); sc.add(halo);
    var built=-1, pathKey='', tags=[], ext={Wx:10,Wz:6,L:10,D:6};
    function std(c){ return new T.MeshStandardMaterial({color:c,roughness:.7,metalness:.1,side:T.DoubleSide}); }
    function bx(w,h,d,m,x,y,z,p,noCast){ var o=new T.Mesh(new T.BoxGeometry(w,h,d),m); o.position.set(x,y,z); o.castShadow=!noCast; o.receiveShadow=true; p.add(o); return o; }
    function bm(a,b,th,m,p,round){ var d=new V3().subVectors(b,a), L=d.length(); var o=new T.Mesh(round?new T.CylinderGeometry(th,th,L,10):new T.BoxGeometry(th,L,th),m);
      o.position.copy(a).addScaledVector(d,.5); o.quaternion.setFromUnitVectors(new V3(0,1,0),d.normalize()); o.castShadow=true; o.receiveShadow=true; p.add(o); return o; }
    function skin(c0,c1,c2,c3,m,p,sag){ var g=new T.PlaneGeometry(1,1,18,12), q=g.attributes.position;
      for(var i=0;i<q.count;i++){ var u=q.getX(i)+.5, v=q.getY(i)+.5, a=new V3().lerpVectors(c0,c1,u), b=new V3().lerpVectors(c3,c2,u), r=new V3().lerpVectors(a,b,v); r.y-=(sag||0)*Math.sin(u*Math.PI)*Math.sin(v*Math.PI); q.setXYZ(i,r.x,r.y,r.z); }
      g.computeVertexNormals(); var o=new T.Mesh(g,m); o.castShadow=true; o.receiveShadow=true; p.add(o); return o; }
    function lines(pts,col,a,dash,p){ var g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(pts,3)); var l=new T.LineSegments(g,lineMat(a,dash||0,false,new T.Color(col))); if(dash) l.computeLineDistances(); p.add(l); return l; }
    function carM(x,z,col,p){ var g=new T.Group(), b=std(col), gl=std('#5d7d93'), w=std('#222'); g.position.set(x,0,z);
      bx(1.8,.72,4.3,b,0,.62,0,g); bx(1.62,.58,2.3,gl,0,1.24,-.15,g); bx(1.66,.07,2.2,b,0,1.56,-.15,g);
      [[-.82,-1.4],[.82,-1.4],[-.82,1.4],[.82,1.4]].forEach(function(q){ var c=new T.Mesh(new T.CylinderGeometry(.35,.35,.24,14),w); c.rotation.z=Math.PI/2; c.position.set(q[0],.35,q[1]); c.castShadow=true; g.add(c); }); p.add(g); }
    function tag(txt,pt,cls){ var s=document.createElement('span'); s.className='tg mono '+(cls||''); s.innerHTML=(cls==='dim'?'':'<i></i>')+txt; tagBox.appendChild(s); tags.push({el:s,p:pt}); }
    function clear(){ root.traverse(function(o){ if(o.geometry) o.geometry.dispose(); if(o.material&&o.material.dispose) o.material.dispose(); }); root.clear(); tagBox.innerHTML=''; tags=[]; }
    function build(){ clear(); built=S.v;
      var g=IH.cfgDims(), C=IH.cfgColors(), F=std(C.frame), K=std(C.skin), conc=std('#cfcac0'), L=g.L, D=g.D, n=S.bays, bw=g.T.bay, st=new T.Group(); root.add(st);
      ext={Wx:g.Wx,Wz:g.Wz,L:L,D:D}; if(S.orient==='ns') st.rotation.y=Math.PI/2;
      var slab=bx(L+3.2,.05,D+3.2,std('#e7e3d9'),0,-.02,0,st,true); slab.receiveShadow=true;
      lines([-L/2,.03,-D/2,L/2,.03,-D/2, L/2,.03,-D/2,L/2,.03,D/2, L/2,.03,D/2,-L/2,.03,D/2, -L/2,.03,D/2,-L/2,.03,-D/2],'#282828',.55,.22,st);
      var pts=[];
      if(S.type==='parking'){ var cz=-D/2+.4;
        for(var k=0;k<=2*n;k++){ var sx=-L/2+k*2.5; bx(.08,.012,4.8,std('#fbfaf6'),sx,.01,.55,st,true); }
        var cars=['#b8352c','#e8e6e0','#3f6280','#2d3034','#c9a64a','#6f7a80'];
        for(var c=0;c<2*n;c++) carM(-L/2+1.25+c*2.5,.75,cars[c%cars.length],st);
        for(var i=0;i<=n;i++){ var x=-L/2+i*bw; bx(.62,.14,.62,conc,x,.07,cz,st); bx(.24,3.3,.24,F,x,1.65,cz,st);
          bm(new V3(x,3.3,cz-.55),new V3(x,2.8,D/2+.1),.17,F,st); bm(new V3(x,2.15,cz),new V3(x,3.05,cz+1.9),.09,F,st); }
        [[cz-.4,3.36],[0,3.12],[D/2,2.84]].forEach(function(q){ bx(L+.3,.09,.09,F,0,q[1],q[0],st); });
        for(var b=0;b<n;b++){ var x0=-L/2+b*bw+.06, x1=x0+bw-.12; skin(new V3(x0,3.43,cz-.6),new V3(x1,3.43,cz-.6),new V3(x1,2.9,D/2+.2),new V3(x0,2.9,D/2+.2),K,st,.1); }
        tag('Fabric canopy',new V3(-L/2+bw*(n>1?1.5:.5),3.3,.4)); tag('Cantilever column',new V3(-L/2,.9,cz));
      } else if(S.type==='sail'){ var h=function(k,s){ return (k+(s>0?1:0))%2?2.7:4.6; };
        for(var k=0;k<=n;k++) [-1,1].forEach(function(s){ var x=-L/2+k*6, z=s*3, hh=h(k,s); bx(.5,.12,.5,conc,x,.06,z,st); var m=new T.Mesh(new T.CylinderGeometry(.09,.11,hh+.25,12),F); m.position.set(x,(hh+.25)/2,z); m.castShadow=true; st.add(m); });
        for(var b=0;b<n;b++){ var x0=-L/2+b*6, x1=x0+6, i0=.3;
          skin(new V3(x0+i0,h(b,-1),-3+i0),new V3(x1-i0,h(b+1,-1),-3+i0),new V3(x1-i0,h(b+1,1),3-i0),new V3(x0+i0,h(b,1),3-i0),K,st,.28);
          pts.push(x0,h(b,-1)+.1,-3, x0+i0,h(b,-1),-3+i0, x1,h(b+1,-1)+.1,-3, x1-i0,h(b+1,-1),-3+i0, x1,h(b+1,1)+.1,3, x1-i0,h(b+1,1),3-i0, x0,h(b,1)+.1,3, x0+i0,h(b,1),3-i0); }
        lines(pts,'#282828',.8,0,st);
        tag('Tensile sail',new V3(-L/2+3,3.6,0)); tag('Steel mast',new V3(-L/2,2.2,-3));
      } else { var H=2.75;
        for(var i=0;i<=n;i++){ var x=-L/2+i*bw; [-1,1].forEach(function(s){ bx(.4,.1,.4,conc,x,.05,s*D/2,st); bx(.14,H,.14,F,x,H/2,s*D/2,st); }); bx(.1,.22,D+.3,F,x,H+.11,0,st); }
        [-1,1].forEach(function(s){ bx(L+.6,.24,.12,F,0,H+.12,s*D/2,st); });
        for(var sx=-L/2-.2;sx<=L/2+.21;sx+=.28) bx(.07,.16,D+.5,K,sx,H+.32,0,st);
        tag('Slatted roof',new V3(L/4,H+.4,0)); tag('Steel post',new V3(-L/2,1.3,D/2));
      }
      // dimension chains outside the footprint
      var o=1.5; lines([-L/2,.03,D/2+o,L/2,.03,D/2+o, -L/2,.03,D/2+o-.3,-L/2,.03,D/2+o+.3, L/2,.03,D/2+o-.3,L/2,.03,D/2+o+.3,
        L/2+o,.03,-D/2,L/2+o,.03,D/2, L/2+o-.3,.03,-D/2,L/2+o+.3,.03,-D/2, L/2+o-.3,.03,D/2,L/2+o+.3,.03,D/2],'#282828',.8,0,st);
      tag(L.toFixed(1)+' m',new V3(0,0,D/2+o),'dim'); tag(D.toFixed(1)+' m',new V3(L/2+o,0,0),'dim');
      // north arrow, fixed to the world
      var na=new T.Group(); na.position.set(-g.Wx/2-2.6,.03,-g.Wz/2-.6); var sh=new T.Shape(); sh.moveTo(0,-.9); sh.lineTo(.42,.5); sh.lineTo(0,.25); sh.lineTo(-.42,.5); sh.closePath();
      var am=new T.Mesh(new T.ShapeGeometry(sh),new T.MeshBasicMaterial({color:0x282828,side:T.DoubleSide})); am.rotation.x=-Math.PI/2; na.add(am); root.add(na);
      root.updateMatrixWorld(true); tags.forEach(function(t){ t.p.applyMatrix4(st.matrixWorld); }); tag('N',new V3(na.position.x,0,na.position.z-1.4),'n');
    }
    function sunPath(){ var s=IH.cfgSun; if(!s) return; var key=s.decl+'|'+ext.Wx+'|'+ext.Wz; if(key===pathKey) return; pathKey=key;
      sunG.traverse(function(o){ if(o.geometry) o.geometry.dispose(); }); sunG.clear(); var Rr=Math.max(ext.Wx,ext.Wz)*.5+8, pts=[], prev=null;
      for(var t=5;t<=19.01;t+=.2){ var q=s.sunAt(t,s.decl); if(q.el<=0){ prev=null; continue; } var p=[q.v[0]*Rr,q.v[1]*Rr,q.v[2]*Rr]; if(prev) pts.push(prev[0],prev[1],prev[2],p[0],p[1],p[2]); prev=p; }
      lines(pts,'#fa3600',.55,.35,sunG); sunG.userData.R=Rr; }
    var cam=new T.PerspectiveCamera(30,1,.5,400), yaw=-.55, vel=0, drag=false, lx=0, last=-99, clk=0, tgt=new V3(0,1.3,0);
    el.addEventListener('pointerdown',function(e){ drag=true; lx=e.clientX; last=clk; try{ el.setPointerCapture(e.pointerId); }catch(_){} });
    el.addEventListener('pointermove',function(e){ if(!drag) return; var dx=e.clientX-lx; lx=e.clientX; vel=dx*.005; yaw-=dx*.008; last=clk; });
    el.addEventListener('pointerup',function(){ drag=false; }); el.addEventListener('pointercancel',function(){ drag=false; });
    var warm=new T.Color(0xffc58f), white=new T.Color(0xfff6ea), tmp=new V3();
    view(el,{scene:sc,camera:cam,frame:function(dt,t,r){ clk=t;
      if(S.v!==built) build(); sunPath();
      var s=IH.cfgSun||{v:[0,1,0],el:60}, v=s.v, up=s.el>0;
      sun.visible=up; sun.position.set(v[0]*60,v[1]*60,v[2]*60); sun.intensity=up?.3+.6*Math.min(1,s.el/35):0; sun.color.copy(warm).lerp(white,Math.min(1,s.el/30));
      hemi.intensity=up?.5+.12*Math.min(1,s.el/40):.5;
      var Rr=sunG.userData.R||14; disc.visible=halo.visible=up; disc.position.set(v[0]*Rr,v[1]*Rr,v[2]*Rr); halo.position.copy(disc.position); halo.scale.setScalar(1+.06*Math.sin(t*2.4));
      if(!drag){ yaw-=vel; vel*=.93; if(t-last>4&&!reduce) yaw+=dt*.04; }
      var a=r.width/r.height, span=Math.max(ext.Wx,ext.Wz)+5, d=(span*1.05+14)*(a<.9?1.35:a<1.2?1.08:1);
      cam.aspect=a; cam.updateProjectionMatrix(); orbit(cam,tgt,yaw,.5,d);
      tags.forEach(function(q){ tmp.copy(q.p); placeAt(q.el,tmp,cam,r,tagBox); });
    }});
  })();

  /* ---------- render loop: one canvas, a scissor per visible view ---------- */
  var clock=new T.Clock();
  (function loop(){
    var dt=Math.min(clock.getDelta(),.05), t=clock.elapsedTime, W=innerWidth, H=innerHeight;
    R.setScissorTest(false); R.clear();
    views.forEach(function(v){
      if(v.gate&&!v.gate.classList.contains('on')){ v.fresh=true; return; }
      var r=v.el.getBoundingClientRect(); if(r.width<2||r.height<2) return;
      if(r.bottom<0||r.top>H||r.right<0||r.left>W) return;
      v.frame(dt,t,r);
      var x=Math.round(r.left), y=Math.round(H-r.bottom), w=Math.round(r.width), h=Math.round(r.height);
      R.setViewport(x,y,w,h); R.setScissor(x,y,w,h); R.setScissorTest(true);
      R.clearDepth();
      R.render(v.scene,v.camera);
    });
    requestAnimationFrame(loop);
  })();
})();
