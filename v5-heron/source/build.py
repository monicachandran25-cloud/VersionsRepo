P='parts/'
css=open(P+'style.css').read(); body=open(P+'body.html').read(); main=open(P+'main.js').read(); gl=open(P+'gl.js').read()
head='''<title>Infinity Hub Contracting</title>
<meta name="description" content="Infinity Hub Contracting LLC, Dubai: construction, contracting, structural steel, fit-out and shade solutions across the UAE.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<script>(function(){ var d=document.documentElement; d.classList.add('js'); try{ if(!matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem('ih5-noboot')) d.classList.add('booting'); }catch(e){} setTimeout(function(){ d.classList.remove('booting'); },12000); })();</script>
<style>
'''+css+'''
</style>
'''
scripts='''
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>
<script>
'''+main+'''
</script>
<script>
'''+gl+'''
</script>
'''
frag=head+body+scripts
open('site.html','w').write(frag)
full='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#f3f3ee">\n'+head+'</head>\n<body>\n'+body+scripts+'</body>\n</html>\n'
open('index.html','w').write(full)
print('site.html %d KB'%(len(frag)//1024))
