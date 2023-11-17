# ChubW4
![Logo](./builder/favi.logo.png)

# About ChubCLI

ChubCLI is a command line interface (CLI) tool that assists in managing and building Chub projects. It provides a set of commands that automate common tasks, making it easier to update, build, and manage the codebase of ChubML projects.

## Features

- **Update ChubML Source**: Retrieve the latest `cml.js` from the ChubML host and update the local project.
- **Build Software**: Customize the build process with environment and configuration options suitable for production or development needs.
- **File Management**: Utilities to list files with specific prefixes or suffixes within a directory, helping to organize project assets.
- **Directory Operations**: Helpers for creating directories, addressing the need to structure the project workspace neatly.

## Usage

Run `chubcli --help` to get detailed usage information and to list available commands. Some common ones include:

- `chubcli build`: Build the project for a specified environment.
- `chubcli update`: Update the local ChubML source files to the latest available from the ChubML host.

To build the project with specific options, use flags to indicate the desired environment or the path to a configuration file, for example:
