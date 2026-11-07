import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const tool = ['safari-web-extension-packager', 'safari-web-extension-converter']
  .find(name => spawnSync('xcrun', ['--find', name], { stdio: 'ignore' }).status === 0);
if (!tool) {
  console.error('To‘liq Xcode kerak. Xcode o‘rnating va ishga tushiring, so‘ng:\nsudo xcode-select -s /Applications/Xcode.app/Contents/Developer\nnpm run safari');
  process.exit(1);
}
const result = spawnSync('xcrun', [tool, resolve('dist'), '--project-location', resolve('safari'),
  '--app-name', 'YouTube Shorts Blocker', '--bundle-identifier', 'uz.local.youtube-shorts-blocker',
  '--macos-only', '--no-open'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
