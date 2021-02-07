import { Configuration, ConfigurationLoader, WatsonConfigurationLoader } from '../configuration';
import { FileSystemReader } from '../readers';

export async function loadConfiguration(): Promise<Required<Configuration>> {
  const loader: ConfigurationLoader = new WatsonConfigurationLoader(
    new FileSystemReader(process.cwd())
  );
  return loader.load();
}
