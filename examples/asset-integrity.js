const RspackAssetsManifest = require('rspack-assets-manifest');

const manifest = new RspackAssetsManifest({
  output: 'asset-integrity-manifest.json',
  integrity: true,
  publicPath: true,
  customize(entry, original, manifest, asset) {
    return {
      key: entry.value,
      value: asset && asset.info.integrity,
    };
  },
});
