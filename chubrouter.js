const http = require('http');
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

// TODO: JSDOCS

// ---

const readFile = (filePath, contentType, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (contentType === 'text/html') {
        // Pass error handling for HTML content type to a function
        handleHtmlReadError(res);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

const handleHtmlReadError = (res) => {
  const notFoundPath = './404.html';
  if (fs.existsSync(notFoundPath)) {
    readFile(notFoundPath, 'text/html', res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

// ---

const handleRequest = (req, res) => {
  const endpoint = req.url.slice(1);
  const filePath = path.resolve(process.cwd(), 'build', endpoint, 'page.html');

  if (fs.existsSync(filePath)) {
    readFile(filePath, 'text/html', res);
  } else {
    handleHtmlReadError(res);
  }
};

const server = http.createServer(handleRequest);

// Get PORT from package.json
const port = packageJson.port;

server.listen(port, () => {
  console.log(`Chub Router listening at port: ${port}`);
});