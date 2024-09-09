const fs = require('fs');
const join = require('path').join;

module.exports = function (pth, cb) {
  var pkgjson = join(pth, 'package.json');
  fs.exists(pkgjson, function (exists) {
    if (exists) {
      fs.readFile(pkgjson, function (err, data) {
        cb(err, err ? null : { path: pth, data: JSON.parse(data) });
      });
    }
    else {
      console.error(`Unable to find package.json at '${pkgjson}'`)
      cb(null, null); // no error but no package.json
    }
  });
};