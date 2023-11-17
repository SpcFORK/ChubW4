/**
 * Simple console log wrapper with timestamp and header decoration.
 * @param {...any} args - Arguments to be logged.
 * @returns {string} The combined logged string.
 */
function scl(...args) {
  let header = `[ SPC ] - ${new Date().toLocaleTimeString()}\n  `;
  let comb = header + args.join('\n    -');
  console.log(comb + '\n\n');
  return comb;
}

module.exports = scl