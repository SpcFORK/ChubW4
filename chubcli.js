#!/usr/bin/env node

// TODO: JSDOCS

// Include the necessary modules
const { Command } = require('commander');
const { exec } = require('child_process');
const process = require('process');
const packageJson = require('./package.json');
const fs = require('fs');
const path = require('path');
const scl = require('./scl.js');

// Instantiate the program
const program = new Command();

// Version of the CLI tool
program.version(packageJson.version);

// ---

/**
 * Fetch file content from a remote host.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<string>} The fetched text data.
 */
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

/**
 * Creates a directory if it does not exist.
 * @param {string} dir - The directory path to create.
 */
function makeDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

/**
 * Clone a GitHub repository and append it to a local directory.
 * @param {string} repoUrl - The URL of the GitHub repository.
 * @param {string} localDir - The directory to clone the repository into.
 * @returns {string} The local directory path of the cloned repository.
 */
function ghFromRepoAndAppendToDir(repoUrl, localDir) {
  makeDir(localDir); // Ensure the directory exists
  let dir = path.join(localDir, path.basename(repoUrl));

  // CD to the directory
  exec(`cd ${localDir}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  
  });

  // Clone the repo
  exec(`gh repo clone ${repoUrl}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    
  })

  // CD back to the original directory
  exec(`cd ../`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    
  })

  return dir;
}

/**
 * Update the ChubML source from the repository.
 */
async function updateChubMLSRC() {
  let dir = './chub-cli'
  let cp = ghFromRepoAndAppendToDir('SpcFORK/ChubML', dir);

  let dirInfo = fs.readdirSync(dir);

  scl(
    `ChubML Directory Contents: ${dirInfo.join(', ')}`
  );
  
  scl(
    `ChubML Repo cloned successfully: ${cp}`,
  );
  
}

/**
 * Update the Susha source from the repository.
 */
async function updateSusha() {
  let dir = './susha'
  let cp = ghFromRepoAndAppendToDir('SpcFORK/Susha', dir);

  let dirInfo = fs.readdirSync(dir);

  scl(
    `Susha Directory Contents: ${dirInfo.join(', ')}`
  
  );

  scl(
    `Susha Repo cloned successfully: ${cp}`,
  );
}

// @ Main Updater
/**
 * Main updater function for the Chub CLI.
 */
async function updateChubCLI() {
  
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

/**
 * Print the version of the software from the package JSON.
 */
function printVersion() {
  console.log(packageJson.version);
}

/**
 * Retrieve the list of files in a directory.
 * @param {string} dir - The directory to read from.
 * @returns {string[]} - An array of file names.
 */
function getFiles(dir) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(path.join(dir, file)).isFile();
  });
}

/**
 * Retrieve the list of files in a directory with a specific prefix.
 * @param {string} dir - The directory to read from.
 * @param {string} prefix - The prefix to match file names against.
 * @returns {string[]} - An array of file names with the specified prefix.
 */
function getFilesWithPrefix(dir, prefix) {
  // Filter out nopref
  return getFiles(dir).filter(file => {
    return file.startsWith(prefix);
  });
}

/**
 * Retrieve the list of files in a directory with a specific suffix.
 * @param {string} dir - The directory to read from.
 * @param {string} suffix - The suffix to match file names against.
 * @returns {string[]} - An array of file names with the specified suffix.
 */
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