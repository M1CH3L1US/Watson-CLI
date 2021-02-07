import { AbstractRunner } from '../runners';
import { AbstractCollection } from './abstract.collection';
import { SchematicOption } from './schematic.option';

export interface Schematic {
  name: string;
  alias: string;
  description: string;
}

export class WatsonCollection extends AbstractCollection {
  private static schematics: Schematic[] = [
    {
      name: "application",
      alias: "application",
      description: "Generate a new application workspace",
    },
    {
      name: "receiver",
      alias: "r",
      description: "Generate a receiver declaration",
    },
    {
      name: "exception-handler",
      alias: "eh",
      description: "Generate a exception handler declaration",
    },
    {
      name: "exception",
      alias: "e",
      description: "Generate a exception declaration",
    },
    {
      name: "filter",
      alias: "f",
      description: "Generate a filter declaration",
    },
    {
      name: "guard",
      alias: "gu",
      description: "Generate a guard declaration",
    },
    {
      name: "module",
      alias: "mo",
      description: "Generate a module declaration",
    },
    {
      name: "pipe",
      alias: "pi",
      description: "Generate a pipe declaration",
    },
    {
      name: "service",
      alias: "s",
      description: "Generate a service declaration",
    },
  ];

  constructor(runner: AbstractRunner) {
    super("@watsonjs/schematics", runner);
  }

  public async execute(name: string, options: SchematicOption[]) {
    const schematic: string = this.validate(name);
    await super.execute(schematic, options);
  }

  public static getSchematics(): Schematic[] {
    return WatsonCollection.schematics.filter(
      (item) => item.name !== "angular-app"
    );
  }

  private validate(name: string) {
    const schematic = WatsonCollection.schematics.find(
      (s) => s.name === name || s.alias === name
    );

    if (schematic === undefined || schematic === null) {
      throw new Error(
        `Invalid schematic "${name}". Please, ensure that "${name}" exists in this collection.`
      );
    }
    return schematic.name;
  }
}
