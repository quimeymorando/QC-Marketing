# Genera el manifiesto de assets (ruta -> hash, tamaño) de dist/ para subirlo a Cloudflare Workers.
import os, hashlib, json, sys
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
man = {}
for root, _, files in os.walk(D):
    for f in files:
        p = os.path.join(root, f); rel = '/' + os.path.relpath(p, D).replace(os.sep, '/')
        b = open(p, 'rb').read(); ext = os.path.splitext(f)[1].lstrip('.')
        man[rel] = {'hash': hashlib.sha256(b + ext.encode()).hexdigest()[:32], 'size': len(b)}
json.dump(man, open(sys.argv[1], 'w'))
print(len(man), 'archivos', sum(v['size'] for v in man.values()) // 1024, 'KB')
