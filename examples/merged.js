const RspackAssetsManifest = require('rspack-assets-manifest');

const manifest = new RspackAssetsManifest({
  output: 'merged-manifest.json',
  merge: true,
  customize(entry, original, manifest, asset) {
    if (manifest.isMerging) {
      // Do something
    }
  },
});
