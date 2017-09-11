'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (content) {
  this.cacheable && this.cacheable(true);
  this.addDependency(this.resourcePath);

  var query = _loaderUtils2.default.getOptions(this) || {};

  var cb = this.async();

  Promise.resolve(String(content)).then(optimize(query.svgo)).then(transform({
    jsx: query.jsx
  })).then(function (result) {
    cb(null, result.code);
  }).catch(function (err) {
    cb(err);
  });
};

var _svgo = require('svgo');

var _svgo2 = _interopRequireDefault(_svgo);

var _babelCore = require('babel-core');

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _svgo3 = require('./svgo');

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optimize(opts) {
  (0, _svgo3.validateAndFix)(opts);
  var svgo = new _svgo2.default(opts);
  return function (content) {
    return new Promise(function (resolve, reject) {
      return svgo.optimize(content).then(function (_ref) {
        var error = _ref.error,
            data = _ref.data;
        return error ? reject(error) : resolve(data);
      });
    });
  };
}

function transform(opts) {
  return function (content) {
    var babelOpts = void 0;
    if (opts.jsx) {
      babelOpts = {
        babelrc: false,
        plugins: ['syntax-jsx', _plugin2.default]
      };
    } else {
      babelOpts = {
        babelrc: false,
        presets: ['react'],
        plugins: [_plugin2.default]
      };
    }
    return (0, _babelCore.transform)(content, babelOpts);
  };
}

module.exports = exports['default'];