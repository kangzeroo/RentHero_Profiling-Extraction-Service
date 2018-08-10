
module.exports = function(linesAugm) {
  const usefuls = linesAugm.filter((l) => {
    return l.classification === 'contactInfoScore' || l.classification === 'seperaterScore' || l.classification === ''
  })

  const chunks = [
    { meta: [], message: [] }
  ]
  let chunkNum = 0
  usefuls.forEach((uf, i) => {
    const cleanedLine = uf.line.replace('>', '').replace(' >', '').replace('> ', '')
    if (uf.classification === 'contactInfoScore') {
      chunks[chunkNum].meta.push(cleanedLine)
    }
    if (uf.classification === '') {
      chunks[chunkNum].message.push(cleanedLine)
    }
    if (uf.classification === 'seperaterScore') {
      chunks.push({ meta: [], message: [] })
      chunkNum += 1
    }
  })
  return Promise.resolve(chunks.filter((ch) => {
    return ch.message && ch.message.length > 0
  }))
}
