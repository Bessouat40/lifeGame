const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

http
  .createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const queryParams = parsedUrl.query;
    const pathname = parsedUrl.pathname;

    console.log('Query Parameters:', queryParams);

    let filePath = pathname === '/' ? './index.html' : `.${pathname}`;

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        const extname = path.extname(filePath);
        const contentType =
          extname === '.js'
            ? 'text/javascript'
            : extname === '.css'
            ? 'text/css'
            : 'text/html';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
