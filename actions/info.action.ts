import * as chalk from 'chalk';
import { readFile } from 'fs';
import { platform, release } from 'os';
import osName = require('os-name');
import { join } from 'path';

import { AbstractPackageManager, PackageManagerFactory } from '../lib/package-managers';
import { BANNER, MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';

interface PackageJsonDependencies {
  [key: string]: string;
}

interface WatsonDependency {
  name: string;
  value: string;
}

export class InfoAction extends AbstractAction {
  public async handle() {
    displayBanner();
    await displaySystemInformation();
    await displayWatsonInformation();
  }
}

const displayBanner = () => {
  console.info(chalk.red(BANNER));
};

const displaySystemInformation = async () => {
  console.info(chalk.green("[System Information]"));
  console.info("OS Version     :", chalk.blue(osName(platform(), release())));
  console.info("NodeJS Version :", chalk.blue(process.version));
  await displayPackageManagerVersion();
};

const displayPackageManagerVersion = async () => {
  const manager: AbstractPackageManager = await PackageManagerFactory.find();
  try {
    const version: string = await manager.version();
    console.info(`${manager.name} Version    :`, chalk.blue(version), "\n");
  } catch {
    console.error(`${manager.name} Version    :`, chalk.red("Unknown"), "\n");
  }
};

const displayWatsonInformation = async () => {
  displayCliVersion();
  console.info(chalk.green("[Watson Platform Information]"));
  try {
    const dependencies: PackageJsonDependencies = await readProjectPackageJsonDependencies();
    displayWatsonVersions(dependencies);
  } catch {
    console.error(
      chalk.red(MESSAGES.WATSON_INFORMATION_PACKAGE_MANAGER_FAILED)
    );
  }
};

const displayCliVersion = () => {
  console.info(chalk.green("[Watson CLI]"));
  console.info(
    "Watson CLI Version :",
    chalk.blue(require("../package.json").version),
    "\n"
  );
};

const readProjectPackageJsonDependencies = async (): Promise<PackageJsonDependencies> => {
  return new Promise<PackageJsonDependencies>((resolve, reject) => {
    readFile(
      join(process.cwd(), "package.json"),
      (error: NodeJS.ErrnoException | null, buffer: Buffer) => {
        if (error !== undefined && error !== null) {
          reject(error);
        } else {
          resolve(JSON.parse(buffer.toString()).dependencies);
        }
      }
    );
  });
};

const displayWatsonVersions = (dependencies: PackageJsonDependencies) => {
  buildWatsonVersionsMessage(dependencies).forEach((dependency) =>
    console.info(dependency.name, chalk.blue(dependency.value))
  );
};

const buildWatsonVersionsMessage = (
  dependencies: PackageJsonDependencies
): WatsonDependency[] => {
  const watsonDependencies = collectWatsonDependencies(dependencies);
  return format(watsonDependencies);
};

const collectWatsonDependencies = (
  dependencies: PackageJsonDependencies
): WatsonDependency[] => {
  const watsonDependencies: WatsonDependency[] = [];
  Object.keys(dependencies).forEach((key) => {
    if (key.indexOf("@watsonjs") > -1) {
      watsonDependencies.push({
        name: `${key.replace(/@watsonjs\//, "")} version`,
        value: dependencies[key],
      });
    }
  });
  return watsonDependencies;
};

const format = (dependencies: WatsonDependency[]): WatsonDependency[] => {
  const sorted = dependencies.sort(
    (dependencyA, dependencyB) =>
      dependencyB.name.length - dependencyA.name.length
  );
  const length = sorted[0].name.length;
  sorted.forEach((dependency) => {
    if (dependency.name.length < length) {
      dependency.name = rightPad(dependency.name, length);
    }
    dependency.name = dependency.name.concat(" :");
    dependency.value = dependency.value.replace(/(\^|\~)/, "");
  });
  return sorted;
};

const rightPad = (name: string, length: number): string => {
  while (name.length < length) {
    name = name.concat(" ");
  }
  return name;
};
