/**
 * Simple console log wrapper with timestamp and header decoration.
 * @param args - Arguments to be logged.
 * @returns The combined logged string.
 */
export default function scl(...args: any[]): string {
  let header = `[ SPC ] - ${new Date().toLocaleTimeString()}\n  `;
  let comb = header + args.join('\n    -');
  console.log(comb + '\n\n');
  return comb;
}