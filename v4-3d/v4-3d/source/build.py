# Assemble the page: site.html (artifact fragment) and index.html (standalone)
import re,os
P='parts/'
css=open(P+'style.css').read(); body=open(P+'body.html').read(); main=open(P+'main.js').read(); three=open(P+'three.js').read()
mark=open('src/mark_d.txt').read().strip()
head='''<title>Infinity Hub Contracting</title>
<meta name="description" content="Infinity Hub Contracting LLC, Dubai: civil works, interior fit-out, structural steel, mezzanines, fabrication, sandwich panels, parking shades and boxing rings across the UAE.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap">
<script>
(function(){ var d=document.documentElement; d.classList.add('js');
  try{ if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem('ih4-noboot')) d.classList.add('booting'); }catch(e){ d.classList.add('booting'); }
  setTimeout(function(){ d.classList.remove('booting'); },12000);
})();
</script>
<style>
'''+css+'''
</style>
'''
scripts='''
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/SVGLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/environments/RoomEnvironment.js"></script>
<script>window.IH=window.IH||{};IH.MARK="'''+mark+'''";</script>
<script>
'''+main+'''
</script>
<script>
'''+three+'''
</script>
'''
frag=head+body+scripts
open('site.html','w').write(frag)
full='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#0c0c0e">\n'+head+'</head>\n<body>\n'+body+scripts+'</body>\n</html>\n'
open('index.html','w').write(full)
print('site.html %d KB, index.html %d KB'%(len(frag)//1024,len(full)//1024))
