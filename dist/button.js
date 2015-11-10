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
	events: require('./lib/events'),
	Storage: require('./lib/storage')
};
},{"./lib/css":7,"./lib/events":8,"./lib/storage":9}],7:[function(require,module,exports){
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
'use strict';


var Storage = module.exports = function Storage(name, duration) {
    this._name = name;
    this._duration = duration || 30;
};


var proto = Storage.prototype;


proto.load = function () {
    if (typeof window === 'object' && window.localStorage) {
        var data = window.localStorage.getItem(this._name), today, expires;

        if (data) {
            data = JSON.parse(decodeURIComponent(data));
        }

        if (data && data.expires) {
            today = new Date();
            expires = new Date(data.expires);

            if (today > expires) {
                this.destroy();
                return;
            }
        }

        return data && data.value;
    }
};


proto.save = function (data) {
    if (typeof window === 'object' && window.localStorage) {
        var expires = new Date(), wrapped;

        expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

        wrapped = {
            value: data,
            expires: expires.toGMTString()
        };

        window.localStorage.setItem(this._name, encodeURIComponent(JSON.stringify(wrapped)));
    }
};


proto.destroy = function () {
    if (typeof window === 'object' && window.localStorage) {
        window.localStorage.removeItem(this._name);
    }
};

},{}],10:[function(require,module,exports){

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

var filters = exports.filters = require('./filters');

/**
 * Intermediate js cache.
 *
 * @type Object
 */

var cache = {};

/**
 * Clear intermediate js cache.
 *
 * @api public
 */

exports.clearCache = function(){
  cache = {};
};

/**
 * Translate filtered code into function calls.
 *
 * @param {String} js
 * @return {String}
 * @api private
 */

function filtered(js) {
  return js.substr(1).split('|').reduce(function(js, filter){
    var parts = filter.split(':')
      , name = parts.shift()
      , args = parts.join(':') || '';
    if (args) args = ', ' + args;
    return 'filters.' + name + '(' + js + args + ')';
  });
};

/**
 * Re-throw the given `err` in context to the
 * `str` of ejs, `filename`, and `lineno`.
 *
 * @param {Error} err
 * @param {String} str
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

function rethrow(err, str, filename, lineno){
  var lines = str.split('\n')
    , start = Math.max(lineno - 3, 0)
    , end = Math.min(lines.length, lineno + 3);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;
  
  throw err;
}

/**
 * Parse the given `str` of ejs, returning the function body.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var parse = exports.parse = function(str, options){
  var options = options || {}
    , open = options.open || exports.open || '<%'
    , close = options.close || exports.close || '%>'
    , filename = options.filename
    , compileDebug = options.compileDebug !== false
    , buf = "";

  buf += 'var buf = [];';
  if (false !== options._with) buf += '\nwith (locals || {}) { (function(){ ';
  buf += '\n buf.push(\'';

  var lineno = 1;

  var consumeEOL = false;
  for (var i = 0, len = str.length; i < len; ++i) {
    var stri = str[i];
    if (str.slice(i, open.length + i) == open) {
      i += open.length
  
      var prefix, postfix, line = (compileDebug ? '__stack.lineno=' : '') + lineno;
      switch (str[i]) {
        case '=':
          prefix = "', escape((" + line + ', ';
          postfix = ")), '";
          ++i;
          break;
        case '-':
          prefix = "', (" + line + ', ';
          postfix = "), '";
          ++i;
          break;
        default:
          prefix = "');" + line + ';';
          postfix = "; buf.push('";
      }

      var end = str.indexOf(close, i)
        , js = str.substring(i, end)
        , start = i
        , include = null
        , n = 0;

      if ('-' == js[js.length-1]){
        js = js.substring(0, js.length - 2);
        consumeEOL = true;
      }

      if (0 == js.trim().indexOf('include')) {
        var name = js.trim().slice(7).trim();
        if (!filename) throw new Error('filename option is required for includes');
        var path = resolveInclude(name, filename);
        include = read(path, 'utf8');
        include = exports.parse(include, { filename: path, _with: false, open: open, close: close, compileDebug: compileDebug });
        buf += "' + (function(){" + include + "})() + '";
        js = '';
      }

      while (~(n = js.indexOf("\n", n))) n++, lineno++;
      if (js.substr(0, 1) == ':') js = filtered(js);
      if (js) {
        if (js.lastIndexOf('//') > js.lastIndexOf('\n')) js += '\n';
        buf += prefix;
        buf += js;
        buf += postfix;
      }
      i += end - start + close.length - 1;

    } else if (stri == "\\") {
      buf += "\\\\";
    } else if (stri == "'") {
      buf += "\\'";
    } else if (stri == "\r") {
      // ignore
    } else if (stri == "\n") {
      if (consumeEOL) {
        consumeEOL = false;
      } else {
        buf += "\\n";
        lineno++;
      }
    } else {
      buf += stri;
    }
  }

  if (false !== options._with) buf += "'); })();\n} \nreturn buf.join('');";
  else buf += "');\nreturn buf.join('');";
  return buf;
};

/**
 * Compile the given `str` of ejs into a `Function`.
 *
 * @param {String} str
 * @param {Object} options
 * @return {Function}
 * @api public
 */

var compile = exports.compile = function(str, options){
  options = options || {};
  var escape = options.escape || utils.escape;
  
  var input = JSON.stringify(str)
    , compileDebug = options.compileDebug !== false
    , client = options.client
    , filename = options.filename
        ? JSON.stringify(options.filename)
        : 'undefined';
  
  if (compileDebug) {
    // Adds the fancy stack trace meta info
    str = [
      'var __stack = { lineno: 1, input: ' + input + ', filename: ' + filename + ' };',
      rethrow.toString(),
      'try {',
      exports.parse(str, options),
      '} catch (err) {',
      '  rethrow(err, __stack.input, __stack.filename, __stack.lineno);',
      '}'
    ].join("\n");
  } else {
    str = exports.parse(str, options);
  }
  
  if (options.debug) console.log(str);
  if (client) str = 'escape = escape || ' + escape.toString() + ';\n' + str;

  try {
    var fn = new Function('locals, filters, escape, rethrow', str);
  } catch (err) {
    if ('SyntaxError' == err.name) {
      err.message += options.filename
        ? ' in ' + filename
        : ' while compiling ejs';
    }
    throw err;
  }

  if (client) return fn;

  return function(locals){
    return fn.call(this, locals, filters, escape, rethrow);
  }
};

/**
 * Render the given `str` of ejs.
 *
 * Options:
 *
 *   - `locals`          Local variables object
 *   - `cache`           Compiled functions are cached, requires `filename`
 *   - `filename`        Used by `cache` to key caches
 *   - `scope`           Function execution context
 *   - `debug`           Output generated function body
 *   - `open`            Open tag, defaulting to "<%"
 *   - `close`           Closing tag, defaulting to "%>"
 *
 * @param {String} str
 * @param {Object} options
 * @return {String}
 * @api public
 */

exports.render = function(str, options){
  var fn
    , options = options || {};

  if (options.cache) {
    if (options.filename) {
      fn = cache[options.filename] || (cache[options.filename] = compile(str, options));
    } else {
      throw new Error('"cache" option requires "filename".');
    }
  } else {
    fn = compile(str, options);
  }

  options.__proto__ = options.locals;
  return fn.call(options.scope, options);
};

/**
 * Render an EJS file at the given `path` and callback `fn(err, str)`.
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function} fn
 * @api public
 */

exports.renderFile = function(path, options, fn){
  var key = path + ':string';

  if ('function' == typeof options) {
    fn = options, options = {};
  }

  options.filename = path;

  var str;
  try {
    str = options.cache
      ? cache[key] || (cache[key] = read(path, 'utf8'))
      : read(path, 'utf8');
  } catch (err) {
    fn(err);
    return;
  }
  fn(null, exports.render(str, options));
};

/**
 * Resolve include `name` relative to `filename`.
 *
 * @param {String} name
 * @param {String} filename
 * @return {String}
 * @api private
 */

function resolveInclude(name, filename) {
  var path = join(dirname(filename), name);
  var ext = extname(name);
  if (!ext) path += '.ejs';
  return path;
}

// express support

exports.__express = exports.renderFile;

/**
 * Expose to require().
 */

if (require.extensions) {
  require.extensions['.ejs'] = function (module, filename) {
    filename = filename || module.filename;
    var options = { filename: filename, client: true }
      , template = fs.readFileSync(filename).toString()
      , fn = compile(template, options);
    module._compile('module.exports = ' + fn.toString() + ';', filename);
  };
} else if (require.registerExtension) {
  require.registerExtension('.ejs', function(src) {
    return compile(src, {});
  });
}

},{"./filters":11,"./utils":12,"fs":2,"path":3}],11:[function(require,module,exports){
/*!
 * EJS - Filters
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * First element of the target `obj`.
 */

exports.first = function(obj) {
  return obj[0];
};

/**
 * Last element of the target `obj`.
 */

exports.last = function(obj) {
  return obj[obj.length - 1];
};

/**
 * Capitalize the first letter of the target `str`.
 */

exports.capitalize = function(str){
  str = String(str);
  return str[0].toUpperCase() + str.substr(1, str.length);
};

/**
 * Downcase the target `str`.
 */

exports.downcase = function(str){
  return String(str).toLowerCase();
};

/**
 * Uppercase the target `str`.
 */

exports.upcase = function(str){
  return String(str).toUpperCase();
};

/**
 * Sort the target `obj`.
 */

exports.sort = function(obj){
  return Object.create(obj).sort();
};

/**
 * Sort the target `obj` by the given `prop` ascending.
 */

exports.sort_by = function(obj, prop){
  return Object.create(obj).sort(function(a, b){
    a = a[prop], b = b[prop];
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
};

/**
 * Size or length of the target `obj`.
 */

exports.size = exports.length = function(obj) {
  return obj.length;
};

/**
 * Add `a` and `b`.
 */

exports.plus = function(a, b){
  return Number(a) + Number(b);
};

/**
 * Subtract `b` from `a`.
 */

exports.minus = function(a, b){
  return Number(a) - Number(b);
};

/**
 * Multiply `a` by `b`.
 */

exports.times = function(a, b){
  return Number(a) * Number(b);
};

/**
 * Divide `a` by `b`.
 */

exports.divided_by = function(a, b){
  return Number(a) / Number(b);
};

/**
 * Join `obj` with the given `str`.
 */

exports.join = function(obj, str){
  return obj.join(str || ', ');
};

/**
 * Truncate `str` to `len`.
 */

exports.truncate = function(str, len, append){
  str = String(str);
  if (str.length > len) {
    str = str.slice(0, len);
    if (append) str += append;
  }
  return str;
};

/**
 * Truncate `str` to `n` words.
 */

exports.truncate_words = function(str, n){
  var str = String(str)
    , words = str.split(/ +/);
  return words.slice(0, n).join(' ');
};

/**
 * Replace `pattern` with `substitution` in `str`.
 */

exports.replace = function(str, pattern, substitution){
  return String(str).replace(pattern, substitution || '');
};

/**
 * Prepend `val` to `obj`.
 */

exports.prepend = function(obj, val){
  return Array.isArray(obj)
    ? [val].concat(obj)
    : val + obj;
};

/**
 * Append `val` to `obj`.
 */

exports.append = function(obj, val){
  return Array.isArray(obj)
    ? obj.concat(val)
    : obj + val;
};

/**
 * Map the given `prop`.
 */

exports.map = function(arr, prop){
  return arr.map(function(obj){
    return obj[prop];
  });
};

/**
 * Reverse the given `obj`.
 */

exports.reverse = function(obj){
  return Array.isArray(obj)
    ? obj.reverse()
    : String(obj).split('').reverse().join('');
};

/**
 * Get `prop` of the given `obj`.
 */

exports.get = function(obj, prop){
  return obj[prop];
};

/**
 * Packs the given `obj` into json string
 */
exports.json = function(obj){
  return JSON.stringify(obj);
};

},{}],12:[function(require,module,exports){

/*!
 * EJS
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html){
  return String(html)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
 

},{}],13:[function(require,module,exports){
'use strict';


var template = require('./util/template'),
    constants = require('./constants');


module.exports = function button(label, data, config) {
    var model, locale, style;

    config = config || {};
    locale = data.get('lc') || constants.DEFAULT_LOCALE;
    style = config.style || constants.DEFAULT_STYLE;

    label = constants.STRINGS[locale][label];
    label = label.replace('{wordmark}', '<img src="' + constants.WORDMARK[style] + '" alt="PayPal" />');
    
    model = {
        style: style,
        size: config.size || constants.DEFAULT_SIZE,
        logo: constants.LOGO,
        label: label
    };
    
    return template(constants.TEMPLATES.button, model);
};

},{"./constants":14,"./util/template":20}],14:[function(require,module,exports){
'use strict';


module.exports = {

	BN_CODE: 'JavaScriptButtons_{label}',

	PAYPAL_URL: 'http://{host}/issue_bill',

	QR_URL: 'https://{host}/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',

	QR_PATTERN: 13,

	QR_SIZE: 250,

	PRETTY_PARAMS: {
		name: 'item_name',
		number: 'item_number',
		locale: 'lc',
		currency: 'currency_code',
		recurrence: 'p3',
		period: 't3',
		callback: 'notify_url',
		button_id: 'hosted_button_id'
	},

	WIDGET_NAME: 'paypal-button-widget',

	DEFAULT_HOST: 'consumer.dogpound.local:3000',

	DEFAULT_TYPE: 'button',

	DEFAULT_LABEL: 'buynow',

	DEFAULT_SIZE: 'large',

	DEFAULT_STYLE: 'primary',

	DEFAULT_LOCALE: 'en_US',

	DEFAULT_ENV: 'www',

	TEMPLATES: {"button":"<button class=\"cause-button\" type=\"submit\"></button>","form":"<form method=\"post\" action=\"<%= url %>\" target=\"_top\">\t<% var optionIdx = 0; %>\t<% for (var key in data) { %>\t\t<% \t\t\tvar item = data[key];\t\t\tvar renderable = (item.editable || item.value instanceof Array);\t\t%>\t\t<% if (renderable) { %>\t\t\t\t\t<p class=\"paypal-group\">\t\t\t\t<label class=\"paypal-label\">\t\t\t\t\t<%= item.label || content[key] || key %>\t\t\t\t\t\t\t\t\t<% if (item.value instanceof Array) { %>\t\t\t\t\t\t<select class=\"paypal-select\" name=\"os<%= optionIdx %>\">\t\t\t\t\t\t\t<% for (var i = 0, len = item.value.length; i < len; i++) { %>\t\t\t\t\t\t\t\t<% var option = item.value[i].split(':') %>\t\t\t\t\t\t\t\t<option value=\"<%= option[0] %>\"><%= option.join(' ') %></option>\t\t\t\t\t\t\t<% } %>\t\t\t\t\t\t</select>\t\t\t\t\t\t<input type=\"hidden\" name=\"on<%= optionIdx %>\" value=\"<%= item.label %>\">\t\t\t\t\t\t<% ++optionIdx; %>\t\t\t\t\t<% } else { %>\t\t\t\t\t\t\t\t\t\t\t<input type=\"text\" id=\"<%= key %>\" name=\"<%= key %>\" value=\"<%= item.value %>\" class=\"paypal-input\" />\t\t\t\t\t\t\t\t\t\t<% } %>\t\t\t\t</label>\t\t\t</p>\t\t<% } else { %>\t\t\t<input type=\"hidden\" name=\"<%= key %>\" value=\"<%= item.value %>\" />\t\t<% } %>\t<% } %>\t<%- button %></form>","qr":"<img src=\"<%= url %>\" alt=\"PayPal QR code\" />"},

	STRINGS: {"en_AU":{"buynow":"Buy with {wordmark}","cart":"Add to Cart","donate":"Donate with {wordmark}","subscribe":"Subscribe with {wordmark}","paynow":"Pay now with {wordmark}","item_name":"Item","number":"Number","amount":"Amount","quantity":"Quantity"},"pt_BR":{"buynow":"Comprar com {wordmark}","cart":"Adicionar ao carrinho","donate":"Doar com {wordmark}","subscribe":"Fazer assinatura com {wordmark}","paynow":"Pagar agora com {wordmark}","item_name":"Item","number":"Número","amount":"Valor","quantity":"Quantidade"},"fr_CA":{"buynow":"Achetez avec {wordmark}","cart":"Ajouter au panier","donate":"Faire un don avec {wordmark}","subscribe":"Souscrire avec {wordmark}","paynow":"Payez maintenant avec {wordmark}","item_name":"Objet","number":"Numéro","amount":"Montant","quantity":"Quantité"},"zh_CN":{"buynow":"使用{wordmark}购买","cart":"添加到购物车","donate":"使用{wordmark}捐赠","subscribe":"使用{wordmark}订用","paynow":"利用{wordmark}立即付款","item_name":"物品","number":"号码","amount":"金额","quantity":"数量"},"de_DE":{"buynow":"Kaufen mit {wordmark}","cart":"In den Warenkorb","donate":"Spenden mit {wordmark}","subscribe":"Abonnieren mit {wordmark}","paynow":"Jetzt bezahlen mit {wordmark}","item_name":"Artikel","number":"Nummer","amount":"Betrag","quantity":"Anzahl"},"da_DK":{"buynow":"Køb med {wordmark}","cart":"Læg i indkøbsvogn","donate":"Doner med {wordmark}","subscribe":"Abonner med {wordmark}","paynow":"Betal nu med {wordmark}","item_name":"Vare","number":"Nummer","amount":"Beløb","quantity":"Antal"},"es_ES":{"buynow":"Comprar con {wordmark}","cart":"Añadir al carro","donate":"Donar con {wordmark}","subscribe":"Suscribirse con {wordmark}","paynow":"Pagar ahora con {wordmark}","item_name":"Artículo","number":"Número","amount":"Importe","quantity":"Cantidad"},"fr_FR":{"buynow":"Acheter avec {wordmark}","cart":"Ajouter au panier","donate":"Faire un don avec {wordmark}","subscribe":"S'abonner avec {wordmark}","paynow":"Payer maintenant avec {wordmark}","item_name":"Objet","number":"Numéro","amount":"Montant","quantity":"Quantité"},"en_GB":{"buynow":"Buy with {wordmark}","cart":"Add to Cart","donate":"Donate with {wordmark}","subscribe":"Subscribe with {wordmark}","paynow":"Pay now with {wordmark}","item_name":"Item","number":"Number","amount":"Amount","quantity":"Quantity"},"zh_HK":{"buynow":"{wordmark} 購物","cart":"加到購物車","donate":"{wordmark} 捐款","subscribe":"{wordmark} 訂用","paynow":"{wordmark} 立即付款","item_name":"物品","number":"號碼","amount":"金額","quantity":"數量"},"id_ID":{"buynow":"Beli dengan {wordmark}","cart":"Tambah ke Keranjang","donate":"Donasikan dengan {wordmark}","subscribe":"Berlangganan dengan {wordmark}","paynow":"Bayar sekarang dengan {wordmark}","item_name":"Barang","number":"Nomor","amount":"Jumlah","quantity":"Jumlah"},"he_IL":{"buynow":"קנה באמצעות {wordmark}","cart":"הוסף לסל הקניות","donate":"תרום באמצעות {wordmark}","subscribe":"הצטרף כמנוי באמצעות {wordmark}","paynow":"שלם עכשיו באמצעות {wordmark}","item_name":"פריט","number":"מספר","amount":"סכום","quantity":"כמות"},"it_IT":{"buynow":"Compra con {wordmark}","cart":"Aggiungi al carrello","donate":"Fai una donazione con {wordmark}","subscribe":"Iscriviti con {wordmark}","paynow":"Paga adesso con {wordmark}","item_name":"Oggetto","number":"Numero","amount":"Importo","quantity":"Quantità"},"ja_JP":{"buynow":"{wordmark}で購入手続きに進む","cart":"カートに入れる","donate":"{wordmark}で寄付する","subscribe":"{wordmark}で定期購入","paynow":"{wordmark}で購入手続きに進む","item_name":"商品","number":"番号","amount":"金額","quantity":"数量"},"nl_NL":{"buynow":"Kopen met {wordmark}","cart":"Toevoegen aan winkelwagentje","donate":"Doneren met {wordmark}","subscribe":"Abonneren met {wordmark}","paynow":"Nu betalen met {wordmark}","item_name":"Object","number":"Nummer","amount":"Bedrag","quantity":"Hoeveelheid"},"no_NO":{"buynow":"Kjøp med {wordmark}","cart":"Legg i kurven","donate":"Doner med {wordmark}","subscribe":"Abonner med {wordmark}","paynow":"Betal nå med {wordmark}","item_name":"Artikkel","number":"Nummer","amount":"Beløp","quantity":"Antall"},"pl_PL":{"buynow":"Kup w systemie {wordmark}","cart":"Dodaj do koszyka","donate":"Przekaż darowiznę w systemie {wordmark}","subscribe":"Subskrybuj w systemie {wordmark}","paynow":"Zapłać teraz w systemie {wordmark}","item_name":"Przedmiot","number":"Numer","amount":"Kwota","quantity":"Ilość"},"pt_PT":{"buynow":"Compre com {wordmark}","cart":"Adicionar ao carrinho de compras","donate":"Doar com {wordmark}","subscribe":"Subscrever com {wordmark}","paynow":"Pague agora com {wordmark}","item_name":"Artigo","number":"Número","amount":"Valor","quantity":"Quantidade"},"ru_RU":{"buynow":"Совершайте покупки с {wordmark}","cart":"Добавить в корзину","donate":"Пожертвование с {wordmark}","subscribe":"Подписка с {wordmark}","paynow":"Оплатить сейчас с помощью {wordmark}","item_name":"Товар","number":"Номер","amount":"Сумма","quantity":"Количество"},"sv_SE":{"buynow":"Betala med {wordmark}","cart":"Lägg till i kundvagn","donate":"Donera med {wordmark}","subscribe":"Abonnera med {wordmark}","paynow":"Betala nu med {wordmark}","item_name":"Objekt","number":"Nummer","amount":"Belopp","quantity":"Antal"},"th_TH":{"buynow":"ซื้อด้วย {wordmark}","cart":"เพิ่มสินค้าลงในตะกร้า","donate":"บริจาคด้วย {wordmark}","subscribe":"บอกรับสมาชิกด้วย {wordmark}","paynow":"ชำระทันทีด้วย {wordmark}","item_name":"รายการสินค้า","number":"หมายเลข","amount":"จำนวนเงิน","quantity":"ปริมาณ"},"tr_TR":{"buynow":"{wordmark} ile Satın Alın","cart":"Sepete Ekleyin","donate":"{wordmark} ile Bağışta Bulunun","subscribe":"{wordmark} ile Abone Olun","paynow":"{wordmark} ile Şimdi Ödeyin","item_name":"Ürün","number":"Numarası","amount":"Tutar","quantity":"Miktar"},"zh_TW":{"buynow":"使用 {wordmark} 購買","cart":"加到購物車","donate":"使用 {wordmark} 捐款","subscribe":"使用 {wordmark} 訂閱","paynow":"使用 {wordmark} 立即付款","item_name":"商品","number":"號碼","amount":"金額","quantity":"數量"},"en_US":{"buynow":"Buy with {wordmark}","cart":"Add to Cart","donate":"Donate with {wordmark}","subscribe":"Subscribe with {wordmark}","paynow":"Pay now with {wordmark}","item_name":"Item","number":"Number","amount":"Amount","quantity":"Quantity"},"es_US":{"buynow":"Compre con {wordmark}","cart":"Añadir al carro","donate":"Donar con {wordmark}","subscribe":"Suscribir con {wordmark}","paynow":"Pagar ahora con {wordmark}","item_name":"Artículo","number":"Número","amount":"Importe","quantity":"Cantidad"},"fr_US":{"buynow":"Acheter avec {wordmark}","cart":"Ajouter au panier","donate":"Faire un don avec {wordmark}","subscribe":"S'abonner avec {wordmark}","paynow":"Payer maintenant avec {wordmark}","item_name":"Objet","number":"Numéro","amount":"Montant","quantity":"Quantité"},"zh_US":{"buynow":"使用{wordmark}购买","cart":"添加到购物车","donate":"使用{wordmark}捐赠","subscribe":"使用{wordmark}订用","paynow":"使用{wordmark}立即付款","item_name":"物品","number":"号码","amount":"金额","quantity":"数量"}},

	STYLES: '.cause-button {  width:            362px;  height:           105px;  background-color: transparent;  white-space: nowrap;  overflow: hidden;  margin: 0;  padding: 0;  border: 0;  cursor: pointer;  z-index: 0;  background-image: url("data:image/png;base64,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");}',

	LOGO: 'data:image/png;base64,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',

	WORDMARK: {
		primary: 'data:image/png;base64,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',
		secondary: 'data:image/png;base64,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'
	}

};

},{}],15:[function(require,module,exports){
'use strict';


var DataStore = require('./util/datastore'),
    constants = require('./constants'),
    button = require('./button'),
    css = require('browserlib').css,
    form = require('./form'),
    QR = require('./qr'),
    hasCss = false;



module.exports = function factory(business, raw, config) {
    var data, wrapper, html, key, label, type;

    if (!business) {
        return false;
    }


    // Normalize incoming data if needed
    if (raw.items) {
        data = raw;
    } else {
        data = new DataStore();

        for (key in raw) {
            if (raw.hasOwnProperty(key)) {
                data.add(key, raw[key]);
            }
        }
    }


    // Defaults
    config = config || {};
    label = config.label || constants.DEFAULT_LABEL;
    type = config.type || constants.DEFAULT_TYPE;


    // Cart
    if (type === 'cart') {
        data.add('cmd', '_cart');
        data.add('add', true);
    // Donation
    } else if (type === 'donate') {
        data.add('cmd', '_donations');
    // Subscribe
    } else if (type === 'subscribe') {
        data.add('cmd', '_xclick-subscriptions');

        if (data.get('amount') && !data.get('a3')) {
            data.add('a3', data.pluck('amount'));
        }
    // Buy Now
    } else if (data.get('hosted_button_id')) {
        data.add('cmd', '_s-xclick');
    } else {
        data.add('cmd', '_xclick');
    }

    // Add common data
    data.add('id', business);
    data.add('bn', constants.BN_CODE.replace(/\{label\}/, label));


    // Build the UI components
    if (type === 'qr') {
        html = QR(data, config);
    } else if (type === 'button') {
        html = button(label, data, config);
    } else {
        html = form(label, data, config);
    }


    // Inject the CSS onto the page
    if (!hasCss) {
        hasCss = true;
        css.inject(document.getElementsByTagName('head')[0], constants.STYLES);
    }


    // Wrap it up all nice and neat and return it
    wrapper = document.createElement('div');
    wrapper.className = constants.WIDGET_NAME;
    wrapper.innerHTML = html;

    return {
        label: label,
        type: type,
        el: wrapper
    };
};

},{"./button":13,"./constants":14,"./form":16,"./qr":18,"./util/datastore":19,"browserlib":6}],16:[function(require,module,exports){
'use strict';


var constants = require('./constants'),
    template = require('./util/template'),
    button = require('./button');


module.exports = function form(type, data, config) {
    var model, btn, url, locale;

    btn = button(type, data, config);
    locale = data.get('lc') || constants.DEFAULT_LOCALE;
    
    url = constants.PAYPAL_URL;
    url = url.replace('{host}', config.host || constants.DEFAULT_HOST);

    model = {
        data: data.items,
        button: btn,
        url: url,
        content: constants.STRINGS[locale]
    };

    return template(constants.TEMPLATES.form, model);
};



},{"./button":13,"./constants":14,"./util/template":20}],17:[function(require,module,exports){
'use strict';


var DataStore = require('./util/datastore'),
    factory = require('./factory'),
    app = {};


app.counter = {
    buynow: 0,
    cart: 0,
    donate: 0,
    subscribe: 0
};


app.create = function (business, data, config, parent) {
    var result = factory(business, data, config);

    if (result) {
        // Log how many buttons were created
        app.counter[result.label] += 1;

        // Add it to the page
        if (parent) {
            parent.appendChild(result.el);
        }
    }

    return result;
};


app.process = function (el) {
    var nodes = el.getElementsByTagName('script'),
        node, data, business, i, len;

    for (i = 0, len = nodes.length; i < len; i++) {
        node = nodes[i];

        if (!node || !node.src) {
            continue;
        }

        data = new DataStore();
        data.parse(node);

        // If there's a merchant ID attached then it's a button of interest
        if ((business = node.src.split('?merchant=')[1])) {
            app.create(
                business,
                data,
                {
                    type: data.pluck('type'),
                    label: data.pluck('button'),
                    size: data.pluck('size'),
                    style: data.pluck('style'),
                    host: data.pluck('host')
                },
                node.parentNode
            );

            // Clean up
            node.parentNode.removeChild(node);
        }
    }
};



// Support node and the browser
if (typeof window === 'undefined') {
    module.exports = app;
} else {
    // Make the API available
    if (!window.paypal) {
        window.paypal = {};
        window.paypal.button = app;
    }

    // Bind to existing scripts
    window.paypal.button.process(document);
}

},{"./factory":15,"./util/datastore":19}],18:[function(require,module,exports){
'use strict';


var constants = require('./constants'),
    template = require('./util/template');


module.exports = function Qr(data, config) {
    var model = {}, url, key;
    
    // Defaults
    config = config || {};
    config.size = config.size || constants.QR_SIZE;
    config.host = config.host || constants.DEFAULT_HOST;

    // Construct URL
    url = constants.PAYPAL_URL;
    url = url.replace('{host}', config.host);
    url = url + '?';

    for (key in data.items) {
        if (data.items.hasOwnProperty(key)) {
            url += key + '=' + encodeURIComponent(data.get(key)) + '&';
        }
    }

    url = encodeURIComponent(url);

    // Render
    model.url = constants.QR_URL
		.replace('{host}', config.host)
		.replace('{url}', url)
		.replace('{pattern}', constants.QR_PATTERN)
		.replace('{size}', config.size);


    return template(constants.TEMPLATES.qr, model);
};

},{"./constants":14,"./util/template":20}],19:[function(require,module,exports){
'use strict';


var constants = require('../constants');


function DataStore() {
    this.items = {};
}


DataStore.prototype.add = function addData(key, val) {
    // Remap nice values
    key = constants.PRETTY_PARAMS[key] || key;

    // Wrap strings in the value object
    if (typeof val === 'string') {
        val = {
            value: val
        };
    }

    this.items[key] = {
        label: val.label || '',
        value: val.value || '',
        editable: !!val.editable
    };
};


DataStore.prototype.get = function getData(key) {
    var item = this.items[key];

    return item && item.value;
};


DataStore.prototype.remove = function removeData(key) {
    delete this.items[key];
};


DataStore.prototype.pluck = function pluckData(key) {
    var val = this.get(key);
    this.remove(key);

    return val;
};


DataStore.prototype.parse = function parseData(el) {
    var attrs, attr, matches, key, label, value, editable, len, i;

    if ((attrs = el.attributes)) {

        for (i = 0, len = attrs.length; i < len; i++) {
            attr = attrs[i];

            if ((matches = attr.name.match(/^data-([a-z0-9_]+)(-editable)?/i))) {
                key = matches[1];
                editable = !!matches[2];
                value = attr.value;

                if (key.indexOf('option') === 0) {
                    value = value.split('=');
                    label = value[0];
                    value = value[1].split(',');
                }

                this.add(key, {
                    label: label,
                    value: value,
                    editable: editable
                });
            }


        }
    }
};



module.exports = DataStore;

},{"../constants":14}],20:[function(require,module,exports){
'use strict';


var ejs = require('ejs');


module.exports = function template(str, data) {
    return ejs.render(str, data);
};


// Workaround for IE 8's lack of support
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
},{"ejs":10}]},{},[13,14,15,16,17,18,19,20])
;