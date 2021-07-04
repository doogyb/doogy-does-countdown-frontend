export function permuteString (string) {
  const strings = []
  permute('', string)
  return strings

  function permute (curr, rest) {
    strings.push(curr)
    if (rest.length !== 0) {
      for (let i = 0; i < rest.length; i++) {
        permute(
          curr + rest[i],
          rest.slice(0, i).concat(rest.slice(i + 1, rest.length))
        )
      }
    }
  }
}
