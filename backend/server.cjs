const http = require('http');

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'pong' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
