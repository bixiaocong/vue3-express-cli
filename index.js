#!/usr/bin/env node

const { program } = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const path = require('path');

// Define templates
const templates = {
  client: 'bixiaocong/ts-node-express#master',
  server: 'bixiaocong/vue3-vant-template#master',
};

// Command line options
program
  .version('1.0.0')
  // .option('-t, --type <type>', 'specify project type: fe, be or all', /^(fe|be)$/i)
  .option('-p, --path <path>', 'specify target path')
  .parse(process.argv);

// Start interactive prompt
async function run() {
  const questions = [];

  // If type is not provided via options, ask user to choose
  // if (!program.type) {
  //   questions.push({
  //     type: 'list',
  //     name: 'type',
  //     message: 'Select project type:',
  //     choices: ['fe', 'be']
  //   });
  // }

  // If path is not provided via options, ask user to input
  if (!program.path) {
    questions.push({
      type: 'input',
      name: 'path',
      message: 'Enter target path:',
      validate: function (input) {
        if (input.trim() === '') {
          return 'Path cannot be empty';
        }
        return true;
      }
    });
  }

  // Prompt user for missing options
  const answers = await inquirer.prompt(questions);

  // Set options from user input or command line options
  // const type = program.type || answers.type;
  const targetPath = program.path || answers.path;

  // const gitUrl = templates[type];
  // if (!gitUrl) {
  //   console.error('Invalid project type specified.');
  //   process.exit(1);
  // }
  let i = 0
  Object.keys(templates).forEach((pathName) => {
    const absoluteTargetPath = path.resolve(targetPath + '/' + pathName);
    const gitUrl = templates[pathName];
    console.log(`Downloading template for ${pathName} from ${gitUrl} to ${absoluteTargetPath}...`);
    download(gitUrl, absoluteTargetPath, function (err) {
      if (err) {
        console.error('Error downloading template:', err);
        process.exit(1);
      }
      console.log('Template Vue downloaded successfully!');
      i++
      if (i == 2) {
        console.log('All templates downloaded successfully!');
        process.exit(0);
      }
    });
  });
}

run();
