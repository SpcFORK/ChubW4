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
import readline from 'readline';
// import Module from 'module';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface PROMPT_OPTIONS {
  enter?: string;
  exit?: string;
}

function PROMPT(txt: string, options?: PROMPT_OPTIONS) {
  return new Promise((resolve, reject) => {
    // If user presses Enter, resolve the promise with the entered value
    // Else, reject the promise with an error message
    rl.question(txt, (answer) => {
      if (options && options.enter) {
        if (answer === options.enter) {
          resolve(answer);
        } else {
          reject(new Error(
            `Invalid input: ${answer}. Expected: ${options.enter}`
          ));
        }
      } else {
        resolve(answer);
      }

    });
  });
}

import icons from './icows/icows'

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

function getAllFiles(dir: string) {
  return fs.readdirSync(dir)
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

interface SCR_ {
  header: string[],
  body: string[],
  asy: string[],
  places: { [key: string]: { [innerKey: string]: string } },
  router: { [key: string]: string }
}

async function stageChubML(loc: string, config: ChubConfig) {
  const startime = Date.now();
  const buildDir = config.buildDir ?? './build';
  dirCheck(buildDir);

  let chubMLModulePath = path.join(__dirname, '..', 'chubml', 'cml.js');
  if (!fs.existsSync(chubMLModulePath)) {
    scl('ChubML not present? Installing...');
    await updateChubMLSRC();
  }

  chubML = await import(chubMLModulePath).catch((error) => {
    console.error('Failed to import ChubML:', error.message);
    process.exit(1);
  });

  let files = getFiles(loc)
  let Chubfiles = files.filter(file => file.endsWith('.chub'));

  if (Chubfiles.length === 0) {
    console.error('No chub files found in', loc);
    process.exit(1);
  }

  for (const file of Chubfiles) {
    const chubMLContent = fs.readFileSync(path.join(loc, file), 'utf8');
    const html = chubML.CHUBparse(chubMLContent);

    const envTag = config.env === 'development'
      ? `<!-- DEVELOPMENT MODE -->\n`
      : '';

    const htmlWithTag = `${envTag}${html}\n\n<!-- BUILT with ChubW4 ${packageJson.version} -->`;

    const htmlPath = path.join(buildDir, file.replace('.chub', '.html'));

    fs.writeFileSync(htmlPath, htmlWithTag.trim());

    console.log(`File staged: ${htmlPath}`);
  }

  let _RECACHE_FILES_ = Chubfiles.map(file => path.join(buildDir, file.replace('.chub', '.html')));

  if (config.susha) {
    scl('Building chubsite with Susha & Express...');
    await buildChubsite(_RECACHE_FILES_, buildDir, 'sushaExpress', config);

  }

  else if (config.strictExpress) {
    scl('Building chubsite with strictly Express...');
    await buildChubsite(_RECACHE_FILES_, buildDir, 'strictExpress', config);
  }

  else if (config.sushaExpress) {
    scl('Building chubsite with Susha & HTTP...');
    await buildChubsite(_RECACHE_FILES_, buildDir, 'susha', config);
  }

  scl(
    `Chubsite built in ${(Date.now() - startime) / 1000} seconds.`
  )
}

function sushaRouterStructure(files: string[], buildDir: string, config: ChubConfig) {
  // Dynamically build and save a Router.index.js;
  // Idea:
  //  - Loop through files
  //    - If DIR, add DIR to router
  //    - If FILE, add FILE to router
  //      - If in dir, put in router.
  //      - Put HTML in body as {};

  let SCR: SCR_ = {
    header: [
      '// Susha Express Router Structure',
      '// Generated with ChubW4',
      '// https://github.com/Spcfork/Chubw4',
      '\n\n'
    ],
    body: [],
    places: {},
    router: {},
    asy: []
  }

  for (const file of files) {
    const
      dir = path.dirname(file),
      fileName = path.basename(file),
      ext = path.extname(file)


    if (ext === '.html') {
      const html = fs.readFileSync(file, 'utf8');
      const htmlPath = path.join(buildDir, fileName.replace('.html', '.cache'));

      if (config.config?.cache) {
        fs.writeFileSync(htmlPath, html);
      }

      console.log(`File staged: ${htmlPath}`);

      SCR.places[fileName] = {
        dir,
        ext,
        fileName,
        htmlPath,
        html
      }
    }

  }

  if (Object.keys(SCR.places).length === 0) {
    console.error('No chub files found in', buildDir);
    process.exit(1);
  }

  console.log(icons.logo2_Chubw4Text, '\n\n')
  scl('-=-  Compile BEGIN!!!  -=-');

  for (const place in SCR.places) {
    const placeObj = SCR.places?.[place];
    console.log(
      `Compiling ${placeObj.fileName}...`,
      `  - Dir: ${placeObj.dir}`,
      `  - Ext: ${placeObj.ext}`,
    );

    let trail_ = '/** ChubFN */\n';
    let m_ = placeObj?.fileName.replace('.html', '');
    let __STARTER__: string | number | undefined;
    let __SUSHA_ROUTER__ = '__SUSHA_ROUTER__'

    try {
      if (placeObj.html) {
        if (config.config.Into_Inline) {
          SCR.body.push(trail_ + `
            const ${m_} tag('place',
              (\`${placeObj.html}\`)
            )
          `)
        }

        else if (config.config.Into_FETCH_calls) {
          SCR.asy.push(
            trail_ + `const ${m_} = await (await fetch('${placeObj?.fileName}')).text();`
          );
        }

        { // Starter Block
          __STARTER__
            ? 0
            : __STARTER__ = SCR.body.push(
              `window.${__SUSHA_ROUTER__} = {}`
            )
        }

        SCR.body.push(
          `window.${__SUSHA_ROUTER__}.${m_} = ${placeObj.html};`
        )

        // @ Router
        if (placeObj.fileName.startsWith('##')) {
          SCR.router[
            m_
              .replace(/(&##){1}/, '/')
          ] = placeObj.html
        }
      }


    } catch (e) {
      console.error(e);
      process.exit(1);
    }

  }

  scl('Building chubsite with Susha & Express...');

  let Thescript = '';

  SCR.body.forEach((line) => {
    // NOW BUILD SCRIPT
    Thescript += line + '\n';

    // if (line.startsWith('const') && line.includes('ChubFN')) {
    //   // console.log(line);
    // }

  })

  // Create Entrypoint
  // /data/templates/chubML/loaders.js
  let aes = fs.readFileSync(
    path.join(
      __dirname,
      'data',
      'templates',
      'chubML',
      'loaders.js'
    ),
  ).toString(); 
  
  aes = aes.replace('// {{INJECTHERE2}}', Thescript);

  // Save to file;
  if (Thescript) {
    fs.writeFileSync(
      path.join(buildDir, 'index.js'),
      (
        Thescript ? `(new Promise((res, rej) => {\n${Thescript}\n})`
          : ''
      )

    );

    console.log('Compiled Susha chubsite.');
  }
  
  const entrypoint = path.join(buildDir, 'page.html');
  fs.writeFileSync(
    entrypoint,

  )

  console.log('Susha chubsite is ready to be served.');


}

async function buildChubsite(files: string[], buildDir: string, type: string, config: ChubConfig) {
  function buildChubsiteSusha(files: string[], buildDir: string, config: ChubConfig) {
    return new Promise((resolve, reject) => {
      const chubsite = sushaRouterStructure(files, buildDir, config);
    })
  }

  switch (type) {
    case 'sushaExpress':
      // await buildChubsiteSushaExpress(files, buildDir, config);
      break;
    case 'strictExpress':
      // await buildChubsiteStrict(files, buildDir, config);
      break;
    case 'susha':
      await buildChubsiteSusha(files, buildDir, config);
      break;
    default:
      console.error('No chubML config found.');
      process.exit(1);

  }

  scl('Chubsite built.');
}
// ---

interface ChubConfig {
  port: number;
  dir: string;
  config: advConfig;
  buildDir: string;
  env: string;
  // Susha Options
  susha: boolean;
  sushaExpress: boolean;
  strictExpress: boolean;
  configDir: string;
}


/*  ADVANCED CONFIG  */

/** ADVANCED CONFIG JSON structure.
  * 
  * - Susha Options
  * - HTML bundling
  */
interface advConfig {
  Into_Inline?: boolean;
  Into_FETCH_calls?: boolean;
  bundle?: 'html' | 'js' | 'experementalChubScript'
  cache?: boolean;
  susha?: {
    // Susha Options
    ElementWrap_HTML?: boolean;

  }
}

interface ConfigOptions {
  port?: number;
  dir?: string;
  config?: Record<string, unknown>;
  buildDir?: string;
  env?: string;
  susha?: boolean;
  sushaExpress?: boolean;
  strictExpress?: boolean;
}

function makeConfig(options?: Partial<ChubConfig>): ChubConfig {
  if (!options) options = {}
  return {
    port: options.port ?? 3000,
    dir: options.dir ?? './',
    buildDir: options.buildDir ?? './build',
    env: options.env ?? 'development',
    susha: options.susha ?? false,
    sushaExpress: options.sushaExpress ?? false,
    strictExpress: options.strictExpress ?? false,
    configDir: options.configDir ?? 'chub.config.json',
    config: options.config ?? {},
  };
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

  .option('-p, --port <number>', 'set the port', '3000')
  .option('-d, --dir <path>', 'set the directory', './')
  .option('-b, --buildDir <path>', 'set the build directory', './build')
  .option('-e, --env <environment>', 'set the environment', 'development')
  .option('--susha', 'enable susha', true)
  .option('--sushaExpress', 'enable sushaExpress', false)
  .option('--strictExpress', 'enable strictExpress', false)
  .option('-c, --config <path>', 'set the config path', 'chub.config.json')
  .option('-d, --debug', 'Enable debug mode')
  .action((loc, options, command) => {

    // console.log(loc, options, command);

    if (!fs.existsSync(loc)) {
      console.error('Directory does not exist');
      process.exit(1);
    }

    let chubConfig: ChubConfig;
    if (options.config) {
      var configPath = path.join(loc, options?.config || 'chub.config.json');
      if (!fs.existsSync(configPath)) {
        console.error('Configuration file does not exist');
        // Make one
        fs.writeFileSync(configPath, JSON.stringify(makeConfig(), null, 2));
      }
      const config = JSON.parse(fs.readFileSync(configPath).toString());
      chubConfig = makeConfig(config);
      console.log('Configuration loaded from:', configPath);

    } else {
      chubConfig = makeConfig({
        port: options?.port,
        dir: loc,
        buildDir: options?.buildDir,
        env: options?.environment,
        susha: options?.susha,
        sushaExpress: options?.sushaExpress,
        strictExpress: options?.strictExpress,
        config: options?.config,
      });
    }

    stageChubML(loc, chubConfig);

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
    console.log(icons.icon1_CowLogo);
    console.log('\n', '\n', 'Updating...', '\n');

    updateChubCLI();
  });

// Parse command line arguments
program.parse(process.argv);
