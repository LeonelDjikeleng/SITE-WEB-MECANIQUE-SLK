import sys
src=open('film.src.html').read()
src=src.replace('FONTS/','file:///home/user/SITE-WEB-MECANIQUE-SLK/site/assets/fonts/').replace('RENDER/','file:///home/user/SITE-WEB-MECANIQUE-SLK/projet/film/render/')
src=src.replace('DEFS',open('wheel-defs.html').read())
radar=open('radar.html').read().replace('class="radar"','class="radar-svg"')
src=src.replace('<div id="radar">RADAR</div>','<div id="radar">'+radar+'</div>')
open('film.html','w').write(src)
print('ok')
