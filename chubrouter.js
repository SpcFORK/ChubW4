const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const endpoint = req.url.slice(1); // Extract endpoint from the request URL, remove leading '/'
  const filePath = path.resolve(process.cwd(), 'build', endpoint, 'page.html'); // Construct the file path based on the endpoint
  const notFoundPath = './404.html'; // File path for 404 page

  if (fs.existsSync(filePath)) {
    // Check if the file for the endpoint exists
    fs.readFile(filePath, (err, data) => {
      // Read the file content
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' }); // Internal Server Error if there's an issue reading the file
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data); // Serve the file content
      }
    });
  } else {
    // If the file for the endpoint doesn't exist

    if (fs.existsSync(notFoundPath)) {
      // Check if the 404 page exists
      fs.readFile(notFoundPath, (err, data) => {
        // Read the 404 page content
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data); // Serve the 404 page content
        }
      });
    } else {
      // If neither the endpoint file nor the 404 page exists
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found'); // Serve a plain 'Not Found' response
    }
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Chub Router listening at port: ${PORT}`);
});
