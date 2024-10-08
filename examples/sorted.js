const RspackAssetsManifest = require('rspack-assets-manifest');

const manifest = new RspackAssetsManifest({
  output: 'sorted-manifest.json',
  sortManifest(a, b) {
    // `this` is the manifest instance.
    const extA = this.getExtension(a);
    const extB = this.getExtension(b);

    if (extA > extB) {
      return 1;
    }

    if (extA < extB) {
      return -1;
    }

    return a.localeCompare(b);
  },
});
