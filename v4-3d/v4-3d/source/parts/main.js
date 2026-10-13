/* Infinity Hub Contracting — page logic (content data, UI, motion). The 3D scenes live in the next script. */
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var IH=window.IH=window.IH||{};
  var ARROW='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5"/></svg>';

  /* ---------- content: capabilities (from the company profile) ---------- */
  var CAPS=IH.CAPS=[
    {key:'fitout',code:'C1',name:'Civil & interior fit-out',scale:'1:50',img:'u-cap-fitout',alt:'Bright open-plan office lounge with plants and a timber floor',
     title:'Complete civil and interior solutions, from preparation to finishing.',
     lede:'Civil and interior fit-out designed to turn spaces into functional, durable and professionally finished environments.',
     groups:[['Civil works',['Masonry & blockwork','Block wall construction','Civil modifications','Renovation & refurbishment','Small-scale demolition','Debris removal','Flooring & tiling','Interior finishing']],
             ['Interior fit-out',['Gypsum partitions','Gypsum ceilings','Feature ceilings','Wall panelling','Feature walls','Painting','Flooring']],
             ['MEP & technical',['Electrical works','Plumbing works','Air conditioning','Lighting solutions','Maintenance works']],
             ['Bespoke joinery',['Custom TV walls','Kitchens & cabinets','Wardrobes','Bathroom vanities','Workstations','Storage','Bookshelves','Custom furniture','Study areas']]]},
    {key:'steel',code:'C2',name:'Structural steel',scale:'1:200',img:'u-cap-steel',alt:'Steel roof framing seen from below',
     title:'Engineered for strength. Fabricated for precision. Built to perform.',
     lede:'Fabrication, welding, supply, erection and installation for commercial, industrial, warehouse and residential applications.',
     groups:[['Structural systems',['Structural steel structures','Mezzanine floors','Steel platforms','Steel ramps','Villa structure extensions','Industrial structures','Steel supports']],
             ['Access & safety',['Steel staircases','Spiral staircases','Cat ladders','Handrails','Guardrails','Safety barriers']],
             ['Specialised structures',['Pergolas','Boxing ring cages','Architectural steel structures','Custom fabricated structures']]],
     strip:['Fabrication','Welding','Finishing','Transportation','Erection','Installation']},
    {key:'mezz',code:'C3',name:'Mezzanine floors',scale:'1:100',img:'u-cap-mezz',alt:'Loft interior with a steel mezzanine level',
     title:'Create more usable space without expanding your footprint.',
     lede:'Mezzanine floors and industrial structures for warehouses, workshops, storage, retail and offices.',
     groups:[['Services',['Mezzanine floor structures','Warehouse mezzanines','Industrial platforms','Storage platforms','Steel staircases','Handrails','Safety barriers','Access ramps','Structural supports','Steel extensions']],
             ['Applications',['Warehouses','Workshops','Industrial facilities','Storage areas','Commercial spaces','Retail','Offices']]]},
    {key:'fab',code:'C4',name:'Specialised fabrication',scale:'1:20',img:'u-cap-fab',alt:'Worker grinding a steel beam with sparks flying',
     title:'Custom fabrication for projects that need more than standard solutions.',
     lede:'Mild steel and stainless steel metal works, made to the approved requirement and finished before delivery.',
     groups:[['Services',['Mild steel fabrication','Stainless steel fabrication','Custom metal components','Handrails','Gates','Railings','Platforms','Brackets','Supports','Tanks','Staircases','Architectural metalwork','Repair & modification','Site welding']]]},
    {key:'panel',code:'C5',name:'Sandwich panels',scale:'1:10',img:'u-cap-panel',alt:'Building with a standing-seam metal roof and cladding',
     title:'Insulated walls, roofs and enclosures.',
     lede:'Sandwich panel supply, installation, replacement and enclosure solutions for industrial, commercial, warehouse, cold-storage and modular projects.',
     groups:[['Wall systems',['Insulated wall panels','Internal partition panels','External wall panels','Acoustic panels','Fire-resistant panels']],
             ['Roof systems',['Insulated roof panels','Industrial roofing systems','Warehouse roofing']],
             ['Specialised applications',['Cold storage panels','Temperature-controlled enclosures','Modular building enclosures','Prefabricated structures','Industrial enclosures']],
             ['Services',['Supply','Installation','Replacement','Modification','Maintenance']]]},
    {key:'shade',code:'C6',name:'Parking & building shades',scale:'1:100',img:'u-cap-shade',alt:'Triangular fabric shade sails against the sky',
     title:'Designed for protection. Built for the UAE climate.',
     lede:'We design, fabricate and install durable shade structures for residential, commercial, industrial and public spaces.',
     groups:[['Parking solutions',['Residential parking shades','Commercial parking shades','Industrial parking shades','Freestanding carports','Cantilever parking shades']],
             ['Roof systems',['Custom parking shades','UV-resistant shade systems','Waterproof shade systems','Powder-coated steel structures','Fabric shade systems']],
             ['Shade structures',['Arch-shaped shades','Steel & fabric structures','Tensile shade structures','Building entrance shades','Walkway shades','Corridor shades','Outdoor area shades','Pergola structures']]]},
    {key:'ring',code:'C7',name:'Boxing rings',scale:'1:50',img:'u-cap-ring',alt:'Boxing ring in a training gym',
     title:'Built for training. Designed for performance. Ready for competition.',
     lede:'Design, manufacture, installation, maintenance and rental of boxing rings, with event setup and dismantling. Sizes: 5m×5m, 6m×6m and 7m×7m.',
     groups:[['Services',['Custom boxing ring design','Manufacturing','Professional boxing rings','Custom branding','Installation','Maintenance','Repairs','Rentals','Event setup','Event dismantling','Transportation']],
             ['Applications',['Boxing gyms','Sports clubs','Training centres','Competitions','Exhibitions','Corporate events','Temporary installations']]]}
  ];

  // our work: a corridor of 3D models (one per kind of work); clicking one opens that capability
  var CATS=IH.CATS=[['all','All'],['steel','Steel & fabrication'],['shades','Shades'],['interior','Interior'],['events','Events']];
  var PHOTOS=IH.PHOTOS=[
    {cat:'steel',key:'steel',name:'Steel portal frame',cap:1},
    {cat:'shades',key:'shade',name:'Cantilever parking shade',cap:5},
    {cat:'interior',key:'fitout',name:'Interior fit-out',cap:0},
    {cat:'steel',key:'mezz',name:'Mezzanine floor',cap:2},
    {cat:'shades',key:'sail',name:'Tensile shade sails',cap:5},
    {cat:'events',key:'ring',name:'Boxing ring',cap:6},
    {cat:'steel',key:'fab',name:'Spiral staircase',cap:3},
    {cat:'steel',key:'panel',name:'Sandwich panels',cap:4}];
  var COUNTS={}; PHOTOS.forEach(function(p){ COUNTS[p.cat]=(COUNTS[p.cat]||0)+1; });
  function catName(c){ for(var i=0;i<CATS.length;i++) if(CATS[i][0]===c) return CATS[i][1]; return ''; }
  IH.catName=catName;

  /* ---------- Lenis smooth scroll ---------- */
  var lenis=null;
  if(window.Lenis && !reduce){
    lenis=new Lenis({lerp:.1,wheelMultiplier:1});
    IH.lenis=lenis;
    if(window.gsap){ gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(); }
  }
  function goTo(el,off){
    if(typeof el==='string') el=document.querySelector(el); if(!el) return;
    var o=off==null?-((document.getElementById('hdr')||{}).offsetHeight||0):off;
    if(lenis) lenis.scrollTo(el,{offset:o,duration:1.4});
    else window.scrollTo({top:el.getBoundingClientRect().top+scrollY+o,behavior:reduce?'auto':'smooth'});
  }
  IH.goTo=goTo;
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a) return;
    var id=a.getAttribute('href'); if(id.length<2) return;
    var t=document.querySelector(id); if(!t) return;
    e.preventDefault(); setMenu(false); goTo(t, id==='#top'?0:null);
  });

  /* ---------- hero steps: four cards that play through a project; the 3D building follows ---------- */
  (function(){
    var hero=document.getElementById('top'), cards=[].slice.call(document.querySelectorAll('.hs')), caps=[].slice.call(document.querySelectorAll('.hero__cap span'));
    if(!cards.length) return; var D=3800, timer=null, paused=false;
    function set(i){ IH.heroStep=i; cards.forEach(function(c,k){ c.setAttribute('aria-selected',k===i?'true':'false'); c.classList.toggle('done',k<i); c.tabIndex=k===i?0:-1;
        var bar=c.querySelector('.hs__bar i'); if(k===i){ bar.style.animation='none'; void bar.offsetWidth; bar.style.animation=''; } });
      caps.forEach(function(c,k){ c.classList.toggle('on',k===i); });
      clearTimeout(timer); if(!paused) timer=setTimeout(function(){ set((i+1)%cards.length); },D); }
    hero.style.setProperty('--hs-d',D/1000+'s');
    cards.forEach(function(c,i){ c.addEventListener('click',function(){ paused=true; hero.classList.add('is-paused'); set(i); clearTimeout(timer); timer=setTimeout(function(){ paused=false; hero.classList.remove('is-paused'); set((i+1)%cards.length); },9000); });
      c.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); var n=(i+(e.key==='ArrowRight'?1:-1)+cards.length)%cards.length; cards[n].focus(); cards[n].click(); } }); });
    if(reduce){ paused=true; hero.classList.add('is-paused'); set(3); } else set(0);
  })();

  /* ---------- header: solid after the hero, hides going down, active section marker ---------- */
  var hdr=document.getElementById('hdr'), prog=document.getElementById('prog'), lastY=0;
  var navLinks=[].slice.call(document.querySelectorAll('.bar__nav a[data-sec]'));
  var secs=navLinks.map(function(a){ return document.getElementById(a.dataset.sec); });
  function onScroll(){
    var y=window.scrollY||0, H=document.documentElement.scrollHeight-innerHeight;
    hdr.classList.toggle('is-solid',y>innerHeight*.6);
    if(!menuOpen){ if(y>lastY+6&&y>innerHeight) hdr.classList.add('is-hidden'); else if(y<lastY-6||y<innerHeight) hdr.classList.remove('is-hidden'); }
    lastY=y; prog.style.transform='scaleX('+(H>0?y/H:0).toFixed(4)+')';
    var cur=-1; secs.forEach(function(s,i){ if(s&&s.getBoundingClientRect().top<innerHeight*.45) cur=i; });
    navLinks.forEach(function(a,i){ a.classList.toggle('is-on',i===cur); });
  }
  if(lenis) lenis.on('scroll',onScroll); window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- mobile menu ---------- */
  var menuOpen=false, menuBtn=document.getElementById('menuBtn');
  function setMenu(o){
    if(menuOpen===o) return; menuOpen=o; root.classList.toggle('is-menu',o); menuBtn.setAttribute('aria-expanded',o?'true':'false');
    if(lenis){ o?lenis.stop():lenis.start(); }
  }
  menuBtn.addEventListener('click',function(){ setMenu(!menuOpen); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ setMenu(false); closeLb(); } });

  /* ---------- custom cursor with context words ---------- */
  var cur=document.getElementById('cursor'), curTxt=document.getElementById('cursorTxt');
  if(canHover && !reduce){
    var cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    window.addEventListener('pointermove',function(e){ tx=e.clientX; ty=e.clientY; cur.classList.add('on'); var t=e.target.closest('[data-cursor]'); if(t){ cur.classList.add('big'); curTxt.textContent=t.dataset.cursor; } else cur.classList.remove('big'); },{passive:true});
    document.addEventListener('pointerleave',function(){ cur.classList.remove('on'); });
    (function loop(){ cx+=(tx-cx)*.22; cy+=(ty-cy)*.22; cur.style.transform='translate('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px)'; requestAnimationFrame(loop); })();
  }

  /* ---------- B · mission / vision flip cards ---------- */
  [].slice.call(document.querySelectorAll('.flip')).forEach(function(card){
    var front=card.querySelector('.flip__front button'), back=card.querySelector('.flip__back button');
    var faces=card.querySelectorAll('.flip__face');
    function set(f){ card.classList.toggle('is-flipped',f); front.setAttribute('aria-expanded',f?'true':'false');
      faces[0].toggleAttribute('inert',f); faces[1].toggleAttribute('inert',!f); (f?back:front).focus({preventScroll:true}); }
    faces[1].setAttribute('inert','');
    front.addEventListener('click',function(){ set(true); });
    back.addEventListener('click',function(){ set(false); });
  });

  /* ---------- C · capability tabs + panel ---------- */
  var tabs=document.getElementById('capTabs'), panel=document.getElementById('capPanel');
  var capCode=document.getElementById('capCode'), capScale=document.getElementById('capScale'), sizes=document.getElementById('ringSizes');
  CAPS.forEach(function(c,i){
    var b=document.createElement('button'); b.type='button'; b.className='caps__tab'; b.setAttribute('role','tab'); b.id='tab-'+c.key;
    b.setAttribute('aria-controls','capPanel'); b.setAttribute('aria-selected',i===0?'true':'false'); b.tabIndex=i===0?0:-1;
    b.innerHTML='<span class="mono">'+c.code+'</span><span>'+c.name+'</span>'+ARROW;
    b.addEventListener('click',function(){ selectCap(i,true); });
    tabs.appendChild(b);
  });
  tabs.addEventListener('keydown',function(e){
    var n=capIdx; if(e.key==='ArrowDown'||e.key==='ArrowRight') n=(capIdx+1)%CAPS.length; else if(e.key==='ArrowUp'||e.key==='ArrowLeft') n=(capIdx+CAPS.length-1)%CAPS.length; else return;
    e.preventDefault(); selectCap(n,true); tabs.children[n].focus();
  });
  function panelHTML(c){
    var items=[]; c.groups.forEach(function(g){ g[1].forEach(function(x){ if(items.length<6&&items.indexOf(x)<0) items.push(x); }); });
    return '<div class="caps__txt"><h3>'+c.title+'</h3><p class="lede">'+c.lede+'</p></div>'+
      '<div class="caps__meta"><ul class="caps__items">'+items.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'+
      '<a class="caps__cta" href="#contact">Enquire about '+c.name.toLowerCase()+' '+ARROW+'</a></div>';
  }
  var capIdx=0, swapT=null;
  function selectCap(i,user){
    var c=CAPS[i]; capIdx=i;
    [].forEach.call(tabs.children,function(b,k){ b.setAttribute('aria-selected',k===i?'true':'false'); b.tabIndex=k===i?0:-1; });
    panel.setAttribute('aria-labelledby','tab-'+c.key);
    capCode.textContent=c.code+' · '+c.name; capScale.textContent='Scale '+c.scale;
    sizes.hidden=c.key!=='ring';
    if(!user){ panel.innerHTML=panelHTML(c); }
    else { panel.classList.add('is-out'); clearTimeout(swapT); swapT=setTimeout(function(){ panel.innerHTML=panelHTML(c); panel.classList.remove('is-out'); },reduce?0:280); }
    if(IH.capScene) IH.capScene.show(i);
  }
  IH.selectCap=selectCap;
  IH.capIndex=function(){ return capIdx; };
  selectCap(0,false);
  [].forEach.call(sizes.querySelectorAll('button'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(sizes.querySelectorAll('button'),function(o){ o.setAttribute('aria-pressed',o===b?'true':'false'); });
      if(IH.capScene) IH.capScene.ringSize(+b.dataset.size);
    });
  });
  // seamless marquee
  var mq=document.getElementById('marquee'); mq.innerHTML+=mq.innerHTML;
  [].forEach.call(mq.children,function(n,i){ if(i>=6) n.setAttribute('aria-hidden','true'); });

  /* ---------- D · process: feature card + row of stage cards ---------- */
  var ptrack=document.getElementById('procTrack'), pcards=[].slice.call(ptrack.children), N=pcards.length, active=-1, pP=0;
  var pfN=document.getElementById('pfN'), pfTxt=document.getElementById('pfTxt'), pfNums=[].slice.call(document.querySelectorAll('#pfNums button')), ptabs=[].slice.call(document.querySelectorAll('#procTabs button'));
  var procCount=document.getElementById('procCount'), pPrev=document.getElementById('procPrev'), pNext=document.getElementById('procNext'), pNext2=document.getElementById('procNext2'), pfT=0;
  function stageData(i){ var t=pcards[i].querySelector('template').content, d={}; [].forEach.call(t.querySelectorAll('[data-k]'),function(e){ d[e.dataset.k]=e.innerHTML; }); d.n=pcards[i].querySelector('.pcard__n').textContent; d.title=pcards[i].querySelector('h3').innerHTML; return d; }
  function fill(i){ var d=stageData(i);
    function put(){ pfN.textContent=d.n; document.getElementById('pfTag').innerHTML=d.tag; document.getElementById('pfTitle').innerHTML=d.title; document.getElementById('pfSub').innerHTML=d.sub; document.getElementById('pfList').innerHTML=d.ul; document.getElementById('pfObj').innerHTML=d.obj; pfTxt.classList.remove('swap'); pfN.classList.remove('swap'); }
    clearTimeout(pfT); if(reduce||active<0){ put(); return; } pfTxt.classList.add('swap'); pfN.classList.add('swap'); pfT=setTimeout(put,220); }
  function pStep(){ return pcards[1].offsetLeft-pcards[0].offsetLeft; }
  function setP(p){ pP=p; IH.procP=p; var idx=Math.max(0,Math.min(N-1,Math.round(p)));
    var st=pStep(), pr=ptrack.parentNode, visW=pr.clientWidth-parseFloat(getComputedStyle(pr).paddingLeft)-24, maxSh=Math.max(0,(ptrack.scrollWidth-visW)/st), sh=Math.max(0,Math.min(p+1,Math.ceil(maxSh-.08)));
    ptrack.style.transform='translate3d('+(-sh*st).toFixed(1)+'px,0,0)';
    pcards.forEach(function(c,i){ c.classList.toggle('is-cur',i===idx); });
    if(idx!==active){ fill(idx); active=idx; IH.procActive=idx;
      pfNums.forEach(function(b,i){ b.setAttribute('aria-current',i===idx?'true':'false'); });
      var ph=idx<3?0:idx<6?1:2; ptabs.forEach(function(b,i){ b.setAttribute('aria-pressed',i===ph?'true':'false'); });
      procCount.textContent='Stage '+('0'+(idx+1)).slice(-2)+' / '+('0'+N).slice(-2); pPrev.disabled=idx===0; pNext.disabled=pNext2.disabled=idx===N-1;
      }
  }
  var procST=null;
  function toStep(i){
    i=Math.max(0,Math.min(N-1,i));
    if(procST){ var y=procST.start+(procST.end-procST.start)*(i/(N-1)); if(lenis) lenis.scrollTo(y,{duration:1.2}); else window.scrollTo({top:y,behavior:'smooth'}); }
    else if(window.gsap&&!reduce) gsap.to({a:pP},{a:i,duration:.9,ease:'expo.out',onUpdate:function(){ setP(this.targets()[0].a); }});
    else setP(i);
  }
  IH.procTo=toStep;
  pPrev.addEventListener('click',function(){ toStep(active-1); }); pNext.addEventListener('click',function(){ toStep(active+1); }); pNext2.addEventListener('click',function(){ toStep(active+1); });
  pfNums.forEach(function(b,i){ b.addEventListener('click',function(){ toStep(i); }); });
  ptabs.forEach(function(b){ b.addEventListener('click',function(){ toStep(+b.dataset.i); }); });
  pcards.forEach(function(c,i){ c.querySelector('.pcard__sq').addEventListener('click',function(){ toStep(i); }); });
  setP(0); window.addEventListener('resize',function(){ setP(pP); });

  /* ---------- E · our work filters ---------- */
  var filters=document.getElementById('filters'), galCount=document.getElementById('galCount'), galList=document.getElementById('galList');
  var curCat='all';
  CATS.forEach(function(c){
    var n=c[0]==='all'?PHOTOS.length:COUNTS[c[0]];
    var b=document.createElement('button'); b.type='button'; b.dataset.cat=c[0]; b.setAttribute('aria-pressed',c[0]==='all'?'true':'false');
    b.innerHTML=c[1]+'<sup>'+('0'+n).slice(-2)+'</sup>';
    b.addEventListener('click',function(){ setCat(c[0]); }); filters.appendChild(b);
  });
  function visible(){ return PHOTOS.filter(function(p){ return curCat==='all'||p.cat===curCat; }); }
  function setCat(c){
    curCat=c; [].forEach.call(filters.children,function(b){ b.setAttribute('aria-pressed',b.dataset.cat===c?'true':'false'); });
    var v=visible(); galCount.textContent=v.length+' models · '+(c==='all'?'All':catName(c));
    galList.innerHTML=v.map(function(p,i){ return '<li><button type="button" data-i="'+i+'">View '+p.name+' in capabilities</button></li>'; }).join('');
    if(IH.gallery) IH.gallery.filter(c);
  }
  IH.visiblePhotos=visible;
  function openWork(p){ if(IH.selectCap) IH.selectCap(p.cap,true); if(IH.goTo) IH.goTo('#capabilities'); }
  IH.openWork=openWork;
  galList.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b) openWork(visible()[+b.dataset.i]); });
  setCat('all');

  /* ---------- F · why: tall cards over a photo stage ---------- */
  (function why(){
    var track=document.getElementById('whyTrack'); if(!track) return;
    var cards=[].slice.call(track.querySelectorAll('.wcard')), bgs=[].slice.call(document.querySelectorAll('#whyBg img'));
    var count=document.getElementById('whyCount'), prev=document.getElementById('whyPrev'), next=document.getElementById('whyNext');
    var n=cards.length, active=0, shown=0, hoverI=-1;
    function bg(i){ if(i===shown) return; shown=i; bgs.forEach(function(b,k){ b.classList.toggle('on',k===i); }); }
    function setActive(i){ active=i; cards.forEach(function(c,k){ c.classList.toggle('is-on',k===i); });
      count.textContent=('0'+(i+1)).slice(-2)+' / '+('0'+n).slice(-2); prev.disabled=i===0; next.disabled=i===n-1; if(hoverI<0) bg(i); }
    function step(){ return cards[1].offsetLeft-cards[0].offsetLeft; }
    var tw=null;
    function snap(on){ track.style.scrollSnapType=on?'':'none'; }
    function go(i){ i=Math.max(0,Math.min(n-1,i)); var x=Math.min(cards[i].offsetLeft-cards[0].offsetLeft,track.scrollWidth-track.clientWidth); setActive(i); lock=true;
      if(tw) tw.kill(); if(reduce||!window.gsap){ snap(false); track.scrollLeft=x; snap(true); lock=false; return; }
      snap(false); tw=gsap.to(track,{scrollLeft:x,duration:.8,ease:'expo.out',onComplete:function(){ snap(true); lock=false; }}); }
    IH.whySnap=snap;
    var raf=0, lock=false; track.addEventListener('scroll',function(){ if(raf||lock) return; raf=requestAnimationFrame(function(){ raf=0; var i=Math.min(n-1,Math.round(track.scrollLeft/step())); if(i!==active) setActive(i); }); },{passive:true});
    prev.addEventListener('click',function(){ go(active-1); }); next.addEventListener('click',function(){ go(active+1); });
    track.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'){ e.preventDefault(); go(active+1); } if(e.key==='ArrowLeft'){ e.preventDefault(); go(active-1); } });
    cards.forEach(function(c,i){
      c.addEventListener('click',function(){ if(i!==active) go(i); });
      if(canHover){ c.addEventListener('pointerenter',function(){ hoverI=i; bg(i); }); c.addEventListener('pointerleave',function(){ hoverI=-1; bg(active); }); }
    });
    // warm the backdrop images once the section is near
    if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ bgs.concat(cards.map(function(c){ return c.querySelector('img'); })).forEach(function(im){ im.loading='eager'; }); io.disconnect(); } },{rootMargin:'600px 0px'}); io.observe(track); }
    setActive(0);
  })();

  /* ---------- F · quality & safety diagram ---------- */
  (function qs(){
    var root=document.getElementById('qs'); if(!root) return;
    var rows=[].slice.call(root.querySelectorAll('.qs__list li')), fig=root.querySelector('.qv'), on=0, hold=false, vis=false, timer=0, D=4000;
    function set(i){ on=i; fig.setAttribute('data-on',String(i)); rows.forEach(function(r,k){ r.classList.remove('on'); if(k===i){ void r.offsetWidth; r.classList.add('on'); } }); }
    function tick(){ clearTimeout(timer); if(hold||!vis||reduce) return; timer=setTimeout(function(){ set((on+1)%rows.length); tick(); },D); }
    root.style.setProperty('--qd',D+'ms');
    rows.forEach(function(r,i){ r.addEventListener('pointerenter',function(){ hold=true; root.classList.add('is-paused'); set(i); clearTimeout(timer); });
      r.addEventListener('pointerleave',function(){ hold=false; root.classList.remove('is-paused'); tick(); }); });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; if(vis) tick(); else clearTimeout(timer); },{threshold:.3}).observe(root); else vis=true;
    set(0); if(reduce) root.classList.add('is-paused');
    // the circles draw themselves in
    if(window.gsap&&!reduce){ gsap.fromTo(root.querySelectorAll('.qv__c'),{strokeDashoffset:1},{strokeDashoffset:0,duration:2,ease:'expo.inOut',stagger:.2,scrollTrigger:{trigger:fig,start:'top 80%',once:true}});
      gsap.from(root.querySelectorAll('.qv__l, .qv__cl, .qv__core, .qv__grid line'),{opacity:0,duration:1,stagger:.08,delay:.8,scrollTrigger:{trigger:fig,start:'top 80%',once:true}}); }
  })();

  /* ---------- G · enquiry form: validates and prepares an email, never claims to send ---------- */
  var pick=document.getElementById('svcPick');
  CAPS.forEach(function(c){ pick.insertAdjacentHTML('beforeend','<label><input type="checkbox" name="scope" value="'+c.name+'">'+c.name+'</label>'); });
  var form=document.getElementById('form'), ready=document.getElementById('ready'), readyTxt=document.getElementById('readyTxt');
  function err(id,msg){ var f=document.getElementById(id).closest('.field'); f.classList.toggle('bad',!!msg); f.querySelector('.err').textContent=msg||''; return !msg; }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var n=form.name.value.trim(), ph=form.phone.value.trim(), em=form.email.value.trim(), m=form.message.value.trim();
    var ok=[err('fName',n?'':'Please add your name.'),
            err('fPhone',/^[+\d][\d\s()-]{6,}$/.test(ph)?'':'Please add a phone number we can call, e.g. +971 50 123 4567.'),
            err('fEmail',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?'':'Please add a valid email address.'),
            err('fMsg',m.length>=10?'':'Tell us a little about the requirement (at least 10 characters).')].every(Boolean);
    if(!ok){ var b=form.querySelector('.bad input,.bad textarea'); if(b) b.focus(); return; }
    var scope=[].map.call(form.querySelectorAll('input[name=scope]:checked'),function(c){return c.value}).join(', ')||'Not specified';
    var body='Name: '+n+'\nPhone: '+ph+'\nEmail: '+em+'\nScope: '+scope+'\n\nRequirement:\n'+m;
    readyTxt.textContent=body; ready.hidden=false;
    document.getElementById('mailEnq').href='mailto:Info@infinityhubcontracting.com?subject='+encodeURIComponent('Project enquiry – '+n)+'&body='+encodeURIComponent(body);
    ready.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'});
  });
  function copyText(t,btn){
    var done=function(){ var o=btn.textContent; btn.textContent='Copied'; setTimeout(function(){ btn.textContent=o; },1600); };
    try{ navigator.clipboard.writeText(t).then(done,function(){ sel(); }); }catch(e){ sel(); }
    function sel(){ var r=document.createRange(); r.selectNodeContents(readyTxt.contains(btn)?readyTxt:btn.previousElementSibling||btn); var s=getSelection(); s.removeAllRanges(); s.addRange(r); }
  }
  document.getElementById('copyEnq').addEventListener('click',function(){ copyText(readyTxt.textContent,this); });
  [].forEach.call(document.querySelectorAll('.copy'),function(b){ b.addEventListener('click',function(){ copyText(b.dataset.copy,b); }); });

  /* ---------- videos play only on screen ---------- */
  var vids=[].slice.call(document.querySelectorAll('video[data-auto]'));
  if('IntersectionObserver' in window){
    var vio=new IntersectionObserver(function(es){ es.forEach(function(en){ var v=en.target;
      if(en.isIntersecting&&!reduce){ if(v.preload==='none') v.preload='auto'; var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); }); },{rootMargin:'200px 0px'});
    vids.forEach(function(v){ vio.observe(v); });
  }

  /* ---------- boot loader: real loading (fonts, 3D library, hero scene), min 2.2 s ---------- */
  var boot=document.querySelector('.boot'), pctEl=document.getElementById('bootPct'), bar=document.getElementById('bootBar'), xy=document.getElementById('bootXY');
  var lines=[].slice.call(document.querySelectorAll('.boot__log li'));
  var waits=[document.fonts?document.fonts.ready:Promise.resolve(), new Promise(function(r){ IH.heroReady=r; setTimeout(r,6000); })];
  var loaded=0; waits.forEach(function(p){ p.then(function(){ loaded++; }); });
  var t0=performance.now(), shown=0, finished=false, MIN=reduce?0:3000;
  function bootTick(now){
    if(finished) return;
    var el=now-t0, real=loaded/waits.length, cap=MIN?Math.min(1,el/MIN):1, target=Math.min(cap,.15+real*.85);
    shown+=(target-shown)*.12; if(target-shown<.003) shown=target;
    IH.bootP=shown; var p=Math.round(shown*100); pctEl.textContent=p; bar.style.transform='scaleX('+shown.toFixed(3)+')';
    lines.forEach(function(li,i){ li.classList.toggle('on',shown*10>=i+.5); });
    xy.textContent='X '+('000'+Math.round(shown*2480)).slice(-4)+' · Y '+('000'+Math.round(Math.sin(shown*3)*900+900)).slice(-4);
    if(shown>=1&&el>=MIN){ finishBoot(); return; }
    requestAnimationFrame(bootTick);
  }
  function finishBoot(){
    if(finished) return; finished=true; IH.bootP=1; if(IH.bootExit) IH.bootExit();
    var done=function(){ root.classList.remove('booting'); if(lenis) lenis.start(); window.scrollTo(0,0); IH.intro&&IH.intro(); };
    if(window.gsap&&!reduce){ gsap.to(boot,{clipPath:'inset(0 0 100% 0)',duration:1.05,ease:'expo.inOut',onComplete:done}); setTimeout(function(){ IH.introStart&&IH.introStart(); },350); }
    else done();
  }
  if(root.classList.contains('booting')){ if(lenis) lenis.stop(); requestAnimationFrame(bootTick); boot.addEventListener('click',finishBoot); setTimeout(finishBoot,9000); }
  else setTimeout(function(){ IH.intro&&IH.intro(); },50);

  /* ---------- motion layer (GSAP) ---------- */
  if(!window.gsap||reduce){ IH.intro=function(){}; return; }
  gsap.registerPlugin(ScrollTrigger); var hasSplit=!!window.SplitText; if(hasSplit) gsap.registerPlugin(SplitText);
  if(lenis) lenis.on('scroll',ScrollTrigger.update);

  function words(el,opt){
    opt=opt||{}; if(!hasSplit) return gsap.from(el,{y:40,opacity:0,duration:1.2,ease:'expo.out'});
    var sp=new SplitText(el,{type:'lines,words',linesClass:'ln',mask:'lines'});
    return gsap.from(sp.words,{yPercent:110,duration:opt.d||1.4,ease:'expo.out',stagger:opt.s||.05,onComplete:function(){ sp.revert(); }});
  }
  // hero intro after the loader lifts
  var heroTitle=document.getElementById('heroTitle');
  var heroBits=[document.querySelector('.hero__chip'),document.querySelector('.hero__lead'),document.querySelector('.hero__ctas'),document.querySelector('.hero__foot')];
  var introPlayed=false;
  IH.introStart=function(){ if(introPlayed) return; introPlayed=true;
    words(heroTitle,{d:1.6,s:.07});
    gsap.from(heroBits,{y:30,opacity:0,duration:1.2,ease:'expo.out',stagger:.08,delay:.25,clearProps:'transform,opacity'});
  };
  IH.intro=function(){ IH.introStart(); ScrollTrigger.refresh(); };

  // headings rise word by word as they enter
  [].forEach.call(document.querySelectorAll('.sheet-head .h2, .qs__head .h2'),function(h){
    var sp=hasSplit?new SplitText(h,{type:'lines,words',mask:'lines'}):null;
    gsap.from(sp?sp.words:h,{yPercent:sp?110:0,y:sp?0:30,opacity:sp?1:0,duration:1.4,ease:'expo.out',stagger:.04,
      scrollTrigger:{trigger:h,start:'top 86%',once:true},onComplete:function(){ sp&&sp.revert(); }});
  });
  // statement: words light up with scroll
  [].forEach.call(document.querySelectorAll('[data-words]'),function(el){
    if(!hasSplit) return; var sp=new SplitText(el,{type:'words'});
    gsap.fromTo(sp.words,{opacity:.14},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:el,start:'top 80%',end:'bottom 45%',scrub:.6}});
  });
  // film tilts flat as it arrives
  gsap.fromTo('#film',{rotateX:8,rotateY:-7,scale:.96},{rotateX:0,rotateY:0,scale:1,ease:'none',scrollTrigger:{trigger:'#film',start:'top bottom',end:'center 55%',scrub:.8}});
  // cards fly in on 3D paths
  gsap.from('.flip',{rotateX:-30,y:80,opacity:0,transformOrigin:'50% 100%',duration:1.3,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.mv',start:'top 85%',once:true},clearProps:'transform,opacity'});
  gsap.from('.whyx__side > *',{y:40,opacity:0,duration:1.2,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:'#whyx',start:'top 80%',once:true},clearProps:'transform,opacity'});
  gsap.from('#whyTrack',{x:220,opacity:0,duration:1.5,ease:'expo.out',scrollTrigger:{trigger:'#whyx',start:'top 80%',once:true},clearProps:'transform,opacity'});
  gsap.from('.wcard, .wend',{clipPath:'inset(0% 0% 0% 100% round 14px)',duration:1.3,ease:'expo.inOut',stagger:.08,scrollTrigger:{trigger:'#whyx',start:'top 80%',once:true},clearProps:'clipPath'});
  gsap.from('.caps__ui > *',{y:60,opacity:0,duration:1.3,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.caps__ui',start:'top 85%',once:true},clearProps:'transform,opacity'});
  gsap.from('.gallery',{clipPath:'inset(12% 8% 12% 8% round 16px)',duration:1.6,ease:'expo.inOut',scrollTrigger:{trigger:'.gallery',start:'top 85%',once:true},clearProps:'clipPath'});
  gsap.from('.reach > div, .form',{y:50,opacity:0,duration:1.2,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:'.contact__grid',start:'top 85%',once:true},clearProps:'transform,opacity'});
  // hero copy sinks as you scroll into the page (the 3D scene reads the same progress)
  gsap.to('.hero__copy',{yPercent:30,opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 30%',scrub:true}});
  ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',onUpdate:function(s){ IH.heroProgress=s.progress; }});
  // process: pin the panel; scrolling moves through the stages
  var mm=gsap.matchMedia();
  mm.add('(min-height: 560px)',function(){
    var proxy={a:0};
    var tw=gsap.to(proxy,{a:N-1,ease:'none',onUpdate:function(){ setP(proxy.a); },
      scrollTrigger:{trigger:'#procPin',start:'top top',end:'+='+(N-1)*Math.max(320,innerHeight*.55),pin:true,scrub:.8,
        snap:{snapTo:1/(N-1),duration:{min:.2,max:.6},ease:'power2.out',delay:.08}}});
    procST=tw.scrollTrigger;
    // our work: pin the corridor and fly through it with scroll
    var galST=ScrollTrigger.create({trigger:'#gallery',start:'top top',end:'+=260%',pin:true,scrub:true,onUpdate:function(s){ IH.galP=s.progress; }});
    return function(){ procST=null; galST.kill(); IH.galP=0; };
  });
  window.addEventListener('load',function(){ ScrollTrigger.refresh(); });
})();
