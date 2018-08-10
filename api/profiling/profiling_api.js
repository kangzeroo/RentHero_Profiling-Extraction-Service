
module.exports.split_text = function(text) {
  console.log('----------- TEXT -----------')
  console.log(text)
  // const lines = text.split(/(\\.?\\,?\\;?)|(\\r\\n|\\r|\\n)/ig)
  const lines = text.split(/((\s*\n)|(\.\s))/).filter((l) => {
    return l !== '\n' || l !== '' || l !== '. '
  }).filter(l => l)
  // const lines = text.split('\n')
  console.log('----------- LINES -----------')
  console.log(lines)
  return lines
}
