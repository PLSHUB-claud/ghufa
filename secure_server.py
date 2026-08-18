import http.server
import os
import socketserver
import threading
from pathlib import Path
from urllib.parse import unquote, urlsplit

PORT = 8080
DIRECTORY = Path(__file__).resolve().parent
MAX_CONNECTIONS = 32
SOCKET_TIMEOUT = 15

ALLOWED_EXTENSIONS = {
    ".html", ".htm", ".css", ".js", ".json",
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico",
    ".mp3", ".wav", ".ogg", ".flac", ".mp4", ".webm", ".m4a",
    ".woff", ".woff2", ".ttf",
}

CSP = (
    "default-src 'self'; "
    "base-uri 'none'; "
    "object-src 'none'; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data: blob:; "
    "media-src 'self' blob:; "
    "connect-src https://api.ipify.org; "
    "font-src 'self'; "
    "frame-src 'none'; "
    "frame-ancestors 'none'; "
    "form-action 'none'"
)


def _safe_url_path(url_path: str):
    raw_path = unquote(urlsplit(url_path).path)
    if "\x00" in raw_path or "\\" in raw_path:
        return None

    parts = [part for part in raw_path.split("/") if part not in ("", ".")]
    if any(part == ".." or part.startswith(".") for part in parts):
        return None

    candidate = (DIRECTORY.joinpath(*parts)).resolve()
    try:
        candidate.relative_to(DIRECTORY)
    except ValueError:
        return None
    return candidate


class SecureHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    server_version = "GhufaStatic"
    sys_version = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def do_POST(self):
        self.send_error(405, "Method Not Allowed")

    def do_PUT(self):
        self.send_error(405, "Method Not Allowed")

    def do_DELETE(self):
        self.send_error(405, "Method Not Allowed")

    def do_PATCH(self):
        self.send_error(405, "Method Not Allowed")

    def list_directory(self, path):
        self.send_error(403, "Directory listing is forbidden")
        return None

    def translate_path(self, path):
        resolved = _safe_url_path(path)
        if resolved is None:
            return str(DIRECTORY / "__blocked__")
        return str(resolved)

    def send_head(self):
        path = _safe_url_path(self.path)
        if path is None:
            self.send_error(403, "Access Forbidden")
            return None

        if path.is_dir():
            index = path / "index.html"
            if not index.is_file():
                self.send_error(403, "Access Forbidden")
                return None
            path = index

        if path.suffix.lower() not in ALLOWED_EXTENSIONS:
            self.send_error(403, "File type not accessible")
            return None

        return super().send_head()

    def end_headers(self):
        self.send_header("Content-Security-Policy", CSP)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
        )
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        super().end_headers()


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = MAX_CONNECTIONS

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._slots = threading.BoundedSemaphore(MAX_CONNECTIONS)

    def get_request(self):
        request, client_address = super().get_request()
        request.settimeout(SOCKET_TIMEOUT)
        return request, client_address

    def process_request(self, request, client_address):
        if not self._slots.acquire(blocking=False):
            request.close()
            return
        try:
            super().process_request(request, client_address)
        except Exception:
            self._slots.release()
            raise

    def process_request_thread(self, request, client_address):
        try:
            super().process_request_thread(request, client_address)
        finally:
            self._slots.release()


if __name__ == "__main__":
    print(f"Secure static server running on http://127.0.0.1:{PORT}")
    with ThreadedTCPServer(("127.0.0.1", PORT), SecureHTTPRequestHandler) as httpd:
        httpd.serve_forever()
