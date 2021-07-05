export function permuteString(string) {
  const strings = [];
  permute("", string);
  return strings;

  function permute(curr, remaining) {
    strings.push(curr);
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
