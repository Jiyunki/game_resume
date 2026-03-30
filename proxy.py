#!/usr/bin/env python3
"""
Local proxy server for setup.html.
Serves static files and proxies /api/* -> https://api.anthropic.com/*
Usage: python3 proxy.py
Then open http://localhost:8080/setup.html
"""
import http.server, urllib.request, urllib.error, json, os, sys

PORT = 8080
ANTHROPIC_BASE = 'https://api.anthropic.com'

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if not self.path.startswith('/api/'):
            self.send_error(404)
            return

        target = ANTHROPIC_BASE + self.path[4:]  # strip /api prefix
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)

        # Forward headers from browser (except Host)
        fwd_headers = {}
        for key in ('x-api-key', 'anthropic-version', 'content-type'):
            val = self.headers.get(key)
            if val:
                fwd_headers[key] = val

        req = urllib.request.Request(target, data=body, headers=fwd_headers, method='POST')
        try:
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self._cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self._cors()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(data)

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'x-api-key, anthropic-version, content-type')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')

    def log_message(self, fmt, *args):
        pass  # silence request logs

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f'Setup wizard running at http://localhost:{PORT}/setup.html')
http.server.HTTPServer(('', PORT), Handler).serve_forever()
