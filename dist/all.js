;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


//
// The shims in this file are not fully implemented shims for the ES5
// features, but do work for the particular usecases there is in
// the other modules.
//

var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Array.isArray is supported in IE9
function isArray(xs) {
  return toString.call(xs) === '[object Array]';
}
exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

// Array.prototype.indexOf is supported in IE9
exports.indexOf = function indexOf(xs, x) {
  if (xs.indexOf) return xs.indexOf(x);
  for (var i = 0; i < xs.length; i++) {
    if (x === xs[i]) return i;
  }
  return -1;
};

// Array.prototype.filter is supported in IE9
exports.filter = function filter(xs, fn) {
  if (xs.filter) return xs.filter(fn);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (fn(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
};

// Array.prototype.forEach is supported in IE9
exports.forEach = function forEach(xs, fn, self) {
  if (xs.forEach) return xs.forEach(fn, self);
  for (var i = 0; i < xs.length; i++) {
    fn.call(self, xs[i], i, xs);
  }
};

// Array.prototype.map is supported in IE9
exports.map = function map(xs, fn) {
  if (xs.map) return xs.map(fn);
  var out = new Array(xs.length);
  for (var i = 0; i < xs.length; i++) {
    out[i] = fn(xs[i], i, xs);
  }
  return out;
};

// Array.prototype.reduce is supported in IE9
exports.reduce = function reduce(array, callback, opt_initialValue) {
  if (array.reduce) return array.reduce(callback, opt_initialValue);
  var value, isValueSet = false;

  if (2 < arguments.length) {
    value = opt_initialValue;
    isValueSet = true;
  }
  for (var i = 0, l = array.length; l > i; ++i) {
    if (array.hasOwnProperty(i)) {
      if (isValueSet) {
        value = callback(value, array[i], i, array);
      }
      else {
        value = array[i];
        isValueSet = true;
      }
    }
  }

  return value;
};

// String.prototype.substr - negative index don't work in IE8
if ('ab'.substr(-1) !== 'b') {
  exports.substr = function (str, start, length) {
    // did we get a negative start, calculate how much it is from the beginning of the string
    if (start < 0) start = str.length + start;

    // call the original function
    return str.substr(start, length);
  };
} else {
  exports.substr = function (str, start, length) {
    return str.substr(start, length);
  };
}

// String.prototype.trim is supported in IE9
exports.trim = function (str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
};

// Function.prototype.bind is supported in IE9
exports.bind = function () {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  if (fn.bind) return fn.bind.apply(fn, args);
  var self = args.shift();
  return function () {
    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
  };
};

// Object.create is supported in IE9
function create(prototype, properties) {
  var object;
  if (prototype === null) {
    object = { '__proto__' : null };
  }
  else {
    if (typeof prototype !== 'object') {
      throw new TypeError(
        'typeof prototype[' + (typeof prototype) + '] != \'object\''
      );
    }
    var Type = function () {};
    Type.prototype = prototype;
    object = new Type();
    object.__proto__ = prototype;
  }
  if (typeof properties !== 'undefined' && Object.defineProperties) {
    Object.defineProperties(object, properties);
  }
  return object;
}
exports.create = typeof Object.create === 'function' ? Object.create : create;

// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
// they do show a description and number property on Error objects
function notObject(object) {
  return ((typeof object != "object" && typeof object != "function") || object === null);
}

function keysShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.keys called on a non-object");
  }

  var result = [];
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// getOwnPropertyNames is almost the same as Object.keys one key feature
//  is that it returns hidden properties, since that can't be implemented,
//  this feature gets reduced so it just shows the length property on arrays
function propertyShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
  }

  var result = keysShim(object);
  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
    result.push('length');
  }
  return result;
}

var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
  Object.getOwnPropertyNames : propertyShim;

if (new Error().hasOwnProperty('description')) {
  var ERROR_PROPERTY_FILTER = function (obj, array) {
    if (toString.call(obj) === '[object Error]') {
      array = exports.filter(array, function (name) {
        return name !== 'description' && name !== 'number' && name !== 'message';
      });
    }
    return array;
  };

  exports.keys = function (object) {
    return ERROR_PROPERTY_FILTER(object, keys(object));
  };
  exports.getOwnPropertyNames = function (object) {
    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
  };
} else {
  exports.keys = keys;
  exports.getOwnPropertyNames = getOwnPropertyNames;
}

// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
function valueObject(value, key) {
  return { value: value[key] };
}

if (typeof Object.getOwnPropertyDescriptor === 'function') {
  try {
    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  } catch (e) {
    // IE8 dom element issue - use a try catch and default to valueObject
    exports.getOwnPropertyDescriptor = function (value, key) {
      try {
        return Object.getOwnPropertyDescriptor(value, key);
      } catch (e) {
        return valueObject(value, key);
      }
    };
  }
} else {
  exports.getOwnPropertyDescriptor = valueObject;
}

},{}],2:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],3:[function(require,module,exports){
var process=require("__browserify_process");// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util');
var shims = require('_shims');

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (!util.isString(path)) {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(shims.filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = shims.substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(shims.filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(shims.filter(paths, function(p, index) {
    if (!util.isString(p)) {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

},{"__browserify_process":5,"_shims":1,"util":4}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var shims = require('_shims');

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  shims.forEach(array, function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = shims.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = shims.getOwnPropertyNames(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }

  shims.forEach(keys, function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = shims.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (shims.indexOf(ctx.seen, desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = shims.reduce(output, function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return shims.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && objectToString(e) === '[object Error]';
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.binarySlice === 'function'
  ;
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = shims.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = shims.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"_shims":1}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
'use strict';


module.exports = {
	css: require('./lib/css'),
	events: require('./lib/events')
};
},{"./lib/css":7,"./lib/events":8}],7:[function(require,module,exports){
/* jshint quotmark:double */

"use strict";



module.exports.add = function add(el, str) {
    var re;

    if (!el) { return false; }

    if (el && el.classList && el.classList.add) {
        el.classList.add(str);
    } else {
        re = new RegExp("\\b" + str + "\\b");

        if (!re.test(el.className)) {
            el.className += " " + str;
        }
    }
};


module.exports.remove = function remove(el, str) {
    var re;

    if (!el) { return false; }

    if (el.classList && el.classList.remove) {
        el.classList.remove(str);
    } else {
        re = new RegExp("\\b" + str + "\\b");

        if (re.test(el.className)) {
            el.className = el.className.replace(re, "");
        }
    }
};


module.exports.inject = function inject(el, str) {
    var style;

    if (!el) { return false; }

    if (str) {
        style = document.createElement("style");
        style.type = "text/css";

        if (style.styleSheet) {
            style.styleSheet.cssText = str;
        } else {
            style.appendChild(document.createTextNode(str));
        }

        el.appendChild(style);
    }
};

},{}],8:[function(require,module,exports){
'use strict';


module.exports = (function (window, document) {

    var cache = [];


    // NOOP for Node
    if (!document) {
        return {
            add: function () {},
            remove: function () {}
        };
    // Non-IE events
    } else if (document.addEventListener) {
        return {

            add: function (obj, type, fn, scope) {
                scope = scope || obj;

                var wrappedFn = function (e) { fn.call(scope, e); };

                obj.addEventListener(type, wrappedFn, false);
                cache.push([obj, type, fn, wrappedFn]);
            },

            remove: function (obj, type, fn) {
                var wrappedFn, item, len = cache.length, i;

                for (i = 0; i < len; i++) {
                    item = cache[i];

                    if (item[0] === obj && item[1] === type && item[2] === fn) {
                        wrappedFn = item[3];

                        if (wrappedFn) {
                            obj.removeEventListener(type, wrappedFn, false);
                            delete cache[i];
                        }
                    }
                }
            }
        };

    // IE events
    } else if (document.attachEvent) {
        return {

            add: function (obj, type, fn, scope) {
                scope = scope || obj;

                var wrappedFn = function () {
                    var e = window.event;
                    e.target = e.target || e.srcElement;

                    e.preventDefault = function () {
                        e.returnValue = false;
                    };

                    fn.call(scope, e);
                };

                obj.attachEvent('on' + type, wrappedFn);
                cache.push([obj, type, fn, wrappedFn]);
            },

            remove: function (obj, type, fn) {
                var wrappedFn, item, len = cache.length, i;

                for (i = 0; i < len; i++) {
                    item = cache[i];

                    if (item[0] === obj && item[1] === type && item[2] === fn) {
                        wrappedFn = item[3];

                        if (wrappedFn) {
                            obj.detachEvent('on' + type, wrappedFn);
                            delete cache[i];
                        }
                    }
                }
            }
        };
    }

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);
},{}],9:[function(require,module,exports){

/*!
 * EJS
 * Copyright(c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('./utils')
  , path = require('path')
  , dirname = path.dirname
  , extname = path.extname
  , join = path.join
  , fs = require('fs')
  , read = fs.readFileSync;

/**
 * Filters.
 *
 * @type Object
 */

!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a){return"[object Array]"===j.call(a)}function e(a,b){var c;if(null===a)c={__proto__:null};else{if("object"!=typeof a)throw new TypeError("typeof prototype["+typeof a+"] != 'object'");var d=function(){};d.prototype=a,c=new d,c.__proto__=a}return"undefined"!=typeof b&&Object.defineProperties&&Object.defineProperties(c,b),c}function f(a){return"object"!=typeof a&&"function"!=typeof a||null===a}function g(a){if(f(a))throw new TypeError("Object.keys called on a non-object");var b=[];for(var c in a)k.call(a,c)&&b.push(c);return b}function h(a){if(f(a))throw new TypeError("Object.getOwnPropertyNames called on a non-object");var b=g(a);return c.isArray(a)&&-1===c.indexOf(a,"length")&&b.push("length"),b}function i(a,b){return{value:a[b]}}var j=Object.prototype.toString,k=Object.prototype.hasOwnProperty;c.isArray="function"==typeof Array.isArray?Array.isArray:d,c.indexOf=function(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c++)if(b===a[c])return c;return-1},c.filter=function(a,b){if(a.filter)return a.filter(b);for(var c=[],d=0;d<a.length;d++)b(a[d],d,a)&&c.push(a[d]);return c},c.forEach=function(a,b,c){if(a.forEach)return a.forEach(b,c);for(var d=0;d<a.length;d++)b.call(c,a[d],d,a)},c.map=function(a,b){if(a.map)return a.map(b);for(var c=new Array(a.length),d=0;d<a.length;d++)c[d]=b(a[d],d,a);return c},c.reduce=function(a,b,c){if(a.reduce)return a.reduce(b,c);var d,e=!1;2<arguments.length&&(d=c,e=!0);for(var f=0,g=a.length;g>f;++f)a.hasOwnProperty(f)&&(e?d=b(d,a[f],f,a):(d=a[f],e=!0));return d},c.substr="b"!=="ab".substr(-1)?function(a,b,c){return 0>b&&(b=a.length+b),a.substr(b,c)}:function(a,b,c){return a.substr(b,c)},c.trim=function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},c.bind=function(){var a=Array.prototype.slice.call(arguments),b=a.shift();if(b.bind)return b.bind.apply(b,a);var c=a.shift();return function(){b.apply(c,a.concat([Array.prototype.slice.call(arguments)]))}},c.create="function"==typeof Object.create?Object.create:e;var l="function"==typeof Object.keys?Object.keys:g,m="function"==typeof Object.getOwnPropertyNames?Object.getOwnPropertyNames:h;if((new Error).hasOwnProperty("description")){var n=function(a,b){return"[object Error]"===j.call(a)&&(b=c.filter(b,function(a){return"description"!==a&&"number"!==a&&"message"!==a})),b};c.keys=function(a){return n(a,l(a))},c.getOwnPropertyNames=function(a){return n(a,m(a))}}else c.keys=l,c.getOwnPropertyNames=m;if("function"==typeof Object.getOwnPropertyDescriptor)try{Object.getOwnPropertyDescriptor({a:1},"a"),c.getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor}catch(o){c.getOwnPropertyDescriptor=function(a,b){try{return Object.getOwnPropertyDescriptor(a,b)}catch(c){return i(a,b)}}}else c.getOwnPropertyDescriptor=i},{}],2:[function(){},{}],3:[function(a,b,c){function d(a,b){for(var c=0,d=a.length-1;d>=0;d--){var e=a[d];"."===e?a.splice(d,1):".."===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}var e=a("__browserify_process"),f=a("util"),g=a("_shims"),h=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,i=function(a){return h.exec(a).slice(1)};c.resolve=function(){for(var a="",b=!1,c=arguments.length-1;c>=-1&&!b;c--){var h=c>=0?arguments[c]:e.cwd();if(!f.isString(h))throw new TypeError("Arguments to path.resolve must be strings");h&&(a=h+"/"+a,b="/"===h.charAt(0))}return a=d(g.filter(a.split("/"),function(a){return!!a}),!b).join("/"),(b?"/":"")+a||"."},c.normalize=function(a){var b=c.isAbsolute(a),e="/"===g.substr(a,-1);return a=d(g.filter(a.split("/"),function(a){return!!a}),!b).join("/"),a||b||(a="."),a&&e&&(a+="/"),(b?"/":"")+a},c.isAbsolute=function(a){return"/"===a.charAt(0)},c.join=function(){var a=Array.prototype.slice.call(arguments,0);return c.normalize(g.filter(a,function(a){if(!f.isString(a))throw new TypeError("Arguments to path.join must be strings");return a}).join("/"))},c.relative=function(a,b){function d(a){for(var b=0;b<a.length&&""===a[b];b++);for(var c=a.length-1;c>=0&&""===a[c];c--);return b>c?[]:a.slice(b,c-b+1)}a=c.resolve(a).substr(1),b=c.resolve(b).substr(1);for(var e=d(a.split("/")),f=d(b.split("/")),g=Math.min(e.length,f.length),h=g,i=0;g>i;i++)if(e[i]!==f[i]){h=i;break}for(var j=[],i=h;i<e.length;i++)j.push("..");return j=j.concat(f.slice(h)),j.join("/")},c.sep="/",c.delimiter=":",c.dirname=function(a){var b=i(a),c=b[0],d=b[1];return c||d?(d&&(d=d.substr(0,d.length-1)),c+d):"."},c.basename=function(a,b){var c=i(a)[2];return b&&c.substr(-1*b.length)===b&&(c=c.substr(0,c.length-b.length)),c},c.extname=function(a){return i(a)[3]}},{__browserify_process:5,_shims:1,util:4}],4:[function(a,b,c){function d(a,b){var d={seen:[],stylize:f};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),o(b)?d.showHidden=b:b&&c._extend(d,b),u(d.showHidden)&&(d.showHidden=!1),u(d.depth)&&(d.depth=2),u(d.colors)&&(d.colors=!1),u(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=e),h(d,a,d.depth)}function e(a,b){var c=d.styles[b];return c?"["+d.colors[c][0]+"m"+a+"["+d.colors[c][1]+"m":a}function f(a){return a}function g(a){var b={};return G.forEach(a,function(a){b[a]=!0}),b}function h(a,b,d){if(a.customInspect&&b&&z(b.inspect)&&b.inspect!==c.inspect&&(!b.constructor||b.constructor.prototype!==b)){var e=b.inspect(d);return s(e)||(e=h(a,e,d)),e}var f=i(a,b);if(f)return f;var o=G.keys(b),p=g(o);if(a.showHidden&&(o=G.getOwnPropertyNames(b)),0===o.length){if(z(b)){var q=b.name?": "+b.name:"";return a.stylize("[Function"+q+"]","special")}if(v(b))return a.stylize(RegExp.prototype.toString.call(b),"regexp");if(x(b))return a.stylize(Date.prototype.toString.call(b),"date");if(y(b))return j(b)}var r="",t=!1,u=["{","}"];if(n(b)&&(t=!0,u=["[","]"]),z(b)){var w=b.name?": "+b.name:"";r=" [Function"+w+"]"}if(v(b)&&(r=" "+RegExp.prototype.toString.call(b)),x(b)&&(r=" "+Date.prototype.toUTCString.call(b)),y(b)&&(r=" "+j(b)),0===o.length&&(!t||0==b.length))return u[0]+r+u[1];if(0>d)return v(b)?a.stylize(RegExp.prototype.toString.call(b),"regexp"):a.stylize("[Object]","special");a.seen.push(b);var A;return A=t?k(a,b,d,p,o):o.map(function(c){return l(a,b,d,p,c,t)}),a.seen.pop(),m(A,r,u)}function i(a,b){if(u(b))return a.stylize("undefined","undefined");if(s(b)){var c="'"+JSON.stringify(b).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return a.stylize(c,"string")}return r(b)?a.stylize(""+b,"number"):o(b)?a.stylize(""+b,"boolean"):p(b)?a.stylize("null","null"):void 0}function j(a){return"["+Error.prototype.toString.call(a)+"]"}function k(a,b,c,d,e){for(var f=[],g=0,h=b.length;h>g;++g)f.push(F(b,String(g))?l(a,b,c,d,String(g),!0):"");return G.forEach(e,function(e){e.match(/^\d+$/)||f.push(l(a,b,c,d,e,!0))}),f}function l(a,b,c,d,e,f){var g,i,j;if(j=G.getOwnPropertyDescriptor(b,e)||{value:b[e]},j.get?i=j.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):j.set&&(i=a.stylize("[Setter]","special")),F(d,e)||(g="["+e+"]"),i||(G.indexOf(a.seen,j.value)<0?(i=p(c)?h(a,j.value,null):h(a,j.value,c-1),i.indexOf("\n")>-1&&(i=f?i.split("\n").map(function(a){return"  "+a}).join("\n").substr(2):"\n"+i.split("\n").map(function(a){return"   "+a}).join("\n"))):i=a.stylize("[Circular]","special")),u(g)){if(f&&e.match(/^\d+$/))return i;g=JSON.stringify(""+e),g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),g=a.stylize(g,"string"))}return g+": "+i}function m(a,b,c){var d=0,e=G.reduce(a,function(a,b){return d++,b.indexOf("\n")>=0&&d++,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0);return e>60?c[0]+(""===b?"":b+"\n ")+" "+a.join(",\n  ")+" "+c[1]:c[0]+b+" "+a.join(", ")+" "+c[1]}function n(a){return G.isArray(a)}function o(a){return"boolean"==typeof a}function p(a){return null===a}function q(a){return null==a}function r(a){return"number"==typeof a}function s(a){return"string"==typeof a}function t(a){return"symbol"==typeof a}function u(a){return void 0===a}function v(a){return w(a)&&"[object RegExp]"===C(a)}function w(a){return"object"==typeof a&&a}function x(a){return w(a)&&"[object Date]"===C(a)}function y(a){return w(a)&&"[object Error]"===C(a)}function z(a){return"function"==typeof a}function A(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||"undefined"==typeof a}function B(a){return a&&"object"==typeof a&&"function"==typeof a.copy&&"function"==typeof a.fill&&"function"==typeof a.binarySlice}function C(a){return Object.prototype.toString.call(a)}function D(a){return 10>a?"0"+a.toString(10):a.toString(10)}function E(){var a=new Date,b=[D(a.getHours()),D(a.getMinutes()),D(a.getSeconds())].join(":");return[a.getDate(),I[a.getMonth()],b].join(" ")}function F(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var G=a("_shims"),H=/%[sdj%]/g;c.format=function(a){if(!s(a)){for(var b=[],c=0;c<arguments.length;c++)b.push(d(arguments[c]));return b.join(" ")}for(var c=1,e=arguments,f=e.length,g=String(a).replace(H,function(a){if("%%"===a)return"%";if(c>=f)return a;switch(a){case"%s":return String(e[c++]);case"%d":return Number(e[c++]);case"%j":try{return JSON.stringify(e[c++])}catch(b){return"[Circular]"}default:return a}}),h=e[c];f>c;h=e[++c])g+=p(h)||!w(h)?" "+h:" "+d(h);return g},c.inspect=d,d.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},d.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},c.isArray=n,c.isBoolean=o,c.isNull=p,c.isNullOrUndefined=q,c.isNumber=r,c.isString=s,c.isSymbol=t,c.isUndefined=u,c.isRegExp=v,c.isObject=w,c.isDate=x,c.isError=y,c.isFunction=z,c.isPrimitive=A,c.isBuffer=B;var I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];c.log=function(){console.log("%s - %s",E(),c.format.apply(c,arguments))},c.inherits=function(a,b){a.super_=b,a.prototype=G.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})},c._extend=function(a,b){if(!b||!w(b))return a;for(var c=G.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}},{_shims:1}],5:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],6:[function(a,b,c){function d(a){return a.substr(1).split("|").reduce(function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"filters."+d+"("+a+e+")"})}function e(a,b,c,d){var e=b.split("\n"),f=Math.max(d-3,0),g=Math.min(e.length,d+3),h=e.slice(f,g).map(function(a,b){var c=b+f+1;return(c==d?" >> ":"    ")+c+"| "+a}).join("\n");throw a.path=c,a.message=(c||"ejs")+":"+d+"\n"+h+"\n\n"+a.message,a}function f(a,b){var c=k(i(b),a),d=j(a);return d||(c+=".ejs"),c}var g=a("./utils"),h=a("path"),i=h.dirname,j=h.extname,k=h.join,l=a("fs"),m=l.readFileSync,n=c.filters=a("./filters"),o={};c.clearCache=function(){o={}};var p=(c.parse=function(a,b){var b=b||{},e=b.open||c.open||"<%",g=b.close||c.close||"%>",h=b.filename,i=b.compileDebug!==!1,j="";j+="var buf = [];",!1!==b._with&&(j+="\nwith (locals || {}) { (function(){ "),j+="\n buf.push('";for(var k=1,l=!1,n=0,o=a.length;o>n;++n){var p=a[n];if(a.slice(n,e.length+n)==e){n+=e.length;var q,r,s=(i?"__stack.lineno=":"")+k;switch(a[n]){case"=":q="', escape(("+s+", ",r=")), '",++n;break;case"-":q="', ("+s+", ",r="), '",++n;break;default:q="');"+s+";",r="; buf.push('"}var t=a.indexOf(g,n),u=a.substring(n,t),v=n,w=null,x=0;if("-"==u[u.length-1]&&(u=u.substring(0,u.length-2),l=!0),0==u.trim().indexOf("include")){var y=u.trim().slice(7).trim();if(!h)throw new Error("filename option is required for includes");var z=f(y,h);w=m(z,"utf8"),w=c.parse(w,{filename:z,_with:!1,open:e,close:g,compileDebug:i}),j+="' + (function(){"+w+"})() + '",u=""}for(;~(x=u.indexOf("\n",x));)x++,k++;":"==u.substr(0,1)&&(u=d(u)),u&&(u.lastIndexOf("//")>u.lastIndexOf("\n")&&(u+="\n"),j+=q,j+=u,j+=r),n+=t-v+g.length-1}else"\\"==p?j+="\\\\":"'"==p?j+="\\'":"\r"==p||("\n"==p?l?l=!1:(j+="\\n",k++):j+=p)}return j+=!1!==b._with?"'); })();\n} \nreturn buf.join('');":"');\nreturn buf.join('');"},c.compile=function(a,b){b=b||{};var d=b.escape||g.escape,f=JSON.stringify(a),h=b.compileDebug!==!1,i=b.client,j=b.filename?JSON.stringify(b.filename):"undefined";a=h?["var __stack = { lineno: 1, input: "+f+", filename: "+j+" };",e.toString(),"try {",c.parse(a,b),"} catch (err) {","  rethrow(err, __stack.input, __stack.filename, __stack.lineno);","}"].join("\n"):c.parse(a,b),b.debug&&console.log(a),i&&(a="escape = escape || "+d.toString()+";\n"+a);try{var k=new Function("locals, filters, escape, rethrow",a)}catch(l){throw"SyntaxError"==l.name&&(l.message+=b.filename?" in "+j:" while compiling ejs"),l}return i?k:function(a){return k.call(this,a,n,d,e)}});c.render=function(a,b){var c,b=b||{};if(b.cache){if(!b.filename)throw new Error('"cache" option requires "filename".');c=o[b.filename]||(o[b.filename]=p(a,b))}else c=p(a,b);return b.__proto__=b.locals,c.call(b.scope,b)},c.renderFile=function(a,b,d){var e=a+":string";"function"==typeof b&&(d=b,b={}),b.filename=a;var f;try{f=b.cache?o[e]||(o[e]=m(a,"utf8")):m(a,"utf8")}catch(g){return void d(g)}d(null,c.render(f,b))},c.__express=c.renderFile,a.extensions?a.extensions[".ejs"]=function(a,b){b=b||a.filename;var c={filename:b,client:!0},d=l.readFileSync(b).toString(),e=p(d,c);a._compile("module.exports = "+e.toString()+";",b)}:a.registerExtension&&a.registerExtension(".ejs",function(a){return p(a,{})})},{"./filters":7,"./utils":8,fs:2,path:3}],7:[function(a,b,c){c.first=function(a){return a[0]},c.last=function(a){return a[a.length-1]},c.capitalize=function(a){return a=String(a),a[0].toUpperCase()+a.substr(1,a.length)},c.downcase=function(a){return String(a).toLowerCase()},c.upcase=function(a){return String(a).toUpperCase()},c.sort=function(a){return Object.create(a).sort()},c.sort_by=function(a,b){return Object.create(a).sort(function(a,c){return a=a[b],c=c[b],a>c?1:c>a?-1:0})},c.size=c.length=function(a){return a.length},c.plus=function(a,b){return Number(a)+Number(b)},c.minus=function(a,b){return Number(a)-Number(b)},c.times=function(a,b){return Number(a)*Number(b)},c.divided_by=function(a,b){return Number(a)/Number(b)},c.join=function(a,b){return a.join(b||", ")},c.truncate=function(a,b,c){return a=String(a),a.length>b&&(a=a.slice(0,b),c&&(a+=c)),a},c.truncate_words=function(a,b){var a=String(a),c=a.split(/ +/);return c.slice(0,b).join(" ")},c.replace=function(a,b,c){return String(a).replace(b,c||"")},c.prepend=function(a,b){return Array.isArray(a)?[b].concat(a):b+a},c.append=function(a,b){return Array.isArray(a)?a.concat(b):a+b},c.map=function(a,b){return a.map(function(a){return a[b]})},c.reverse=function(a){return Array.isArray(a)?a.reverse():String(a).split("").reverse().join("")},c.get=function(a,b){return a[b]},c.json=function(a){return JSON.stringify(a)}},{}],8:[function(a,b,c){c.escape=function(a){return String(a).replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")}},{}],9:[function(a,b){"use strict";var c=a("./util/template"),d=a("./constants");b.exports=function(a,b,e){var f,g,h;return e=e||{},g=b.get("lc")||d.DEFAULT_LOCALE,h=e.style||d.DEFAULT_STYLE,a=d.STRINGS[g][a],a=a.replace("{wordmark}",'<img src="'+d.WORDMARK[h]+'" alt="PayPal" />'),f={style:h,size:e.size||d.DEFAULT_SIZE,logo:d.LOGO,label:a},c(d.TEMPLATES.button,f)}},{"./constants":10,"./util/template":18}],10:[function(a,b){"use strict";b.exports={BN_CODE:"JavaScriptButtons_{label}",PAYPAL_URL:"https://{host}/cgi-bin/webscr",QR_URL:"https://{host}/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}",QR_PATTERN:13,QR_SIZE:250,PRETTY_PARAMS:{name:"item_name",number:"item_number",locale:"lc",currency:"currency_code",recurrence:"p3",period:"t3",callback:"notify_url",button_id:"hosted_button_id"},WIDGET_NAME:"paypal-button-widget",DEFAULT_HOST:"www.paypal.com",DEFAULT_TYPE:"button",DEFAULT_LABEL:"buynow",DEFAULT_SIZE:"large",DEFAULT_STYLE:"primary",DEFAULT_LOCALE:"en_US",DEFAULT_ENV:"www",TEMPLATES:{button:'<button class="paypal-button <%= style %> <%= size %>" type="submit">	<span class="paypal-button-logo">		<img src="<%= logo %>" />	</span><span class="paypal-button-content"><%- label %></span></button>',form:'<form method="post" action="<%= url %>" target="_top">	<% var optionIdx = 0; %>	<% for (var key in data) { %>		<% 			var item = data[key];			var renderable = (item.editable || item.value instanceof Array);		%>		<% if (renderable) { %>					<p class="paypal-group">				<label class="paypal-label">					<%= item.label || content[key] || key %>									<% if (item.value instanceof Array) { %>						<select class="paypal-select" name="os<%= optionIdx %>">							<% for (var i = 0, len = item.value.length; i < len; i++) { %>								<% var option = item.value[i].split(\':\') %>								<option value="<%= option[0] %>"><%= option.join(\' \') %></option>							<% } %>						</select>						<input type="hidden" name="on<%= optionIdx %>" value="<%= item.label %>">						<% ++optionIdx; %>					<% } else { %>											<input type="text" id="<%= key %>" name="<%= key %>" value="<%= item.value %>" class="paypal-input" />										<% } %>				</label>			</p>		<% } else { %>			<input type="hidden" name="<%= key %>" value="<%= item.value %>" />		<% } %>	<% } %>	<%- button %></form>',qr:'<img src="<%= url %>" alt="PayPal QR code" />'},STRINGS:{en_AU:{buynow:"Buy with {wordmark}",cart:"Add to Cart",donate:"Donate",subscribe:"Subscribe",paynow:"Pay Now",item_name:"Item",number:"Number",amount:"Amount",quantity:"Quantity"},fr_CA:{buynow:"Acheter",cart:"Ajouter au panier",donate:"Faire un don",subscribe:"Souscrire",paynow:"Payer maintenant",item_name:"Objet",number:"Numéro",amount:"Montant",quantity:"Quantité"},zh_CH:{buynow:"立即购买",cart:"添加到购物车",donate:"捐赠",subscribe:"租用",paynow:"现在支付",item_name:"物品",number:"编号",amount:"金额",quantity:"数量"},de_DE:{buynow:"Jetzt kaufen",cart:"In den Warenkorb",donate:"Spenden",subscribe:"Abonnieren",paynow:"Jetzt bezahlen",item_name:"Artikel",number:"Nummer",amount:"Betrag",quantity:"Menge"},es_ES:{buynow:"Comprar ahora",cart:"Añadir al carro",donate:"Donar",subscribe:"Suscribirse",paynow:"Pague ahora",item_name:"Artículo",number:"Número",amount:"Importe",quantity:"Cantidad"},fr_FR:{buynow:"Acheter",cart:"Ajouter au panier",donate:"Faire un don",subscribe:"Souscrire",paynow:"Payer maintenant",item_name:"Objet",number:"Numéro",amount:"Montant",quantity:"Quantité"},en_GB:{buynow:"Buy with {wordmark}",cart:"Add to Cart",donate:"Donate",subscribe:"Subscribe",paynow:"Pay Now",item_name:"Item",number:"Number",amount:"Amount",quantity:"Quantity"},zh_HK:{buynow:"立即買",cart:"加入購物車",donate:"捐款",subscribe:"訂用",paynow:"现在支付",item_name:"項目",number:"號碼",amount:"金額",quantity:"數量"},id_ID:{buynow:"Beli Sekarang",cart:"Tambah ke Keranjang",donate:"Donasikan",subscribe:"Berlangganan",paynow:"Bayar Sekarang",item_name:"Barang",number:"Nomor",amount:"Harga",quantity:"Kuantitas"},he_IL:{buynow:"וישכע הנק",cart:"תוינקה לסל ףסוה",donate:"םורת",subscribe:"יונמכ ףרטצה",paynow:"כשיו שלם ע",item_name:"טירפ",number:"רפסמ",amount:"םוכס",quantity:"מותכ"},it_IT:{buynow:"Paga adesso",cart:"Aggiungi al carrello",donate:"Donazione",subscribe:"Iscriviti",paynow:"Paga Ora",item_name:"Oggetto",number:"Numero",amount:"Importo",quantity:"Quantità"},ja_JP:{buynow:"今すぐ購入",cart:"カートに追加",donate:"寄付",subscribe:"購読",paynow:"今すぐ支払う",item_name:"商品",number:"番号",amount:"価格",quantity:"数量"},nl_NL:{buynow:"Nu kopen",cart:"Aan winkelwagentje toevoegen",donate:"Doneren",subscribe:"Abonneren",paynow:"Nu betalen",item_name:"Item",number:"Nummer",amount:"Bedrag",quantity:"Hoeveelheid"},no_NO:{buynow:"Kjøp nå",cart:"Legg til i kurv",donate:"Doner",subscribe:"Abonner",paynow:"Betal nå",item_name:"Vare",number:"Nummer",amount:"Beløp",quantity:"Antall"},pl_PL:{buynow:"Kup teraz",cart:"Dodaj do koszyka",donate:"Przekaż darowiznę",subscribe:"Subskrybuj",paynow:"Zapłać teraz",item_name:"Przedmiot",number:"Numer",amount:"Kwota",quantity:"Ilość"},br_PT:{buynow:"Comprar agora",cart:"Adicionar ao carrinho",donate:"Doar",subscribe:"Assinar",paynow:"Pagar agora",item_name:"Produto",number:"Número",amount:"Valor",quantity:"Quantidade"},ru_RU:{buynow:"Купить сейчас",cart:"Добавить в корзину",donate:"Пожертвовать",subscribe:"Подписаться",paynow:"Оплатить сейчас",item_name:"Товар",number:"Номер",amount:"Сумма",quantity:"Количество"},sv_SE:{buynow:"Köp nu",cart:"Lägg till i kundvagn",donate:"Donera",subscribe:"Abonnera",paynow:"Betal nu",item_name:"Objekt",number:"Nummer",amount:"Belopp",quantity:"Antal"},th_TH:{buynow:"ซื้อทันที",cart:"เพิ่มลงตะกร้า",donate:"บริจาค",subscribe:"บอกรับสมาชิก",paynow:"จ่ายตอนนี้",item_name:"ชื่อสินค้า",number:"รหัสสินค้า",amount:"ราคา",quantity:"จำนวน"},tr_TR:{buynow:"Hemen Alın",cart:"Sepete Ekleyin",donate:"Bağış Yapın",subscribe:"Abone Olun",paynow:"Şimdi öde",item_name:"Ürün",number:"Numara",amount:"Tutar",quantity:"Miktar"},zh_TW:{buynow:"立即購",cart:"加到購物車",donate:"捐款",subscribe:"訂閱",paynow:"现在支付",item_name:"商品",number:"商品編號",amount:"單價",quantity:"數量"},en_US:{buynow:"Buy with {wordmark}",cart:"Add to Cart",donate:"Donate with {wordmark}",subscribe:"Subscribe with {wordmark}",paynow:"Pay now with {wordmark}",item_name:"Item",number:"Number",amount:"Amount",quantity:"Quantity"}},STYLES:'.paypal-button { 	white-space: nowrap;	overflow: hidden;	margin: 0;	padding: 0;	background: 0;	border: 0;	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;	font-weight: bold;	-webkit-font-smoothing: antialiased;	font-smoothing: antialiased;	cursor: pointer;	z-index: 0;}.paypal-button-logo { 	display: inline-block;	border: 1px solid #aaa;	border-right: 0;	border-radius: 3px 0 0 3px;	vertical-align: top;}.paypal-button-content { 		padding: 4px 8px 4px;		border: 1px solid transparent;	border-radius: 0 3px 3px 0;	min-width: 57px !important;}.paypal-button-content img { 	vertical-align: middle;}/* Small */.paypal-button-logo { 	width: 24px;	height: 24px;}.paypal-button-logo img { 	width: 18px;	height: 18px;	margin: 3px 0 0 -1px;}.paypal-button-content { 	height: 16px;	display:inline-block;	font-size: 10px !important;	line-height: 16px !important;}.paypal-button-content img { 	width: 60px;	height: 16px;	margin: 1px 0 0 1px;}        /* Medium */.paypal-button.medium .paypal-button-logo { 	width: 30px;	height: 30px;}.paypal-button.medium .paypal-button-logo img { 	width: 22px;	height: 22px;	margin: 4px 0 0 0px;}.paypal-button.medium .paypal-button-content { 	height: 19px;	font-size: 10px !important;	line-height: 19px !important;	padding: 5px 8px 6px;	min-width: 71px !important;}.paypal-button.medium .paypal-button-content img { 	width: 71px;	height: 19px;	margin: 2px 0 0 1px;}        /* Large */.paypal-button.large .paypal-button-logo { 	width: 42px;	height: 42px;}.paypal-button.large .paypal-button-logo img { 	width: 30px;	height: 30px;	margin: 6px 0 0 -1px;}.paypal-button.large .paypal-button-content { 	height: 25px;	font-size: 13px !important;	line-height: 25px !important;	padding: 8px 13px 9px;	min-width: 109px !important;}.paypal-button.large .paypal-button-content img { 	width: 93px;	height: 25px;	margin: 2px 0 0 2px;}    /* Primary */.paypal-button.primary .paypal-button-content { 	background: #009cde;	border-color: #009cde;	color: #fff;}    /* Secondary */.paypal-button.secondary .paypal-button-logo { 	border: 1px solid #cfcfcf;	border-right: 0;}.paypal-button.secondary .paypal-button-content { 	background: #eee;	border-color: #cfcfcf;	color: #333;}',LOGO:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1RJREFUeNrkmr9v01AQx99LoC1SAatCpQgJ0krQSkjgKUOllg4wIsFfABmYaTa2wMZI5g7lPyD9CxoWZnfrBJm7YFja2LHNnUlQVdWJ794PO8pXerLS1ok/vfP37l4sBVNrm+/fwKEmzKoLy//x/ZOn6w0lE/YDHFrCnvwh/AGsDvwDfNvAv+DgiGKEsB1YTQ64ZMBiGv8UxQthGwDdoZxUYXxQTZRDmGFfh15iFNgV5dI+QO+YBL4vyieMtDMrER6l9+4sAaPemQJ2Sgrs5LmXScAUcyhIru4I10oO7Mwa8ERdIf79U9anJLEQcajvqqvz1oDphpVEQp6e/IPWKQnJWbkqkuoCUFyD11UjwOSSJIM/+mFHWRP1hYQlgt9p1Af3HugrS+DQvPoLEbYiAA9ct7W8d7wPy9FhWjXuhdhSdDftenGYOMyCrphMZyOpPB72/LW2VIHpQ4NOZ6YBo3Yhyjt2U9oicLj28LIfv1YBJreV0pJhxTduivjW7ct+9ZIFPNzWEWWNcPikntk3QFq7nAgzgQfGYZP5BRFuPM7dLOUFLm0NxugidF7lBaY7tIX6i/dtv75FOsdchC1E9/TZC/I5xoBNO/QZwGY480X5HGD6lBQFRmEnGNV/nbzd8EjTEntbx0CE0Zz6W89zw4I8znhYihqMreMZwOZMY8vAGmGxiwrq25SontcBB5i+raM4JWHqDqA3Hqyup0cFdTnAZMOScUBK1fQIqZpANAfwmpi2WfoChuVzgOk1GFpKNJcgu8e1oTa5DnO3dcL1R0XDdi+Wo7x1mOXQ/c3tImHTL8q5nRY5wsncHKmZN6CPEN0eF5g8NMRLS0XColF9Vumla1MEjLAN1eGB3FbG1xeLgG3mgR1blrjbOpYjjI1FY9w9S6nDLOBk0XiER89ptbNKDxeYVYNjvcDeEBAjeDSuvuoAJjt0tLKiErVXANM1nR4VrTWYH92mDVjtwAoObQV2EjB5SuI6NMVljQBzt3WYhuUJi6roLEnMCPemElih4TgqAzB5WwenJIVaWzgwWdEdpRpcOHCbeiHcGmyr/o4kdb3R8t7xIWO66gHw6lSmNLP3turQ2oCHjwhxHiv+NpXAgv/QuD9rwN60ArNgbTs06q8AAwC1swu0LaowrwAAAABJRU5ErkJggg==",WORDMARK:{primary:"data:image/png;base64,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",secondary:"data:image/png;base64,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"}}},{}],11:[function(a,b){"use strict";var c=a("./util/datastore"),d=a("./constants"),e=a("./button"),f=a("./util/css"),g=a("./form"),h=a("./qr"),i=!1;
b.exports=function(a,b,j){var k,l,m,n,o,p;if(!a)return!1;if(b.items)k=b;else{k=new c;for(n in b)b.hasOwnProperty(n)&&k.add(n,b[n])}return j=j||{},o=j.label||d.DEFAULT_LABEL,p=j.type||d.DEFAULT_TYPE,"cart"===p?(k.add("cmd","_cart"),k.add("add",!0)):"donate"===p?k.add("cmd","_donations"):"subscribe"===p?(k.add("cmd","_xclick-subscriptions"),k.get("amount")&&!k.get("a3")&&k.add("a3",k.pluck("amount"))):k.get("hosted_button_id")?k.add("cmd","_s-xclick"):k.add("cmd","_xclick"),k.add("business",a),k.add("bn",d.BN_CODE.replace(/\{label\}/,o)),m="qr"===p?h(k,j):"button"===p?e(o,k,j):g(o,k,j),i||(i=!0,f.inject(document.getElementsByTagName("head")[0],d.STYLES)),l=document.createElement("div"),l.className=d.WIDGET_NAME,l.innerHTML=m,{label:o,type:p,el:l}}},{"./button":9,"./constants":10,"./form":12,"./qr":14,"./util/css":15,"./util/datastore":16}],12:[function(a,b){"use strict";var c=a("./constants"),d=a("./util/template"),e=a("./button");b.exports=function(a,b,f){var g,h,i,j;return h=e(a,b,f),j=b.get("lc")||c.DEFAULT_LOCALE,i=c.PAYPAL_URL,i=i.replace("{host}",f.host||c.DEFAULT_HOST),g={data:b.items,button:h,url:i,content:c.STRINGS[j]},d(c.TEMPLATES.form,g)}},{"./button":9,"./constants":10,"./util/template":18}],13:[function(a,b){"use strict";var c=a("./util/datastore"),d=a("./factory"),e={};e.counter={buynow:0,cart:0,donate:0,subscribe:0},e.create=function(a,b,c,f){var g=d(a,b,c);return g&&(e.counter[g.label]+=1,f&&f.appendChild(g.el)),g},e.process=function(a){var b,d,f,g,h,i=a.getElementsByTagName("script");for(g=0,h=i.length;h>g;g++)b=i[g],b&&b.src&&(d=new c,d.parse(b),(f=b.src.split("?merchant=")[1])&&(e.create(f,d,{type:d.pluck("type"),label:d.pluck("button"),size:d.pluck("size"),style:d.pluck("style"),host:d.pluck("host")},b.parentNode),b.parentNode.removeChild(b)))},"undefined"==typeof window?b.exports=e:(window.paypal||(window.paypal={},window.paypal.button=e),window.paypal.button.process(document))},{"./factory":11,"./util/datastore":16}],14:[function(a,b){"use strict";var c=a("./constants"),d=a("./util/template");b.exports=function(a,b){var e,f,g={};b=b||{},b.size=b.size||c.QR_SIZE,b.host=b.host||c.DEFAULT_HOST,e=c.PAYPAL_URL,e=e.replace("{host}",b.host),e+="?";for(f in a.items)a.items.hasOwnProperty(f)&&(e+=f+"="+encodeURIComponent(a.get(f))+"&");return e=encodeURIComponent(e),g.url=c.QR_URL.replace("{host}",b.host).replace("{url}",e).replace("{pattern}",c.QR_PATTERN).replace("{size}",b.size),d(c.TEMPLATES.qr,g)}},{"./constants":10,"./util/template":18}],15:[function(a,b){"use strict";b.exports.add=function(a,b){var c;return a?void(a&&a.classList&&a.classList.add?a.classList.add(b):(c=new RegExp("\\b"+b+"\\b"),c.test(a.className)||(a.className+=" "+b))):!1},b.exports.remove=function(a,b){var c;return a?void(a.classList&&a.classList.add?a.classList.remove(b):(c=new RegExp("\\b"+b+"\\b"),c.test(a.className)&&(a.className=a.className.replace(c,"")))):!1},b.exports.inject=function(a,b){var c;return a?void(b&&(c=document.createElement("style"),c.type="text/css",c.styleSheet?c.styleSheet.cssText=b:c.appendChild(document.createTextNode(b)),a.appendChild(c))):!1}},{}],16:[function(a,b){"use strict";function c(){this.items={}}var d=a("../constants");c.prototype.add=function(a,b){a=d.PRETTY_PARAMS[a]||a,"string"==typeof b&&(b={value:b}),this.items[a]={label:b.label||"",value:b.value||"",editable:!!b.editable}},c.prototype.get=function(a){var b=this.items[a];return b&&b.value},c.prototype.remove=function(a){delete this.items[a]},c.prototype.pluck=function(a){var b=this.get(a);return this.remove(a),b},c.prototype.parse=function(a){var b,c,d,e,f,g,h,i,j;if(b=a.attributes)for(j=0,i=b.length;i>j;j++)c=b[j],(d=c.name.match(/^data-([a-z0-9_]+)(-editable)?/i))&&(e=d[1],h=!!d[2],g=c.value,0===e.indexOf("option")&&(g=g.split("="),f=g[0],g=g[1].split(",")),this.add(e,{label:f,value:g,editable:h}))},b.exports=c},{"../constants":10}],17:[function(a,b){"use strict";b.exports=function(a,b){var c=[];return b?b.addEventListener?{add:function(a,b,d,e){e=e||a;var f=function(a){d.call(e,a)};a.addEventListener(b,f,!1),c.push([a,b,d,f])},remove:function(a,b,d){var e,f,g,h=c.length;for(g=0;h>g;g++)f=c[g],f[0]===a&&f[1]===b&&f[2]===d&&(e=f[3],e&&(a.removeEventListener(b,e,!1),delete c[g]))}}:b.attachEvent?{add:function(b,d,e,f){f=f||b;var g=function(){var b=a.event;b.target=b.target||b.srcElement,b.preventDefault=function(){b.returnValue=!1},e.call(f,b)};b.attachEvent("on"+d,g),c.push([b,d,e,g])},remove:function(a,b,d){var e,f,g,h=c.length;for(g=0;h>g;g++)f=c[g],f[0]===a&&f[1]===b&&f[2]===d&&(e=f[3],e&&(a.detachEvent("on"+b,e),delete c[g]))}}:void 0:{add:function(){},remove:function(){}}}("undefined"==typeof window?null:window,"undefined"==typeof document?null:document)},{}],18:[function(a,b){"use strict";var c=a("ejs");b.exports=function(a,b){return c.render(a,b)},String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")})},{ejs:6}]},{},[9,10,11,12,13,14,15,16,17,18]);