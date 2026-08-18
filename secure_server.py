import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.abspath(os.path.dirname(__file__))

ALLOWED_EXTENSIONS = {
    '.html', '.htm', '.css', '.js', '.json',
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
    '.mp3', '.wav', '.ogg', '.flac', '.mp4', '.webm', '.m4a',
    '.woff', '.woff2', '.ttf'
}

class SecureHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        self.send_error(405, 'Method Not Allowed')

    def do_PUT(self):
        self.send_error(405, 'Method Not Allowed')

    def do_DELETE(self):
        self.send_error(405, 'Method Not Allowed')

    def list_directory(self, path):
        self.send_error(403, 'Directory listing is forbidden')
        return None

    def translate_path(self, path):
        translated = super().translate_path(path)
        if not translated.startswith(DIRECTORY):
            return None
        return translated

    def send_head(self):
        path = self.translate_path(self.path)
        if path is None:
            self.send_error(403, 'Access Forbidden')
            return None

        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.exists(index):
                path = index
            else:
                self.send_error(403, 'Access Forbidden')
                return None

        ext = os.path.splitext(path)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            self.send_error(403, 'File type not accessible')
            return None

        return super().send_head()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    print(f'Secure static server running on port {PORT}')
    with ThreadedTCPServer(('127.0.0.1', PORT), SecureHTTPRequestHandler) as httpd:
        httpd.serve_forever()
