/* Sorteio das questões da rodada. Recebe do quiz (script.js) o que usa; áreas marcadas, modo, nível e caderno mudam, por isso vêm de c.sel(), c.mode(), c.lvl() e c.bkList(). */
window.AppSorteio = function (c) {
  "use strict";
  var Q = c.Q,
    QZ = c.QZ,
    $ = c.$;
  var shuf = function (a) {
    a = a.slice();
    for (var n = a.length - 1; n > 0; n--) {
      var j = Math.floor(Math.random() * (n + 1)),
        t = a[n];
      a[n] = a[j];
      a[j] = t;
    }
    return a;
  };
  function poolSel() {
    var b = Q.map(function (_, k) {
      return k;
    }).filter(function (k) {
      return c.sel().indexOf(Q[k].t) >= 0 && !(c.mode() === "tempo" && QZ.semCalculo && (Q[k].c || Q[k].g));
    });
    if (c.lvl()) {
      var f = b.filter(function (k) {
        return (Q[k].n || 2) === c.lvl();
      });
      if (f.length) return f;
    }
    return b;
  }
  function pickSet(n) {
    n = n || 10;
    var pool = poolSel(),
      pk = [];
    if ($("reinf").checked) {
      pk = shuf(
        c.bkList().filter(function (k) {
          return pool.indexOf(k) >= 0;
        })
      ).slice(0, Math.floor(n * 0.4));
    }
    var rest = shuf(
      pool.filter(function (k) {
        return pk.indexOf(k) < 0;
      })
    );
    return shuf(pk.concat(rest.slice(0, n - pk.length)));
  }
  return { shuf: shuf, poolSel: poolSel, pickSet: pickSet };
};
