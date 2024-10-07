const RspackAssetsManifest = require('rspack-assets-manifest');

const manifest = new RspackAssetsManifest({
  output: 'asset-size-manifest.json',
  customize(entry, _original, _manifest, asset) {
    return {
      value: {
        value: entry.value,
        // `size()` returns number of bytes
        size: asset.source.size(),
      },
    };
  },
});
