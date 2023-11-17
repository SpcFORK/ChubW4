#!/usr/bin/env node

// Include the necessary modules
const { Command } = require('commander');
const process = require('process');
const packageJson = require('./package.json');
const fs = require('fs');
const path = require('path');

// Instantiate the program
const program = new Command();

// Version of the CLI tool
program.version(packageJson.version);

// ---

function fsFromHost(url) {
  try {
    let fetched = fetch(url);
    return fetched.then(response => response.text());
  
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  return null;
}

function makeDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

async function updateChubMLSRC() {
  let chubML_HOST = 'https://chubml.replit.app/cml.js';
  let chubML_SRC = await fsFromHost(chubML_HOST);

  makeDir('./chubML');
  fs.writeFileSync('./chubML/cml.js', chubML_SRC);
}

// ---

// Functions
// function printHelp() {
//   console.log(
//     'Usage: chubcli [options] <command> [options] [arguments]',
//     '\n',
//     'Options:',
//     '  --help, -h  Show help',
//     '  --version, -v  Show version',
//     'Commands:',
//     '  update  Update a chub',
//     '  help  Show help for a command',
//     '  version  Show version for a command',
//     '\n',
//     '  build  Build a chubsite',
//     '    --susha  Use Susha Router to build the chubsite',
//     '    --sushaExpress  Susha Router with Express for dynamic SPA HTML in order to build the chubsite',
//     '    --strictExpress  Do not use Susha Router to build the chubsite',
//   )
// }

function printVersion() {
  console.log(packageJson.version);
}

function getFiles(dir) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(path.join(dir, file)).isFile();
  });
}

function getFilesWithPrefix(dir, prefix) {
  // Filter out nopref
  return getFiles(dir).filter(file => {
    return file.startsWith(prefix);
  });
}

function getFilesWithSuffix(dir, suffix) {
  // Filter out nopref
  return getFiles(dir).filter(file => {
    return file.endsWith(suffix);
  });
}

// ---

// Define command for building the software
program
  .command('build')
  .description('Builds the software')
  .option('-e, --environment <type>', 'Specify the environment for the build', 'production')
  .option('-c, --config <path>', 'Specify the path to the configuration file')
  .action((options) => {
    console.log(`Building for ${options.environment} environment...`);

    

  });

// program
//   .command('init')
//   .description('Initializes the software')
//   .option(
//     '-e, --environment <type>', 
//     'Specify the environment for the initialization', 
//     'production'
//   )
//   .option(
//     '-c, --config <path>',
//     'Specify the path to the configuration file',
//     'config.json'
//   )
//   .action((options) => {
//     console.log(`Initializing for ${options.environment} environment...`);

    
//   })

// Parse command line arguments
program.parse(process.argv);