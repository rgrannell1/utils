
const mustache = { }

mustache.var = text => `{{${text}}}`
mustache.comment = text => `{{! ${text}}}`
mustache.section = (text, content) => {
  return [
    `{{#${text}}}`,
    content,
    `{{/${text}}}`
  ].join('\n')
}

module.exports = mustache
