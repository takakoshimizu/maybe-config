// To use: import into an empty file and re-export this import applied to 
// the config object you wish to safely wrap.

var Maybe = require('jsmaybe');

function config(config) {
  if (!config) throw new Error('No config root provided to config object.');

  function setStore() {}
  function overrideConfig(c) { config = c }

  function convertStringBools(v) {
    if (typeof v === 'string') {
      if (v === '0') return false;
      if (v === '1') return true;
    }
    return v;
  }

  function get(root, key) {
    if (!root || !keyExists(root, key)) return logKeyError(root, key);
    return root.map(function(r){ return convertStringBools(r[key]) });
  }

  function getIn(root, keyPath) {
    var next = get(root, keyPath[0]);
    if (keyPath.length === 1) return next;
    return getIn(next, keyPath.slice(1));
  }

  function getFlag(flag) {
    var flags = getFromRoot('flags');
    var f = flags.map(function(ff) { return ff[flag] });

    if (f === Maybe.Nothing) return false;
    return f.value();
  }

  function getFromRoot(key) {
    return get(Maybe.of(config), key);
  }

  function getInFromRoot() {
    return getIn(Maybe.of(config), Array.from(arguments));
  }

  function getClientSetting() {
    return getIn(Maybe.of(config), [ 'settings' ].concat(Array.from(arguments)));
  }

  function keyExists(root, key) {
    return root.map(function(r) { return r[key] }) !== Maybe.Nothing;
  }

  function logKeyError(root, key) {
    if (DEBUG) {
      console.warn('Unable to find key ' + key + ' from config object: ',
        root.value());
    }
    return Nothing;
  }

  return {
    get: function(key) { return getFromRoot(key).value() },
    getSafe: getFromRoot,
    getIn: function() { return getInFromRoot.apply(null, arguments).value() },
    getInSafe: getInFromRoot,
    getClientSetting: function() { return getClientSetting.apply(null, arguments).value() },
    getClientSettingSafe: getClientSetting,
    setStore,
    getFlag,
    overrideConfig
  };
};

module.exports = config;
