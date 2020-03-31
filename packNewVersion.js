const fs = require('fs');
const pkgJSON = require('./package.json');
const manifest = require('./manifest.json');
const archiver = require('archiver');

const src = './dist';
const newVersion = pumpVersion();
const output = `${pkgJSON.name}.${newVersion}.zip`;

zipDirectory(src, output).then(() => {
  fs.writeFileSync(
    './package.json',
    JSON.stringify(
      {
        ...pkgJSON,
        version: newVersion,
        scripts: {
          ...pkgJSON.scripts,
          'git:commit': pkgJSON.scripts['git:commit'].replace(
            pkgJSON.version,
            newVersion,
          ),
        },
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(
    './manifest.json',
    JSON.stringify({ ...manifest, version: newVersion }, null, 2),
  );

  console.log(`a new version {${newVersion}} is packed`);
});

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

/**
 * pump version
 * @return {string}
 */
function pumpVersion() {
  const [, , pump] = process.argv;
  const [major, minor, patch] = manifest.version.split('.').map((x) => +x);

  switch (true) {
    case pump === 'major':
      return [major + 1, 0, 0].join('.');

    case pump === 'minor':
      return [major, minor + 1, 0].join('.');

    case pump === 'patch':
      return [major, minor, patch + 1].join('.');

    default:
      throw Error('Provide a pump type [major, minor, patch]');
  }
}
