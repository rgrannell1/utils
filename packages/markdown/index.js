
const markdown = {}

markdown.header = (depth, text) => {
  return ''.padStart(depth, '#') + ' ' + text
}

/**
 * Create a heading equivalent to <h1>
 *
 * @name markdown.h1
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h1 = markdown.header.bind(null, 1)
/**
 * Create a heading equivalent to <h1>
 *
 * @name markdown.h2
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h2 = markdown.header.bind(null, 2)
/**
 * Create a heading equivalent to <h2>
 *
 * @name markdown.h3
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h3 = markdown.header.bind(null, 3)
/**
 * Create a heading equivalent to <h3>
 *
 * @name markdown.h4
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h4 = markdown.header.bind(null, 4)
/**
 * Create a heading equivalent to <h4>
 *
 * @name markdown.h5
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h5 = markdown.header.bind(null, 5)
/**
 * Create a heading equivalent to <h5>
 *
 * @name markdown.h6
 *
 * @param  {String}    text the heading text to display.
 * @return {text}      a markdown string displaying a header.
 */
markdown.h6 = markdown.header.bind(null, 6)

/**
 * Create italic text
 *
 * @name markdown.italic
 *
 * @param  {String}    text the text to italicise.
 * @return {text}      a markdown string displaying italic text.
 */
markdown.italic = text => `*${text}*`
/**
 * Create bold text
 *
 * @name markdown.bold
 *
 * @param  {String}    text the text to embolden.
 * @return {text}      a markdown string displaying bold text.
 */
markdown.bold = text => `**${text}**`
/**
 * Create monospace text
 *
 * @name markdown.mono
 *
 * @param  {String}    text the target text.
 * @return {text}      monospaced text.
 */
markdown.mono = text => `\`${text}\``
/**
 * Create a link
 *
 * @name markdown.link
 *
 * @param  {String}    text the text description
 * @param  {String}    link the URL
 *
 * @return {text}      a markdown link.
 */
markdown.link = (text, link) => `[${text}](${link})`
/**
 * Create a divider
 *
 * @name markdown.rule
 *
 * @return {text}      a markdown divider.
 */
markdown.rule = () => '---'
/**
 * Create a markdown list
 *
 * @name markdown.list
 *
 * @param  {Array<string>}    lines an array of list entries.
 * @return {text}             a markdown string displaying a list.
 */
markdown.list = lines => lines.map(line => `- ${line}`)
/**
 * Create a markdown code block
 *
 * @name markdown.code
 *
 * @param  {String}    text the source-code.
 * @return {text}      a code block
 */
markdown.code = text => '```\n' + text + '\n```'
/**
 * Create a markdown document
 *
 * @name markdown.document
 *
 * @param  {Array<string>}    lines the heading text to display.
 * @return {text}             a markdown doucment.
 */
markdown.document = lines => lines.join('\n')

module.exports = markdown
