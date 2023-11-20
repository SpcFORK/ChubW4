export default function depadString(str: string = '{{Error}}', cnln: number = 0): string {
  
  if (!str || str === '{{Error}}') {
    throw new Error('String must be at least 1 character long');
  }
  
  const removePadding = (line: string) => line.slice(Math.max(cnln, 0));
  const addPadding = (line: string, amount: number) => ' '.repeat(amount) + line;

  if (cnln >= 0) {
    return str.split('\n').map(removePadding).join('\n');
  } else {
    const amount = -cnln;
    return str.split('\n').map(line => addPadding(line, amount)).join('\n');
  }
}