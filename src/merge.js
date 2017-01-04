const clone = require('clone');

module.exports = merge;

let mergers = [
    [
      //tar is primitive
      (t,s,i) => t[i] = s[i], // src is primitive
      (t,s,i) => { throw new Error("Can't convert object to primitive") }, //src is object
      (t,s,i) => {throw new Error("Can't convert array to primitive")}, //src is array
    ], [
      //tar is object
      (t,s,i) => {throw new Error("Can't convert primitive to object.")},
      (t,s,i) => merge(t[i], s[i]),
      (t,s,i) => {throw new Error("Can't convert array to object.")}
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
