// exports.testElm = (req, res) => res.send("Hello, World!");
const Elm = require("./testElm-bundle.js");
//
console.log("Elm: ", Elm);

const hmm = require("./hmm.js");
const stuff = require("./hmm.js");

console.log("stuff: ", stuff);
//
// exports.testElm = (req, res) => {
//
//   res.send(stuff);
//
// };

// const Elm = require("./testElm-bundle.js");
//
// console.log("Elm: ", Elm);
//
// exports.testElm = (req, res) => {
//
//   console.log("request started");
//
//   const elmApp = Elm.TestElm.worker(node);
//
//   elmApp.ports.start.send();
//
//   elmApp.ports.finish.subscribe(() => {
//
//     console.log("request finished");
//
//     res.send("Hello, World! bine..!!!");
//
//   });
//
// };
