const RspackAssetsManifest = require('rspack-assets-manifest');

const manifest = new RspackAssetsManifest({
  output: 'aws-s3-data-integrity-manifest.json',
  integrity: true,
  integrityHashes: ['md5'],
  integrityPropertyName: 'md5',
  publicPath: 's3://some-bucket/some-folder/',
  customize(entry, original, manifest, asset) {
    return {
      key: entry.value,
      value: asset && asset.info.md5.substr(4),
    };
  },
});
