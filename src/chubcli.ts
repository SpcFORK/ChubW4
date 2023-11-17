#!/usr/bin/env node

// Include the necessary modules
import { Command } from 'commander';
import { exec } from 'child_process';
import process from 'process';
import packageJson from '../package.json';
import fs from 'fs';
import path from 'path';
import scl from './tools/scl';

// Instantiate the program
const program = new Command();

// Version of the CLI tool
program.version(packageJson.version);

async function fsFromHost(url: string) {
  try {
    let fetched = fetch(url);
    return fetched.then((response) => response.text());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function makeDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function ghFromRepoAndAppendToDir(repoUrl: string, localDir: string) {
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
  });

  // CD back to the original directory
  exec(`cd ../`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });

  return dir;
}

async function updateChubMLSRC() {
  let dir = './chub-cli';
  let cp = ghFromRepoAndAppendToDir('SpcFORK/ChubML', dir);

  let dirInfo = fs.readdirSync(dir);

  scl(`ChubML Directory Contents: ${dirInfo.join(', ')}`);

  scl(`ChubML Repo cloned successfully: ${cp}`);
}

async function updateSusha() {
  let dir = './susha';
  let cp = ghFromRepoAndAppendToDir('SpcFORK/Susha', dir);

  let dirInfo = fs.readdirSync(dir);

  scl(`Susha Directory Contents: ${dirInfo.join(', ')}`);

  scl(`Susha Repo cloned successfully: ${cp}`);
}

// @ Main Updater
async function updateChubCLI() {}

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

function getFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isFile();
  });
}

function getFilesWithPrefix(dir: string, prefix: string) {
  // Filter out nopref
  return getFiles(dir).filter((file) => {
    return file.startsWith(prefix);
  });
}

function getFilesWithSuffix(dir: string, suffix: string) {
  // Filter out nopref
  return getFiles(dir).filter((file) => {
    return file.endsWith(suffix);
  });
}

// ---

// Define command for building the software
program
  .command('build')
  .description('Builds the software')
  .option(
    '-e, --environment <type>',
    'Specify the environment for the build',
    'production'
  )
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
