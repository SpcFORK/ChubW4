#!/usr/bin/env node

// Include the necessary modules
import { Command } from 'commander';
import { exec } from 'child_process';
import process from 'process';
import packageJson from '../package.json';
import fs from 'fs';
import path from 'path';
import scl from './tools/scl';
import axios from 'axios';
// import Module from 'module';

var chubML: any;

// Instantiate the program
const program = new Command();

// Version of the CLI tool
program.version(packageJson.version);

// Include the necessary modules

// Improved asynchronous functions for cleaner and more effective code using Axios instead of fetch
async function fetchFromHost(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch from host:', error.message);
    process.exit(1);
  }
}

function saveFileAndLog(dir: string, fileName: string, content: string) {
  // createDirTree(dir);
  const filePath = path.join(dir, fileName);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Failed to save the file:', err);
      return;
    }

    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error('Failed to read the directory:', err);
        return;
      }

      scl(`Directory Contents: ${files.join(', ')}`);
      scl(`File saved successfully: ${filePath}`);
    });
  });
}

async function updateChubMLSRC() {
  const dir = './chubml';
  const fileName = 'cml.js';
  let content = '';

  content = await fetchFromHost('https://chubml.replit.app/cml.js');

  // Does CML exist in PC
  if (fs.existsSync(dir)) {
    // Does CML exist in PC
    if (fs.existsSync(path.join(dir, fileName))) {
      // CML exists in PC
      scl(`CML exists in PC`);

      // Is CML up to date?
      // (Same Content?)
      if (content === fs.readFileSync(path.join(dir, fileName), 'utf-8')) {
        // CML is up to date
        scl(`CML is up to date`);
        return;

      } else {
        // CML is out of date
        scl(`CML is out of date`);
        scl(`Updating CML`);
      }

      scl(`Updating CML...`);
      saveFileAndLog(dir, fileName, content);
      return
    } else {
      // CML doesn't exist in PC
      scl(`CML doesn't exist in PC`);
      scl(`Downloading CML...`);
      saveFileAndLog(dir, fileName, content);
      return
    }
  } else {
    // CML doesn't exist in PC
    saveFileAndLog(dir, fileName, content);
  }

  // saveFileAndLog(dir, fileName, content);
}

async function updateSusha() {
  const dir = './Grecha-Susha';
  const fileName = 'Grecha-Susha.js';
  let content = '';

  content = await fetchFromHost('https://sushajs.replit.app/grecha-susha.js');

  // Does Susha exist in PC?
  if (fs.existsSync(dir)) {
    // Does Susha exist in PC?
    if (fs.existsSync(path.join(dir, fileName))) {
      // Susha exists in PC
      scl(`Susha exists in PC`);
      // Is Susha up to date?
      // (Same Content?)
      if (content === fs.readFileSync(path.join(dir, fileName), 'utf-8')) {
        // Susha is up to date
        scl(`Susha is up to date`);
        return;
      } else {
        // Susha is out of date
        scl(`Susha is out of date`);
      }

      scl(`Updating Susha...`);
      saveFileAndLog(dir, fileName, content);
      return

    } else {
      // Susha doesn't exist in PC
      scl(`Susha doesn't exist in PC`);
      scl(`Downloading Susha...`);
      saveFileAndLog(dir, fileName, content);
      return;
    }

    // saveFileAndLog(dir, fileName, content);
  } else {
    saveFileAndLog(dir, fileName, content);
  }
}

async function updateChubCLI() {
  updateChubMLSRC();
  updateSusha();
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

function getFilesWithPrefixes(dir: string, prefixes: Array<string>) {
  const allFiles = fs.readdirSync(dir);

  return allFiles.filter(file => {
    return prefixes.some(prefix => file.startsWith(prefix));
  });
}

function getFilesWithSuffixes(dir: string, suffixes: Array<string>) {
  const allFiles = fs.readdirSync(dir);

  return allFiles.filter(file => {
    return suffixes.some(suffix => file.endsWith(suffix));
  });
}

function forEachFolder(dir: string, cb: Function) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      forEachFolder(filePath, cb);

    } else {
      cb(filePath);
    }
  })
}

// function createDirTree(dir: string) {
//   const dirs = dir.split('/');
//   const dirTree = {};
//   let strct: string[] = []

//   dirs.forEach((dir, i) => {
//     // Dir exists in files?
//     let dirExists = fs.existsSync(strct.join('/') + dir);

//     if (!dirExists) {
//       // Create dir
//       fs.mkdirSync(dir);
//     }

//     strct.push(dir);
//   })

//   return dirTree;
// }

function dirCheck(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

async function stageChubML(loc: string) {
  let dir = './build';

  dirCheck(dir)

  // Does ChubML module exist?
  // go up to ../../chubml/cml.js
  let mdir = path.join(__dirname, '..', 'chubml', 'cml.js')
  
  console.log(mdir);
  if (fs.existsSync(mdir)) {
    // Dynamic Import ChubML
    chubML = await import(mdir);

  } else {
    // Install ChubML
    await updateChubMLSRC();
  }

  // Get files
  let files = getFiles(loc);

  console.log(files, loc);

  for (const file of files) {
    // Stage the chubML file
    const chubMLPath = path.join(dir, file);

    // Contains suffix
    console.log(file)
    if (!file.endsWith('.chub')) {
      continue
    }
    
    const chubML_ = fs.readFileSync(path.join(loc, file), 'utf8');
    console.log(chubML);

    const html = chubML.CHUBparse(chubML_);
    // Append hash to top as Comment
    const htmlWithTag = `${html}\n\n<!-- BUILT with ChubW4 ${packageJson.version} -->`;

    // Write the html to the build directory
    const htmlPath = path.join(dir, `${file.replace('.chub', '.html')}`);

    // For each DIR; Write to Build Directory
    fs.writeFileSync(htmlPath, htmlWithTag);

  }

}
// ---

interface ChubConfig {
  port: number;
  dir: string;
  config: object;
  buildDir: string;

  // Susha Options
  susha: boolean;
  sushaExpress: boolean;
  strictExpress: boolean;
}

// Usage example:
// const chubConfig = new ChubConfig({
//   port: 3000,
//   host: "127.0.0.1",
//   dir: "./",
//   buildDir: "./dist",
//   susha: true
// });

function makeConfig(config: ChubConfig) {
  // Create a Chub Config
  return {
    port: config.port,
    dir: config.dir,
    config: config.config || {},
    buildDir: config.buildDir || './build',
    susha: config.susha || false,
    sushaExpress: config.sushaExpress || false,
    strictExpress: config.strictExpress || false,
  }
}

console.log('ChubW4 - CLI\n');
// updateChubCLI()

// @ Command
program
  .name('chubCLI')
  .version(packageJson.version)
  .description(packageJson.description)

// Define command for building the software
program
  .command('build')
  .description('Builds the software')
  .argument('<dir>', 'The directory to build')
  .option(
    '-e, --environment <type>',
    'Specify the environment for the build',
    'production'
  )

  .option('-c, --config <path>', 'Specify the path to the configuration file')

  .option('-s, --susha', 'Specify the path to the susha router')

  .option('-suex, --sushaExpress', 'Specify the path to the susha router with express')
  .option('-stex, --strictExpress', 'Specify the path to the susha router with express')

  .option('-d, --debug', 'Enable debug mode')

  .action((loc, options, command) => {

    console.log(loc)

    stageChubML(loc);

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

program
  .command('update')
  .description('Updates the software')
  .action(() => {
    console.log('Updating...');
    updateChubCLI();
  });

// Parse command line arguments
program.parse(process.argv);
