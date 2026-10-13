/* Infinity Hub Contracting — content, layout builders, interactions and scroll choreography. */
(function(){
  var root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IH=window.IH=window.IH||{};
  var $=function(s,c){ return (c||document).querySelector(s); }, $$=function(s,c){ return [].slice.call((c||document).querySelectorAll(s)); };
  var ARR='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5"/></svg>';
  var HEX=function(t){ return '<svg class="hex" viewBox="0 0 30 34" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M15 1.5 28 9v16l-13 7.5L2 25V9z"/><text x="15" y="20.5" text-anchor="middle" font-family="Geist Mono,monospace" font-size="9" fill="currentColor" stroke="none">'+t+'</text></svg>'; };

  /* ---------- content (from the company profile) ---------- */
  var CORE=[['C1','Civil works','fitout'],['C2','Interior fit-out','fitout'],['C3','Structural steel','steel'],['C4','Custom fabrication','steel'],['C5','Mezzanine structures','mezz'],['C6','Parking shades','shade'],['C7','Sandwich panels','panel'],['C8','Boxing rings','ring'],['C9','Specialised installations','steel']];
  var PRODS=IH.PRODS=[
    {key:'steel',title:'Structural steel works',lede:'Fabrication, welding, supply, erection and installation for commercial, industrial, warehouse and residential applications. Engineered for strength. Fabricated for precision. Built to perform.',
     chips:['Steel structures','Mezzanine floors','Steel platforms','Steel ramps','Staircases','Cat ladders','Handrails','Pergolas','Industrial structures'],
     ui:['Capability strip',[['Fabrication','01'],['Welding','02'],['Finishing','03'],['Transportation','04'],['Erection','05'],['Installation','06']]]},
    {key:'shade',title:'Car parking & building shades',lede:'We design, fabricate and install durable shade structures for residential, commercial, industrial and public spaces. Designed for protection. Built for the UAE climate.',
     chips:['Cantilever parking shades','Freestanding carports','Tensile shades','Arch-shaped shades','Walkway shades','Entrance shades','Pergola structures'],
     ui:['Roof systems',[['UV-resistant','Fabric'],['Waterproof','Fabric'],['Powder-coated','Steel'],['Custom parking','Design']]]},
    {key:'fitout',title:'Civil & interior fit-out',lede:'Complete civil and interior solutions from preparation to finishing, designed to turn spaces into functional, durable and professionally finished environments.',
     chips:['Masonry & blockwork','Renovation','Gypsum ceilings','Wall panelling','Flooring & tiling','Electrical','Plumbing','Air conditioning','Bespoke joinery'],
     ui:['Scope',[['Civil works','8'],['Interior fit-out','7'],['MEP & technical','5'],['Bespoke joinery','11']]]},
    {key:'mezz',title:'Mezzanine floors & industrial structures',lede:'Create more usable space without expanding your footprint: mezzanines, platforms, staircases, handrails and safety barriers.',
     chips:['Warehouse mezzanines','Industrial platforms','Storage platforms','Access ramps','Safety barriers','Steel extensions'],
     ui:['Applications',[['Warehouses','✓'],['Workshops','✓'],['Storage areas','✓'],['Retail & offices','✓']]]},
    {key:'panel',title:'Sandwich panel solutions',lede:'Supply, installation, replacement and enclosure solutions for industrial, commercial, warehouse, cold-storage and modular projects. Efficient enclosures, reliable insulation, professional installation.',
     chips:['Insulated wall panels','Roof panels','Acoustic panels','Fire-resistant panels','Cold storage','Modular enclosures'],
     ui:['Systems',[['Wall systems','5'],['Roof systems','3'],['Specialised','5'],['Services','5']]]},
    {key:'ring',title:'Boxing ring solutions',lede:'Custom design, manufacturing, branding, installation, maintenance, repairs and rentals, plus event setup and dismantling. Built for training. Designed for performance. Ready for competition.',
     chips:['Boxing gyms','Sports clubs','Training centres','Competitions','Exhibitions','Corporate events'],
     ui:['Sizes',[['5m × 5m','Ring'],['6m × 6m','Ring'],['7m × 7m','Ring']]]}
  ];
  var INDS=[['Commercial','Offices · Retail · Showrooms','M4 30h26M7 30V10h10v20M17 30V4h10v26M10 14h4M10 19h4M10 24h4M20 9h4M20 14h4M20 19h4M20 24h4'],
            ['Industrial','Warehouses · Workshops · Factories','M3 30h28M5 30V16l8-5v5l8-5v5l8-5v19M24 6h4v6M9 24h4M17 24h4M25 24h2'],
            ['Government','Office refurbishment · Project works','M4 30h26M6 30V14h22v16M3 14l14-9 14 9M10 18v9M17 18v9M24 18v9'],
            ['Sports','Gyms · Boxing · Training centres','M6 26h22M8 26V12M26 26V12M8 15h18M8 19h18M8 23h18M5 26l-1 4M29 26l1 4'],
            ['Events','Boxing events · Temporary structures','M4 30h26M6 30V12l11-7 11 7v18M11 30v-8h12v8M9 12h16'],
            ['Hospitality','Hotels · Restaurants · Cafés','M4 30h26M8 30V8h18v22M12 12h3M19 12h3M12 17h3M19 17h3M12 22h3M19 22h3M15 30v-4h4v4']];
  // our work: one media item per discipline, all from the asset folder
  var CATS=[['steel','Structural steel','Fabrication, welding and erection of steel structures, platforms, mezzanines and staircases.',{img:'steel-inspect',alt:'Worker inspecting fabricated steel beams'}],
            ['shades','Parking & building shades','Cantilever, tensile, arched and walkway shades, designed and installed for the UAE climate.',{vid:'shade',alt:'Tensile shade structure on a steel frame'}],
            ['fitout','Civil & interior fit-out','Civil works and interior fit-out, from partitions and joinery to floor finishes.',{img:'tiling',alt:'Specialist laying stone floor tiles'}],
            ['coord','Planning & coordination','Site surveys, drawings and scope reviewed with the client, with one point of coordination to handover.',{img:'review',alt:'Two specialists reviewing drawings on site'}]];
  var STAGES={1:{k:'Stage 02',n:'Site survey & assessment',l:['Site measurements','Existing structure assessment','Access conditions','Existing services','Working restrictions'],o:'Reduce surprises during execution by understanding the site before work begins.'},
              2:{k:'Stage 03',n:'Scope & proposal',l:['Scope of work','Material specifications','Quantities','Exclusions','Estimated duration'],o:'Create a clear understanding between Infinity Hub and the client before execution begins.'},
              3:{k:'Stage 08',n:'Inspection & rectification',l:['Deficiencies identified','Corrections carried out','Finishing completed','Outstanding items addressed'],o:'Ensure the completed scope is ready for handover.'}};

  /* ---------- builders ---------- */
  // ticker
  var tk=$('#ticker'), th=CORE.map(function(c){ return '<span>'+HEX('')+c[1]+'</span>'; }).join('');
  tk.innerHTML=th+th; $$('span',tk).forEach(function(s,i){ if(i>=CORE.length) s.setAttribute('aria-hidden','true'); });
  // capabilities dropdown + feature list
  // shades live in the configurator section, everything else has a capability row
  function capHref(k){ return k==='shade'?'#configure':'#cap-'+k; }
  $('#capDrop').innerHTML=PRODS.map(function(p){ return '<a href="'+capHref(p.key)+'">'+p.title+'</a>'; }).join('');
  // industries
  $('#indRow').innerHTML=INDS.map(function(d){ return '<div class="ind__cell"><svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="'+d[2]+'"/></svg><b>'+d[0]+'</b><span class="mono" style="font-size:.66rem">'+d[1]+'</span></div>'; }).join('');
  var indI=0; function indGo(d){ var per=innerWidth<820?2:3, max=INDS.length-per; indI=Math.max(0,Math.min(max,indI+d)); $('#indRow').style.transform='translateX(-'+(indI*100/per)+'%)'; }
  $('#indPrev').addEventListener('click',function(){ indGo(-1); }); $('#indNext').addEventListener('click',function(){ indGo(1); });
  // capabilities: 3D stage on the left, a simple list on the right; one item open at a time
  var capOrder=['steel','fitout','mezz','shade','panel','ring'];
  $('#capsList').innerHTML=capOrder.map(function(k,i){ var p=PRODS.filter(function(x){ return x.key===k; })[0];
    var act=k==='shade'?'<a class="lm mono" href="#configure">Open the shade configurator<i>'+ARR+'</i></a>':'<button class="lm mono" type="button" data-contact data-scope="'+p.title+'">Enquire about this<i>'+ARR+'</i></button>';
    return '<li class="ci'+(i===0?' on':'')+'" id="cap-'+k+'" data-k="'+k+'"><button class="ci__b" type="button" aria-expanded="'+(i===0)+'" aria-controls="cp'+i+'"><span class="mono n">0'+(i+1)+'</span><span class="t">'+p.title+'</span><i class="pl" aria-hidden="true"></i></button>'+
      '<div class="ci__p" id="cp'+i+'"><div><div class="ci__in"><p>'+p.lede+'</p><ul class="chips">'+p.chips.slice(0,6).map(function(c){ return '<li class="mono">'+c+'</li>'; }).join('')+'</ul>'+act+'</div></div></div></li>'; }).join('');
  function setCap(k){ var i=capOrder.indexOf(k); if(i<0) return; IH.capKey=k;
    $$('.ci').forEach(function(li){ var on=li.dataset.k===k; li.classList.toggle('on',on); $('.ci__b',li).setAttribute('aria-expanded',on?'true':'false'); });
    var p=PRODS.filter(function(x){ return x.key===k; })[0]; $('#capsName').textContent='['+('0'+(i+1))+'] '+p.title; $('#capsSizes').hidden=k!=='ring';
    placeStage(); if(IH.capShow) IH.capShow(k); }
  // on narrow screens the 3D stage moves into the open item, so the model is always next to what was tapped
  var capsStage=$('#capsStage'), capsHome=capsStage.parentNode;
  function placeStage(){ var narrow=innerWidth<=1100, li=$('.ci.on'), host=narrow&&li?$('.ci__in',li):capsHome;
    if(capsStage.parentNode!==host){ if(narrow) host.insertBefore(capsStage,host.firstChild); else host.insertBefore(capsStage,host.firstChild); } }
  addEventListener('resize',placeStage);
  IH.capKey='steel'; setCap('steel');
  $$('.ci__b').forEach(function(b){ b.addEventListener('click',function(){ setCap(b.parentNode.dataset.k); }); });
  document.addEventListener('click',function(e){ var a=e.target.closest('a[href^="#cap-"]'); if(a) setCap(a.getAttribute('href').slice(5)); });
  $$('#capsSizes button').forEach(function(b){ b.addEventListener('click',function(){ $$('#capsSizes button').forEach(function(o){ o.setAttribute('aria-pressed',o===b?'true':'false'); }); IH.ringSize&&IH.ringSize(+b.dataset.size); }); });
  /* ---------- shade configurator: state, sun maths, readouts (3D in gl.js) ---------- */
  var CFG={
    types:{parking:{n:'Car parking',long:'Cantilever car parking shade',bay:5,D:5.5,H:3.0,min:1,max:6,unit:'Bays',per:function(){ return '5.0 m per bay · 2 cars each'; },skin:'Canopy fabric',icon:'M2 13h12M3 13V4l10 2M3 4h10v2'},
           sail:{n:'Tensile sail',long:'Tensile shade sail',bay:6,D:6,H:3.5,min:1,max:4,unit:'Sails',per:function(){ return '6.0 × 6.0 m per sail'; },skin:'Sail fabric',icon:'M2 13V3M14 13V5M2 3l12 2-5 5z'},
           pergola:{n:'Pergola',long:'Steel pergola',bay:4,D:4,H:2.9,min:1,max:6,unit:'Bays',per:function(){ return '4.0 m per bay · slats at 28 cm'; },skin:'Slat finish',icon:'M3 13V6M13 13V6M1 6h14M3 4v2M6 4v2M9 4v2M12 4v2'}},
    frames:[['Charcoal','#2d3034'],['White','#eceae4'],['Bronze','#6a4a33'],['Galvanised','#9ea6ac'],['Infinity red','#ce2128']],
    fabric:[['Sand','#e1cfa6'],['White','#f1efe8'],['Silver','#a3a8ad'],['Terracotta','#b65a3e'],['Green','#3f6b4f'],['Navy','#2c4566']],
    slats:[['Teak','#8f5f37'],['Oak','#c19a6b'],['White','#efeee9'],['Match frame','frame']],
    seasons:[['Dec 21','Winter',-23.44],['Mar 21','Spring / autumn',0],['Jun 21','Summer',23.44]]};
  var cs=IH.cfgState={type:'parking',bays:3,orient:'ew',frame:0,skin:0,skinP:0,skinF:0,time:10.5,season:2,v:0};
  var LAT=25.2*Math.PI/180;
  function sunAt(t,decl){ var d=decl*Math.PI/180, h=(t-12)*15*Math.PI/180;
    var se=Math.sin(LAT)*Math.sin(d)+Math.cos(LAT)*Math.cos(d)*Math.cos(h), el=Math.asin(se);
    var ca=(Math.sin(d)-Math.sin(el)*Math.sin(LAT))/(Math.cos(el)*Math.cos(LAT)), az=Math.acos(Math.max(-1,Math.min(1,ca))); if(h>0) az=2*Math.PI-az;
    return {el:el*180/Math.PI,az:az*180/Math.PI,v:[Math.cos(el)*Math.sin(az),Math.sin(el),-Math.cos(el)*Math.cos(az)]}; }
  function dims(){ var T=CFG.types[cs.type], L=cs.bays*T.bay; return {T:T,L:L,D:T.D,Wx:cs.orient==='ew'?L:T.D,Wz:cs.orient==='ew'?T.D:L}; }
  // share of the covered footprint that lies in shade: the roof outline moved along the sun ray, overlapped with the footprint
  function shadeAt(t){ var s=sunAt(t,CFG.seasons[cs.season][2]); if(s.el<=1) return 0; var g=dims(), v=s.v, H=g.T.H;
    var sx=-v[0]/v[1]*H, sz=-v[2]/v[1]*H, ov=Math.max(0,g.Wx-Math.abs(sx))*Math.max(0,g.Wz-Math.abs(sz))/(g.Wx*g.Wz), dens=g.T===CFG.types.sail?.9:.98;
    if(cs.type==='pergola'){ var dl=Math.abs(cs.orient==='ew'?v[0]:v[2]); dens=Math.min(1,(.07+.16*dl/v[1])/.28); }
    return ov*dens; }
  function hhmm(t){ var h=Math.floor(t), m=Math.round((t-h)*60); return (h<10?'0':'')+h+':'+(m<10?'0':'')+m; }
  function skinList(){ return cs.type==='pergola'?CFG.slats:CFG.fabric; }
  function skinIdx(){ return cs.type==='pergola'?cs.skinP:cs.skinF; }
  function skinCol(){ var c=skinList()[skinIdx()][1]; return c==='frame'?CFG.frames[cs.frame][1]:c; }
  IH.cfgColors=function(){ return {frame:CFG.frames[cs.frame][1],skin:skinCol()}; };
  IH.cfgDims=dims;
  function radio(box,sel){ $$('button',box).forEach(function(b,i){ var on=sel(b,i); b.setAttribute('aria-checked',on?'true':'false'); b.classList.toggle('on',on); }); }
  function sw(list){ return list.map(function(c){ return '<button type="button" role="radio" class="sw" aria-label="'+c[0]+'" title="'+c[0]+'"><i style="background:'+(c[1]==='frame'?'conic-gradient(from 45deg,var(--sw-f) 0 50%,#c19a6b 0)':c[1])+'"></i></button>'; }).join(''); }
  var cType=$('#cfgType'), cFrame=$('#cfgFrame'), cSkin=$('#cfgSkin'), cSeason=$('#cfgSeason'), cT=$('#cfgT');
  if(cType){
    cType.innerHTML=Object.keys(CFG.types).map(function(k){ var T=CFG.types[k]; return '<button type="button" role="radio" data-k="'+k+'"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="'+T.icon+'"/></svg>'+T.n+'</button>'; }).join('');
    cFrame.innerHTML=sw(CFG.frames);
    cSeason.innerHTML=CFG.seasons.map(function(s){ return '<button type="button" role="radio" title="'+s[1]+'">'+s[0]+'<small>'+s[1]+'</small></button>'; }).join('');
    function render(build){
      var g=dims(), T=g.T, s=sunAt(cs.time,CFG.seasons[cs.season][2]), sh=shadeAt(cs.time);
      if(build){ cs.v++; cSkin.innerHTML=sw(skinList()); }
      cSkin.style.setProperty('--sw-f',CFG.frames[cs.frame][1]);
      radio(cType,function(b){ return b.dataset.k===cs.type; }); radio($('#cfgOri'),function(b){ return b.dataset.o===cs.orient; });
      radio(cFrame,function(b,i){ return i===cs.frame; }); radio(cSkin,function(b,i){ return i===skinIdx(); }); radio(cSeason,function(b,i){ return i===cs.season; });
      $('#cfgN').textContent=cs.bays; $('#cfgUnit').textContent=T.unit; $('#cfgPer').textContent=T.per();
      $$('.step button').forEach(function(b){ b.disabled=(+b.dataset.d<0&&cs.bays<=T.min)||(+b.dataset.d>0&&cs.bays>=T.max); });
      $('#cfgFrameN').textContent=CFG.frames[cs.frame][0]; $('#cfgSkinL').textContent=T.skin; $('#cfgSkinN').textContent=skinList()[skinIdx()][0];
      $('#cfgTime').textContent=hhmm(cs.time)+' · '+CFG.seasons[cs.season][0]; cT.value=cs.time; cT.style.setProperty('--p',((cs.time-6)/12*100)+'%');
      $('#cfgSun').textContent=s.el>1?'Sun '+hhmm(cs.time)+' · '+Math.round(s.el)+'° high':'Sun '+hhmm(cs.time)+' · below horizon';
      $('#cfgArea').textContent=g.L.toFixed(1)+' × '+g.D.toFixed(1)+' m'; $('#cfgM2').textContent='≈ '+Math.round(g.L*g.D)+' m²'+(cs.type==='parking'?' · '+cs.bays*2+' cars':'');
      $('#cfgShade').textContent=Math.round(sh*100)+'%';
      // shade across the day, with the current time marked
      var pts=[]; for(var t=6;t<=18.001;t+=.25) pts.push([(t-6)/12*120,34-shadeAt(t)*32]);
      var d='M'+pts.map(function(p){ return p[0].toFixed(1)+' '+p[1].toFixed(1); }).join('L'), cx=(cs.time-6)/12*120, cy=34-sh*32;
      $('#cfgSpark').innerHTML='<path d="'+d+'L120 34L0 34Z" fill="rgba(250,54,0,.12)"/><path d="'+d+'" fill="none" stroke="#fa3600" stroke-width="1.2" vector-effect="non-scaling-stroke"/><line x1="'+cx+'" x2="'+cx+'" y1="0" y2="34" stroke="#282828" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="2 2"/><circle cx="'+cx+'" cy="'+cy+'" r="2.4" fill="#282828"/>';
      var sk=skinList()[skinIdx()][0].toLowerCase(), fr=CFG.frames[cs.frame][0].toLowerCase();
      var what=cs.type==='sail'?(cs.bays===1?'One tensile shade sail':cs.bays+' tensile shade sails'):T.long+', '+cs.bays+(cs.bays===1?' bay':' bays');
      $('#cfgSum').textContent=what+' (about '+g.L.toFixed(1)+' × '+g.D.toFixed(1)+' m'+(cs.type==='parking'?', '+cs.bays*2+' cars':'')+'), '+fr+' frame, '+sk+(cs.type==='pergola'?' slats':' fabric')+', long side '+(cs.orient==='ew'?'east–west':'north–south')+'.';
      IH.cfgSun={v:s.v,el:s.el,decl:CFG.seasons[cs.season][2],sunAt:sunAt};
    }
    cType.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b||b.dataset.k===cs.type) return; cs.type=b.dataset.k; var T=CFG.types[cs.type]; cs.bays=Math.max(T.min,Math.min(T.max,cs.bays)); render(true); });
    $$('.step button').forEach(function(b){ b.addEventListener('click',function(){ var T=CFG.types[cs.type]; cs.bays=Math.max(T.min,Math.min(T.max,cs.bays+(+b.dataset.d))); render(true); }); });
    $('#cfgOri').addEventListener('click',function(e){ var b=e.target.closest('button'); if(b){ cs.orient=b.dataset.o; render(true); } });
    cFrame.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b){ cs.frame=$$('button',cFrame).indexOf(b); render(true); } });
    cSkin.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; var i=$$('button',cSkin).indexOf(b); if(cs.type==='pergola') cs.skinP=i; else cs.skinF=i; render(true); });
    cSeason.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b){ cs.season=$$('button',cSeason).indexOf(b); render(false); IH.cfgPath=(IH.cfgPath||0)+1; } });
    cT.addEventListener('input',function(){ cs.time=+cT.value; stopPlay(); render(false); });
    // arrow keys move through radio groups
    $$('#configure [role=radiogroup]').forEach(function(gp){ gp.addEventListener('keydown',function(e){ if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return; var bs=$$('button',gp), i=bs.indexOf(document.activeElement); if(i<0) return; e.preventDefault(); var n=bs[(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length]; n.focus(); n.click(); }); });
    var playing=null; function stopPlay(){ if(playing){ cancelAnimationFrame(playing); playing=null; $('#cfgPlay').classList.remove('on'); } }
    $('#cfgPlay').addEventListener('click',function(){ if(playing){ stopPlay(); return; } if(cs.time>=17.9) cs.time=6; $('#cfgPlay').classList.add('on'); var last=performance.now();
      (function step(now){ cs.time=Math.min(18,cs.time+(now-last)/1000*1.6); last=now; render(false); if(cs.time<18) playing=requestAnimationFrame(step); else stopPlay(); })(last); });
    $('#cfgGo').addEventListener('click',function(){ IH.openDrawer&&IH.openDrawer('Car parking & building shades','Configured on your website: '+$('#cfgSum').textContent+' Location and timeline: '); });
    render(true);
  }

  // projects accordion
  var ucM=$('#ucMedia');
  ucM.innerHTML=CATS.map(function(c,i){ var m=c[3]; return '<div class="um'+(i===0?' on':'')+'" data-i="'+i+'">'+(m.vid?'<video muted loop playsinline preload="none" poster="assets/img/poster-'+m.vid+'.webp" aria-label="'+m.alt+'"><source src="assets/video/'+m.vid+'.webm" type="video/webm"><source src="assets/video/'+m.vid+'.mp4" type="video/mp4"></video>':'<img src="assets/img/'+m.img+'.webp" alt="'+m.alt+'" loading="lazy" width="1800" height="893">')+'</div>'; }).join('');
  function showMedia(i){ $$('.um',ucM).forEach(function(d){ var on=+d.dataset.i===i; d.classList.toggle('on',on); var v=$('video',d); if(v){ if(on&&!reduce){ var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); } else v.pause(); } }); }
  $('#acc').innerHTML=CATS.map(function(c,i){
    return '<div class="acc__i'+(i===0?' on':'')+'"><button class="acc__b" type="button" aria-expanded="'+(i===0)+'" aria-controls="ap'+i+'" data-i="'+i+'"><span>'+c[1]+'<em>'+('0'+(i+1))+'</em></span><i class="pl" aria-hidden="true"></i></button><div class="acc__p" id="ap'+i+'"><div><div class="acc__in"><p>'+c[2]+'</p></div></div></div></div>';
  }).join('');
  $$('.acc__b').forEach(function(b){ b.addEventListener('click',function(){ var it=b.parentNode, on=!it.classList.contains('on');
    $$('.acc__i').forEach(function(o){ o.classList.remove('on'); $('.acc__b',o).setAttribute('aria-expanded','false'); });
    if(on){ it.classList.add('on'); b.setAttribute('aria-expanded','true'); showMedia(+b.dataset.i); } }); });
  // contact scope options
  $('#fS').innerHTML='<option value="">Choose a scope</option>'+PRODS.map(function(p){ return '<option>'+p.title+'</option>'; }).join('')+'<option>Specialised fabrication & metal works</option><option>Other</option>';

  /* ---------- the floor plan (SVG) ---------- */
  var NS='http://www.w3.org/2000/svg';
  function el(t,a,p){ var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e; }
  var WALLS=[[40,30,55,6],[115,30,85,6],[220,30,46,6],[40,294,40,6],[100,294,60,6],[180,294,86,6],[40,30,6,70],[40,120,6,90],[40,230,6,70],[260,30,6,110],[260,160,6,140],
             [46,120,90,5],[150,120,50,5],[200,36,5,84],[130,125,5,60],[130,205,5,89],[135,210,60,5],[215,210,45,5],[46,200,40,5]];
  IH.WALLS=WALLS;
  // the plan itself is a 3D model (gl.js); the stage markers are buttons that follow it
  var planEl=$('#plan'), mkWrap=document.createElement('div'); mkWrap.className='mks'; planEl.appendChild(mkWrap);
  var MK=[[41,99,1],[150,120,2],[230,210,3]];
  IH.plan={w:WALLS.map(function(){ return 0; }),d:0,f:0,p:0}; IH.planMarks=[];
  var marks=MK.map(function(m){ var b=document.createElement('button'); b.type='button'; b.className='mk3 mono'; b.textContent='0'+m[2]; b.setAttribute('aria-label','Open '+STAGES[m[2]].n);
    b.addEventListener('click',function(){ openPop(m[2]); }); mkWrap.appendChild(b); IH.planMarks.push({el:b,x:m[0],y:m[1]}); return b; });
  var pop=$('#pop');
  function openPop(n){ var s=STAGES[n]; $('#popK').textContent='Marker 0'+n; $('#popN').textContent=s.k; $('#popT').textContent=s.n; $('#popL').innerHTML=s.l.map(function(x){ return '<li>'+x+'</li>'; }).join(''); $('#popO').textContent=s.o;
    marks.forEach(function(m,i){ m.classList.toggle('on',i===n-1); });
    var r=marks[n-1].getBoundingClientRect(), pr=$('#pinIn').getBoundingClientRect(), w=Math.min(290,innerWidth*.7);
    var x=r.right-pr.left+14, y=r.top-pr.top-10; if(x+w>pr.width-16) x=r.left-pr.left-w-14; if(x<12) x=12; y=Math.max(12,Math.min(y,pr.height-300));
    pop.style.left=x+'px'; pop.style.top=y+'px'; pop.classList.add('on'); }
  $('#popX').addEventListener('click',function(){ pop.classList.remove('on'); marks.forEach(function(m){ m.classList.remove('on'); }); });
  IH.openPop=openPop;

  /* ---------- process step drawings ---------- */
  var STEPS=[
    {t:'Understand',s:'We start with what the client actually needs',side:'L'},
    {t:'Plan',s:'Scope, proposal, resources and sequence agreed',side:'R'},
    {t:'Build',s:'Fabricated, delivered and installed by one team',side:'L'},
    {t:'Hand over',s:'Inspected, corrected and completed with clarity',side:'R'}];
  var procL=$('#procL'), procR=$('#procR');
  function sd(i,side,html){ var d=document.createElement('div'); d.className='stepdraw'; d.dataset.i=i; d.innerHTML=html; (side==='L'?procL:procR).appendChild(d); return d; }
  // each step is a coloured 3D scene drawn by gl.js into its .sv box
  sd(0,'L','<div class="sv" data-view="step0"></div><div class="callout" style="left:8%;top:12%"><span class="mono">Stage 02</span><b>Site survey &amp; assessment</b></div><div class="sheetcard" style="right:6%;bottom:10%"><div class="h mono">Our team reviews</div><ul><li>Client requirements</li><li>Drawings &amp; specifications</li><li>Scope of work</li><li>Site conditions</li><li>Completion timelines</li></ul></div>');
  sd(1,'R','<div class="sv" data-view="step1"></div><div class="sheetcard" style="left:6%;top:8%"><div class="h mono">Proposal includes</div><ul><li>Scope of work</li><li>Material specifications</li><li>Quantities</li><li>Exclusions &amp; commercial terms</li><li>Estimated duration</li></ul></div>');
  sd(2,'L','<div class="sv" data-view="step2"></div><div class="callout" style="right:8%;top:12%"><span class="mono">Stages 05 – 07</span><b>Fabrication · Welding · Erection</b></div>');
  sd(3,'R','<div class="sv" data-view="step3"></div><div class="sheetcard" style="left:6%;bottom:8%"><div class="h mono">Handover</div><ul><li>Final inspection</li><li>Completion confirmation</li><li>Handover documentation</li><li>Warranty information</li><li>Final commercial documents</li></ul></div>');
  var stepEls=$$('.stepdraw'), sb=$('#stepbar'), stepI=-1;
  function setStep(i){ if(i===stepI) return; stepI=i; var st=STEPS[i];
    stepEls.forEach(function(d){ d.classList.toggle('on',+d.dataset.i===i); });
    $('#sbT').textContent=st.t; $('#sbS').textContent=st.s; $('#procCount').textContent='0'+(i+1)+' / 04';
    if(innerWidth>820){ if(st.side==='L'){ sb.style.left='calc(50% + 1px)'; sb.style.right='28px'; } else { sb.style.left='28px'; sb.style.right='calc(50% + 1px)'; } } }
  setStep(0);

  /* ---------- blueprint wordmark ---------- */
  function wordmark(){
    var s=$('#wordSvg'); s.innerHTML='';
    var t=el('text',{x:500,y:128,'text-anchor':'middle','font-size':150},s); t.textContent='INFINITY HUB';
    try{ var bb=t.getBBox(), k=960/bb.width; t.setAttribute('font-size',150*k); bb=t.getBBox(); t.setAttribute('y',128+(150-bb.y-bb.height)-12);
      bb=t.getBBox(); s.setAttribute('viewBox','0 '+(bb.y-14)+' 1000 '+(bb.height+28));
      var g=el('g',{class:'g'},s), top=bb.y+bb.height*.06, base=bb.y+bb.height*.94;
      [top,base].forEach(function(y){ el('line',{x1:bb.x-6,y1:y,x2:bb.x+bb.width+6,y2:y,'stroke-dasharray':'2 6'},g); });
      for(var i=0;i<t.getNumberOfChars();i++){ var x=t.getStartPositionOfChar(i).x; if(t.textContent[i]===' ') continue;
        [top,base].forEach(function(y){ el('path',{d:'M'+(x-4)+' '+y+'h8M'+x+' '+(y-4)+'v8'},g); }); var e=t.getEndPositionOfChar(i).x; [top,base].forEach(function(y){ el('path',{d:'M'+(e-4)+' '+y+'h8M'+e+' '+(y-4)+'v8'},g); }); }
      el('path',{d:'M'+(bb.x+bb.width/2-5)+' '+(bb.y+bb.height/2)+'h10M'+(bb.x+bb.width/2)+' '+(bb.y+bb.height/2-5)+'v10'},g);
    }catch(e){}
  }

  /* ---------- statement words ---------- */
  var stw=$('#stWords'); stw.innerHTML=stw.textContent.split(' ').map(function(w){ return '<span class="w">'+w+'</span>'; }).join(' ');
  var words=$$('.w',stw);

  /* ---------- drawer, lightbox, copy, form ---------- */
  var lenis=null; var drawer=$('#drawer'), scrim=$('#scrim'), lastF=null;
  function openDrawer(scope,msg){ lastF=document.activeElement; if(scope) $('#fS').value=scope; if(msg) $('#fM').value=msg; drawer.classList.add('on'); drawer.setAttribute('aria-hidden','false'); scrim.classList.add('on'); if(lenis) lenis.stop(); setTimeout(function(){ $('#fN').focus(); },400); }
  function closeDrawer(){ drawer.classList.remove('on'); drawer.setAttribute('aria-hidden','true'); scrim.classList.remove('on'); if(lenis) lenis.start(); if(lastF&&lastF.focus) lastF.focus({preventScroll:true}); }
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-contact]'); if(b){ e.preventDefault(); openDrawer(b.dataset.scope); } });
  $('#drawerX').addEventListener('click',closeDrawer); scrim.addEventListener('click',closeDrawer);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeDrawer(); });
  function copy(t,b){ var o=b.innerHTML; var done=function(){ b.textContent='Copied'; setTimeout(function(){ b.innerHTML=o; },1500); };
    try{ navigator.clipboard.writeText(t).then(done,function(){ sel(); }); }catch(e){ sel(); }
    function sel(){ var r=document.createRange(); r.selectNodeContents($('#readyT')); var s=getSelection(); s.removeAllRanges(); s.addRange(r); } }
  $$('[data-copy]').forEach(function(b){ b.addEventListener('click',function(){ copy(b.dataset.copy,b); }); });
  IH.openDrawer=openDrawer;
  $('#copyEnq').addEventListener('click',function(){ copy($('#readyT').textContent,this); });
  var form=$('#form');
  function err(id,m){ var f=$('#'+id).closest('.fld'); f.classList.toggle('bad',!!m); $('.err',f).textContent=m||''; return !m; }
  form.addEventListener('submit',function(e){ e.preventDefault();
    var n=form.name.value.trim(), p=form.phone.value.trim(), em=form.email.value.trim(), m=form.message.value.trim(), sc=form.scope.value||'Not specified';
    var ok=[err('fN',n?'':'Please add your name.'),err('fP',/^[+\d][\d\s()-]{6,}$/.test(p)?'':'Please add a phone number, e.g. +971 50 123 4567.'),err('fE',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?'':'Please add a valid email address.'),err('fM',m.length>=10?'':'Tell us a little about the requirement (10+ characters).')].every(Boolean);
    if(!ok){ var b=$('.bad input,.bad textarea',form); if(b) b.focus(); return; }
    var body='Name: '+n+'\nPhone: '+p+'\nEmail: '+em+'\nScope: '+sc+'\n\nRequirement:\n'+m; $('#readyT').textContent=body; $('#ready').hidden=false;
    $('#mailEnq').href='mailto:Info@infinityhubcontracting.com?subject='+encodeURIComponent('Project enquiry – '+n)+'&body='+encodeURIComponent(body); });

  /* ---------- smooth scroll + nav ---------- */
  if(window.Lenis&&!reduce){ lenis=new Lenis({lerp:.085,wheelMultiplier:.95,smoothWheel:true}); IH.lenis=lenis; if(!window.gsap){ (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(); } }
  function goTo(t){ var o=-(parseFloat(getComputedStyle(root).getPropertyValue('--nav'))||60)-8; if(lenis) lenis.scrollTo(t,{offset:o,duration:1.4}); else scrollTo({top:t.getBoundingClientRect().top+scrollY+o,behavior:reduce?'auto':'smooth'}); }
  document.addEventListener('click',function(e){ var a=e.target.closest('a[href^="#"]'); if(!a) return; var id=a.getAttribute('href'); if(id.length<2) return; var t=$(id); if(!t) return; e.preventDefault(); menu(false); goTo(t); });
  var nav=$('#nav'), menuOpen=false, mbtn=$('#menuBtn');
  function menu(o){ menuOpen=o; mbtn.setAttribute('aria-expanded',o?'true':'false'); $$('.nav__cell.l').forEach(function(c){ c.style.display=o?'flex':''; }); nav.style.gridTemplateColumns=o?'1fr':''; nav.style.height=o?'auto':''; }
  mbtn.addEventListener('click',function(){ menu(!menuOpen); });
  function onScroll(){ var y=scrollY; nav.classList.toggle('is-small',y>80);
    var secs=['about','capabilities','process','projects'], cur=null; secs.forEach(function(s){ var t=$('#'+s); if(t&&t.getBoundingClientRect().top<innerHeight*.4) cur=s; });
    $$('.nav__cell[data-sec]').forEach(function(c){ c.classList.toggle('is-on',c.dataset.sec===cur); }); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- principles cards: hover moves the active state ---------- */

  /* ---------- loader: driven by the hero model's plotting progress ---------- */
  var boot=$('#boot'), pct=$('#bootPct'), now=$('#bootNow'), list=$$('#bootList li'), nowI=-1;
  IH.bootProgress=function(p){ var v=Math.round(p*100); pct.firstChild.nodeValue=v; list.forEach(function(li,i){ li.classList.toggle('on',p*10>=i+.3); });
    var k=Math.max(0,Math.min(list.length-1,Math.floor(p*10))); if(k!==nowI){ nowI=k; now.textContent=list[k].textContent; } };
  IH.bootDone=function(){
    var fin=function(){ root.classList.remove('booting'); if(lenis) lenis.start(); scrollTo(0,0); intro(); };
    if(window.gsap&&!reduce){ gsap.to(boot,{opacity:0,duration:.8,ease:'power2.inOut',onComplete:fin}); } else fin();
  };
  if(root.classList.contains('booting')&&lenis) lenis.stop();
  setTimeout(function(){ if(root.classList.contains('booting')) IH.bootDone(); },11000);

  /* ---------- motion ---------- */
  var hasG=!!window.gsap&&!reduce;
  function intro(){ if(!hasG) return;
    gsap.from('.hero__h1',{yPercent:30,opacity:0,duration:1.2,ease:'expo.out'});
    gsap.from('.hero__desc, .hero__more, .ticker',{opacity:0,y:20,duration:1,ease:'expo.out',stagger:.08,delay:.15,clearProps:'all'});
  }
  IH.intro=intro;
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(wordmark); else wordmark();
  if(!hasG){ words.forEach(function(w){ w.classList.add('on'); }); $('#stEng').style.clipPath='none'; showPlanAll(); return; }
  gsap.registerPlugin(ScrollTrigger); if(lenis){ lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0); }
  // statement: words light up; the ink drawing fills in over the line drawing; the sun rises
  ScrollTrigger.create({trigger:'#about',start:'top 70%',end:'bottom 70%',scrub:true,onUpdate:function(s){ var n=Math.round(s.progress*1.4*words.length); words.forEach(function(w,i){ w.classList.toggle('on',i<n); }); }});
  gsap.fromTo('#stEng',{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',ease:'none',scrollTrigger:{trigger:'#stArt',start:'top 75%',end:'bottom 60%',scrub:.6}});
  gsap.fromTo('#stSun',{scale:0},{scale:1,ease:'expo.out',scrollTrigger:{trigger:'#stArt',start:'top 55%',end:'top 10%',scrub:.6}});
  gsap.from('.uc__art .sun, .uc__art .blk',{scale:0,transformOrigin:'50% 50%',duration:1.4,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.uc__art',start:'top 70%',once:true}});
  gsap.from('.cta__art .sun',{scale:0,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'.cta__art',start:'top 75%',once:true}});
  $$('.lead h2, .caps__intro h2, .uc__intro h2, .cta__mid h2').forEach(function(h){ gsap.from(h,{y:40,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%',once:true}}); });
  gsap.from('.ci',{x:30,opacity:0,duration:.9,ease:'expo.out',stagger:.05,scrollTrigger:{trigger:'#capsList',start:'top 85%',once:true},clearProps:'all'});

  // pinned introduction: two statements, then the plan assembles itself
  var w1=$('#w1'), w2=$('#w2'), introT=$('#introT'), introC=$('#introC'), bar=$('#introBar'), introBox=$('#intro');
  var TXT=['Choosing the right contractor is about more than comparing quotations.','Infinity Hub is built around <b>understanding the requirement</b>, communicating clearly and <b>coordinating resources</b>.','We take <b>responsibility for delivering the agreed scope</b>, from the first site visit to handover.'];
  var order=WALLS.map(function(_,i){ return i; }).sort(function(a,b){ return ((a*37)%19)-((b*37)%19); });
  function showPlanAll(){ IH.plan.w=WALLS.map(function(){ return 1; }); IH.plan.d=1; IH.plan.f=1; IH.plan.p=1; mkWrap.style.opacity=1; mkWrap.style.pointerEvents=''; }
  var lastT=-1;
  function pinUpdate(p){ var wT=innerWidth>820?1.15:.8;
    var a=gsap.utils.clamp(0,1,p/.14), b=gsap.utils.clamp(0,1,(p-.14)/.08), c=gsap.utils.clamp(0,1,(p-.30)/.08);
    w1.style.opacity=Math.max(0,1-b*2); w1.style.transform='translateY('+(-b*wT)+'em)';
    w2.style.opacity=Math.max(0,b*2-1)*(1-c); w2.style.transform='translateY('+((1-b)*wT)+'em)'; w2.style.color='rgb('+Math.round(40+150*c)+','+Math.round(40+150*c)+','+Math.round(40+146*c)+')';
    var wp=gsap.utils.clamp(0,1,(p-.34)/.26);
    order.forEach(function(wi,k){ IH.plan.w[wi]=gsap.utils.clamp(0,1,wp*order.length*.75-k*.55); }); IH.plan.f=gsap.utils.clamp(0,1,wp*5); IH.plan.p=gsap.utils.clamp(0,1,(p-.34)/.6);
    IH.plan.d=gsap.utils.clamp(0,1,(p-.6)/.15);
    var mp=gsap.utils.clamp(0,1,(p-.8)/.06); mkWrap.style.opacity=mp; mkWrap.style.pointerEvents=mp>.5?'':'none';
    introBox.style.opacity=gsap.utils.clamp(0,1,(p-.26)/.06);
    var ti=p<.5?0:p<.72?1:2; if(p>=.88) ti=3;
    if(ti!==lastT){ lastT=ti; if(ti<3){ introT.innerHTML=TXT[ti]; introC.textContent='[Scroll to continue]'; } else { introT.innerHTML='Each marker is a stage where we check the work. <b>Click a marker</b> to see what happens there.'; introC.textContent='[Click on a marker]'; } }
    bar.style.transform='scaleX('+gsap.utils.clamp(0,1,(p-.26)/.66)+')';
    if(p<.86) pop.classList.remove('on');
  }
  pinUpdate(0);
  var mm=gsap.matchMedia();
  mm.add('(min-height: 520px)',function(){
    ScrollTrigger.create({trigger:'#pinIn',start:'top '+(innerWidth>820?70:64)+'px',end:'+=330%',pin:true,scrub:.7,onUpdate:function(s){ pinUpdate(s.progress); if(s.progress>.95&&!pop.classList.contains('on')&&!IH._popped){ IH._popped=true; openPop(1); } }});
    ScrollTrigger.create({trigger:'#procPin',start:'top '+(innerWidth>820?70:64)+'px',end:'+=300%',pin:true,scrub:.7,onUpdate:function(s){ setStep(Math.min(3,Math.floor(s.progress*4))); }});
  });
  mm.add('(max-height: 519px)',function(){ showPlanAll(); });
  addEventListener('load',function(){ ScrollTrigger.refresh(); });
})();
