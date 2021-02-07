import { Input } from "../commands";
import { WatsonDependencyManager } from "../lib/dependency-managers";
import { PackageManagerFactory } from "../lib/package-managers";
import { AbstractAction } from "./abstract.action";

export class UpdateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    const force = options.find((option) => option.name === "force") as Input;
    const tag = options.find((option) => option.name === "tag") as Input;

    const manager = new WatsonDependencyManager(
      await PackageManagerFactory.find()
    );
    await manager.update(force.value as boolean, tag.value as string);
  }
}
