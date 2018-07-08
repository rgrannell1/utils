
const markdown = {}

markdown.header = (depth, text) => {
  return ''.padStart(depth, '#') + ' ' + text
}

/**
 * Create a heading equivalent to <h1>
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h1 = markdown.header.bind(null, 1)
/**
 * Create a heading equivalent to <h1>
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h2 = markdown.header.bind(null, 2)
/**
 * Create a heading equivalent to <h2>
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h3 = markdown.header.bind(null, 3)
/**
 * Create a heading equivalent to <h3>
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h4 = markdown.header.bind(null, 4)
/**
 * Create a heading equivalent to <h4>
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h5 = markdown.header.bind(null, 5)
/**
 * Create a heading equivalent to <h5>
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h6 = markdown.header.bind(null, 6)

markdown.italic = text => `*${text}*`
markdown.bold = text => `**${text}**`
markdown.mono = text => `\`${text}\``
markdown.link = (text, link) => `[${text}](${link})`

markdown.rule = () => '---'
markdown.list = lines => lines.map(line => `- ${line}`)
markdown.code = text => '```\n' + text + '\n```'
markdown.document = lines => lines.join('\n')

module.exports = markdown
