import http, { type ServerResponse } from 'http';
import path from 'path';
import fs from 'fs';
import packageJson from '../package.json';
import scl from './tools/scl';

// TODO: JSDOCS

// ---
/**
 * Reads a file from the filesystem and sends it to the client.
 * @param filePath - The path of the file to be read.
 * @param contentType - The MIME content type of the file.
 * @param res - The HTTP server response object.
 */
const readFile = (
  filePath: string,
  contentType: string,
  res: ServerResponse
) => {
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

/**
 * Handles a filesystem read error.
 * @param res - The HTTP server response object.
 */
const handleHtmlReadError = (res: ServerResponse) => {
  const notFoundPath = './404.html';
  if (fs.existsSync(notFoundPath)) {
    readFile(notFoundPath, 'text/html', res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

// ---

const server = http.createServer((req, res) => {
  const endpoint = req.url!.slice(1);
  const filePath = path.resolve(process.cwd(), 'build', endpoint, 'page.html');

  if (fs.existsSync(filePath)) {
    readFile(filePath, 'text/html', res);
  } else {
    handleHtmlReadError(res);
  }
});

// Get PORT from package.json
const port = packageJson.port;

server.listen(port, () => {
  console.log(`Chub Router listening at port: ${port}`);
});
