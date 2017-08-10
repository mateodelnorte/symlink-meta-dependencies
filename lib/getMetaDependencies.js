const async = require('async');
const getJson = require('./getJson');
const merge = require('lodash.merge');
const pickby = require('lodash.pickby');

var getJsonsFromDirectories = function (dirs, cb) {
  async.map(dirs, getJson, cb);
};

module.exports = function (dirs, cb) {
  var deps = {}         // { module name -> [jsonDeps++jsonDevDeps] }
    , absPaths = {};    // { module name -> abs module path }

  getJsonsFromDirectories(dirs, function (err, datas) {
    if (err) {
      return cb(err);
    }

    const names = datas.map(data => data.data.name);

    var dependencies = datas.map((data) => {
      
      let dependencies = pickby(data.data.dependencies, (value, key) => {
        return names.indexOf(key) > -1;
      });
      
      let devDependencies = pickby(data.data.devDependencies, (value, key) => {
        return names.indexOf(key) > -1;
      });

      const deps = merge(dependencies, devDependencies);

      return {
        name: data.data.name,
        path: data.path,
        deps: deps,
        size: Object.keys(deps).length
      }

    });

    dependencies.sort((a, b) => {
      return a.size - b.size;
    })

    var graph = dependencies.reduce((a, b) => {
      a[b.name] = b;
      return a;
    }, {})

    return cb(null, graph);
  });
};
