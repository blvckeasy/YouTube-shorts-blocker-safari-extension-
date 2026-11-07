import sharp from 'sharp';
export async function generateIcons(): Promise<void> {
  for (const size of [16, 32, 48, 64, 128, 256, 512, 1024]) {
    await sharp('public/icons/icon.svg').resize(size, size).png().toFile(`public/icons/icon-${size}.png`);
  }
  for (const size of [16, 19, 32, 38, 48, 64]) {
    await sharp('public/icons/toolbar.svg').resize(size, size).png().toFile(`public/icons/toolbar-${size}.png`);
  }
}
