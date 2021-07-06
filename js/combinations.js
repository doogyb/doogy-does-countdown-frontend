export function permuteString(string) {
  const strings = new Set();
  permute("", string);
  return Array.from(strings);

  function permute(curr, remaining) {
    strings.add(curr);
    if (remaining.length !== 0) {
      for (let i = 0; i < remaining.length; i++) {
        permute(
          curr + remaining[i],
          remaining.slice(0, i).concat(remaining.slice(i + 1, remaining.length))
        );
      }
    }
  }
}
