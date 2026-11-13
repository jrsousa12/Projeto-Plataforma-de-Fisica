/* Lista única dos quizzes. Para acrescentar um quiz, inclua uma linha aqui (veja "Acrescentar um quiz" no README.md).
   id: nome curto usado no endereço (?q=id) e em window.QUIZZES/BANKS
   nome: nome mostrado ao aluno
   prefixo: início das chaves salvas no aparelho (não mude depois de publicado: o progresso dos alunos fica nelas)
   letra: primeira letra dos ids das perguntas (q001, f001...)
   arquivos: o que o quiz carrega, em ordem (banco, configuração, figuras e animações) */
(function (root) {
  "use strict";
  var L = [
    {
      id: "eletro",
      nome: "Eletrostática",
      prefixo: "eletriz:",
      letra: "q",
      arquivos: [
        "perguntas-eletro.js",
        "quiz-eletro.js",
        "figuras.js",
        "figuras-anim.js",
        "figuras-animq-eletro.js",
        "figuras-animq-eletro2.js",
        "figuras-animq-eletro3.js",
        "figuras-animq-eletro4.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-base.js",
        "figuras-fenomeno-eletro.js",
      ],
    },
    {
      id: "fluidos",
      nome: "Mecânica dos Fluidos",
      prefixo: "fluidos:",
      letra: "f",
      arquivos: [
        "perguntas-fluidos.js",
        "quiz-fluidos.js",
        "figuras-fluidos.js",
        "figuras-anim.js",
        "figuras-animq-fluidos.js",
        "figuras-animq-fluidos2.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-base.js",
        "figuras-fenomeno-mfluidos.js",
      ],
    },
    {
      id: "termo",
      nome: "Termologia",
      prefixo: "termo:",
      letra: "t",
      arquivos: [
        "perguntas-termo.js",
        "quiz-termo.js",
        "figuras-termo.js",
        "figuras-anim.js",
        "figuras-animq-termo.js",
        "figuras-animq-termo2.js",
        "figuras-animq-termo3.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-base.js",
        "figuras-fenomeno-termo.js",
      ],
    },
    {
      id: "onda",
      nome: "Ondulatória: Som",
      prefixo: "onda:",
      letra: "o",
      arquivos: [
        "perguntas-onda.js",
        "quiz-onda.js",
        "figuras-anim.js",
        "figuras-animq-onda.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-base.js",
        "figuras-fenomeno-onda.js",
      ],
    },
    {
      id: "optica",
      nome: "Óptica Geométrica",
      prefixo: "optica:",
      letra: "p",
      arquivos: [
        "perguntas-optica.js",
        "quiz-optica.js",
        "figuras-anim.js",
        "figuras-animq-optica.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-base.js",
        "figuras-fenomeno-optica.js",
      ],
    },
    {
      id: "mec",
      nome: "Mecânica: Cinemática e Dinâmica",
      prefixo: "mec:",
      letra: "m",
      arquivos: [
        "perguntas-mec.js",
        "quiz-mec.js",
        "figuras-anim.js",
        "figuras-animq-mec.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-mec.js",
      ],
    },
    {
      id: "edin",
      nome: "Eletrodinâmica",
      prefixo: "edin:",
      letra: "d",
      arquivos: [
        "perguntas-edin.js",
        "quiz-edin.js",
        "figuras-anim.js",
        "figuras-animq-edin.js",
        "figuras-animq-auto-dados.js",
        "figuras-animq-auto.js",
        "figuras-fenomeno-base.js",
        "figuras-fenomeno-eletro.js",
      ],
    },
  ];
  var Q = {
    lista: L,
    ids: function () {
      return L.map(function (q) {
        return q.id;
      });
    },
    por: function (id) {
      for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i];
      return null;
    },
    prefixos: function () {
      return L.map(function (q) {
        return q.prefixo;
      });
    },
    /* todos os arquivos dos quizzes, sem repetir */
    todosArquivos: function () {
      var v = {},
        r = [];
      L.forEach(function (q) {
        q.arquivos.forEach(function (f) {
          if (!v[f]) {
            v[f] = 1;
            r.push(f);
          }
        });
      });
      return r;
    },
    /* carrega uma lista de scripts em ordem; devolve uma Promise */
    carregar: function (arqs) {
      return arqs.reduce(function (p, f) {
        return p.then(function () {
          return new Promise(function (ok, err) {
            var s = document.createElement("script");
            s.src = f;
            s.onload = ok;
            s.onerror = function () {
              err(new Error(f));
            };
            document.head.appendChild(s);
          });
        });
      }, Promise.resolve());
    },
  };
  if (typeof module !== "undefined" && module.exports) module.exports = Q;
  else root.QuizLista = Q;
})(typeof self !== "undefined" ? self : this);
