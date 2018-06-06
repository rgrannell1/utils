
const markdown = {}

markdown.header = (depth, text) => {
  return ''.padStart(depth, '#') + ' ' + text
}

markdown.h1 = markdown.header.bind(null, 1)
markdown.h2 = markdown.header.bind(null, 2)
markdown.h3 = markdown.header.bind(null, 3)
markdown.h4 = markdown.header.bind(null, 4)
markdown.h5 = markdown.header.bind(null, 5)
markdown.h6 = markdown.header.bind(null, 6)

markdown.italic = text => `*${text}*`
markdown.bold = text => `**${text}**`
markdown.mono = text => `\`${text}\``

markdown.rule = () => '---'
markdown.list = lines => lines.map(line => `- ${line}`)
markdown.code = text => '```\n' + text + '\n```'

module.exports = markdown
