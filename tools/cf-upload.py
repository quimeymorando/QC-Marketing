# Sube los assets de dist/ a una sesión de carga de Cloudflare Workers.
# Uso: python3 tools/cf-upload.py <manifest.json> <session.json> <account_id>   (session.json = {"jwt":..., "buckets":[[hash,...],...]})
import sys, os, json, base64, mimetypes, subprocess, tempfile
man = json.load(open(sys.argv[1])); ses = json.load(open(sys.argv[2])); acc = sys.argv[3]
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
by_hash = {v['hash']: k for k, v in man.items()}
mimetypes.add_type('font/woff2', '.woff2'); mimetypes.add_type('image/webp', '.webp'); mimetypes.add_type('application/json', '.json')
done = None
for i, bucket in enumerate(ses['buckets']):
    args = ['curl', '-s', '-m', '120', '-X', 'POST', f'https://api.cloudflare.com/client/v4/accounts/{acc}/workers/assets/upload?base64=true', '-H', f"Authorization: Bearer {ses['jwt']}"]
    tmp = tempfile.mkdtemp()
    for h in bucket:
        path = by_hash[h]; b64 = os.path.join(tmp, h)
        open(b64, 'w').write(base64.b64encode(open(D + path, 'rb').read()).decode())
        mime = mimetypes.guess_type(path)[0] or 'application/octet-stream'
        args += ['-F', f'{h}=<{b64};type={mime}']
    r = json.loads(subprocess.run(args, capture_output=True, text=True).stdout or '{}')
    print('grupo', i + 1, 'ok' if r.get('success') else r)
    if r.get('result', {}) and r['result'].get('jwt'): done = r['result']['jwt']
if done: open(os.path.join(os.path.dirname(sys.argv[2]), 'completion.txt'), 'w').write(done); print('carga completa')
else: print('ATENCIÓN: no llegó el token de cierre')
