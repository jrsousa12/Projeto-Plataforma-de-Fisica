/* Botão "Compartilhar resultado" da tela do fim: compartilha, copia ou mostra o texto para copiar.
   A nota, o total e o modo vêm do script.js por c.dados(). */
window.AppCompartilhar = function (c) {
  "use strict";
  var $ = c.$,
    QZ = c.QZ,
    num = c.num;
  $("share").onclick = function () {
    var d = c.dados(),
      b = $("share"),
      t =
        "Fiz " +
        num(d.score) +
        "/" +
        d.n +
        " no quiz de " +
        QZ.nome.toLowerCase() +
        " (" +
        (d.mode === "tempo" ? "cronometrado" : "modo estudo") +
        ") em " +
        $("s3").textContent +
        ". Tente também!" +
        (/^https?:$/.test(location.protocol) ? " " + location.origin + location.pathname : "");
    var show = function () {
      var s = $("shtxt");
      if (!s) {
        s = document.createElement("p");
        s.id = "shtxt";
        s.className = "hint";
        s.style.userSelect = "all";
        b.parentNode.insertBefore(s, b.nextSibling);
      }
      s.textContent = "Copie e envie: " + t;
    };
    try {
      if (navigator.share) {
        navigator.share({ text: t }).catch(function (e) {
          if (!e || e.name !== "AbortError") show();
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(t)
          .then(function () {
            b.textContent = "Copiado!";
          })
          .catch(show);
      } else {
        show();
      }
    } catch (e) {
      show();
    }
  };
};
