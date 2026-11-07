import json,sys,urllib.parse
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
users={};docs={}
class H(BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def cors(self):
        self.send_header('Access-Control-Allow-Origin','*');self.send_header('Access-Control-Allow-Headers','*');self.send_header('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS')
    def out(self,c,o):
        b=json.dumps(o).encode();self.send_response(c);self.cors();self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(b)));self.end_headers();self.wfile.write(b)
    def body(self):
        n=int(self.headers.get('Content-Length') or 0);return self.rfile.read(n).decode()
    def do_OPTIONS(self): self.send_response(204);self.cors();self.end_headers()
    def sess(self,uid): return {"idToken":"t-"+uid,"localId":uid,"refreshToken":"r-"+uid,"expiresIn":"3600"}
    def do_POST(self):
        u=urllib.parse.urlparse(self.path);raw=self.body()
        if u.path.endswith('accounts:signUp'):
            j=json.loads(raw)
            if j['email'] in users: return self.out(400,{"error":{"message":"EMAIL_EXISTS"}})
            users[j['email']]={'pw':j['password'],'uid':'u'+str(len(users)+1)};return self.out(200,self.sess(users[j['email']]['uid']))
        if u.path.endswith('accounts:signInWithPassword'):
            j=json.loads(raw);x=users.get(j['email'])
            if not x or x['pw']!=j['password']: return self.out(400,{"error":{"message":"INVALID_LOGIN_CREDENTIALS"}})
            return self.out(200,self.sess(x['uid']))
        if u.path.endswith('/token'):
            q=urllib.parse.parse_qs(raw);r=q['refresh_token'][0]
            return self.out(200,{"id_token":"t-"+r[2:],"refresh_token":r,"expires_in":"3600"})
        self.out(404,{})
    def auth(self,uid): return self.headers.get('Authorization')=='Bearer t-'+uid
    def do_GET(self):
        p=urllib.parse.urlparse(self.path).path
        if '/documents/alunos/' in p:
            uid=p.split('/alunos/')[1]
            if not self.auth(uid): return self.out(403,{"error":{"message":"PERMISSION_DENIED"}})
            return self.out(200,docs[uid]) if uid in docs else self.out(404,{})
        if p=='/__docs': return self.out(200,docs)
        self.out(404,{})
    def do_PATCH(self):
        p=urllib.parse.urlparse(self.path).path;raw=self.body()
        if '/documents/alunos/' in p:
            uid=p.split('/alunos/')[1]
            if not self.auth(uid): return self.out(403,{"error":{"message":"PERMISSION_DENIED"}})
            docs[uid]=json.loads(raw);return self.out(200,docs[uid])
        self.out(404,{})
ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1])),H).serve_forever()
