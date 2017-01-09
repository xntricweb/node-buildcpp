const clone = require('clone');
const debug = require('merge')('ama:merge');

module.exports = merge;

let mergers = [
    [
      //tar is primitive
      (t,s,i) => { // src is primitive
        let src = s[i];
        if (typeof src !== 'string') return t[i] = src;

        switch (src[0]) {
          case '+':
          return t[i] = (t[i] || '') + src.slice(1);

          default:
          return t[i] = src;
        }
      },
      (t,s,i) => { //src is object
        if (t[i] === undefined) return t[i] = s[i];
        throw new Error("Can't convert object to primitive, key: " + i)
      },
      (t,s,i) => { //src is array
        if (t[i] === undefined) return t[i] = s[i];
        else {
          t[i] = [t[i]];
          t[i].push(...s[i]);
          return t[i];
        }
        throw new Error("Can't convert array to primitive, key: " + i)
      },
    ], [
      //tar is object
      (t,s,i) => {throw new Error("Can't convert primitive to object, key: " + i)},
      (t,s,i) => merge(t[i], s[i]),
      (t,s,i) => {throw new Error("Can't convert array to object, key: " + i)}
    ], [
      (t,s,i) => t[i].push(s[i]),
      (t,s,i) => t[i].push(s[i]),
      (t,s,i) => t[i].push(...s[i])
    ]
];

function merge(target, source) {
  let ts, tt;
  for (let i in source) {
    ts = getType(source[i]);
    tt = getType(target[i]);
    mergers[tt][ts](target, source, i);
  }

  return target;
}

function getType(o) {
  return (typeof o == 'object' ? (o instanceof Array ? 2 : 1): 0);
}
