# Arma una vista previa de la home como página suelta (rutas relativas, fuentes embebidas) a partir de dist/.
import re, os, base64, shutil, glob, json
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','dist'); OUT=os.getcwd()   # correr desde una carpeta vacía
for d in ('js','media'): shutil.rmtree(d, ignore_errors=True)
h=open(f'{D}/index.html').read()
css=open(glob.glob(f'{D}/_astro/*.css')[0]).read()
def font(m):
    p=m.group(1); data=base64.b64encode(open(D+p,'rb').read()).decode(); return f'url("data:font/woff2;base64,{data}")'
css=re.sub(r'url\("?(/fonts/[^")]+)"?\)', font, css)
js_src=glob.glob(f'{D}/_astro/*.js')[0]; js=open(js_src).read()
assert '/media/bathy.json' in js; js=js.replace('"/media/bathy.json"','"media/bathy.json"').replace("'/media/bathy.json'","'media/bathy.json'")
os.makedirs('js',exist_ok=True); open('js/app.js','w').write(js)
shutil.copytree(f'{D}/media','media')
inline=re.search(r'<script>(.*?)</script>', h, re.S).group(1)
body=re.search(r'<body[^>]*>(.*)</body>', h, re.S).group(1)
body=re.sub(r'<script type="module" src="[^"]+"></script>', '<script type="module" src="js/app.js"></script>', body)
body=body.replace('="/media/','="media/').replace('url(/media/','url(media/')
for a,b in [('href="/portfolio"','href="#portfolio"'),('href="/servicios"','href="#superficie"'),('href="/ia"','href="#abismo"'),('href="/nosotros"','href="#equipo"'),('href="/#contacto"','href="#contacto"'),('href="/"','href="#superficie-0"')]:
    body=body.replace(a,b)
assert 'href="/' not in body and '"/media' not in body, re.findall(r'.{30}href="/.{20}', body)[:3]
page=f'''<title>Ceto Studio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<script>document.documentElement.lang='es';document.documentElement.dataset.page='home';document.documentElement.dataset.depth='0';</script>
<script>{inline}</script>
<style>{css}</style>
{body}'''
open('index.html','w').write(page)
files={}
for f in ['js/app.js']+sorted('media/'+os.path.basename(x) for x in glob.glob('media/*')): files[f]=f
json.dump(files,open('files.json','w'))
print(len(page)//1024,'KB html;', len(files),'archivos;', sum(os.path.getsize(f) for f in files)//1024,'KB')
