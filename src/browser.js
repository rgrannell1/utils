
const puppeteer = require('puppeteer')
const object = require('./object')
const events = require('events')
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG
const stream = require('stream')
const fs = require('fs')
const videoshow = require('videoshow')
const fsUtils = require('./fs')


const browser = {}
const privateTag = Symbol('private')

browser.ScreenShot = class ScreenShot {
  constructor ({data, time}) {
    Object.assign(this, {data, time})
    return this
  }
  /**
   *
   * Convert the screenshot to a stream.
   *
   * @returns {object}
   */
  asStream () {
    const {time, data} = this

    const screenStream = new stream.Duplex()
    screenStream.push(data)
    screenStream.push(null)

    return {time, stream: screenStream}
  }
  /**
   *
   * Convert the screenshot to a buffer.
   *
   * @returns {object}
   */
  asBuffer () {
    const {time, data} = this
    return {time, data}
  }
  /**
   *
   * Convert the screenshot to a PNG.
   *
   * @returns {PNG}
   */
  asPNG () {
    return new Promise(resolve => {
      this.asStream().stream.pipe(new PNG())
        .on('parsed', function () {
          resolve(this)
        })
      })
  }
}

browser.ScreenCapture = class ScreenCapture extends events.EventEmitter {
  constructor (config) {
    super()
    const args = Object.assign({
      interval: 250
    }, config, {
      buffers: {
        unprocessed: [],
        diffed: []
      }
    })

    Object.assertProperties(args, ['page', 'interval'])
    Object.assign(this, args, {
      [privateTag]: {buffer: {previous: null, current: null}}
    })
    return this
  }
  async capture () {
    return new browser.ScreenShot({
      data: await this.page.screenshot(),
      time: Date.now()
    })
  }
  /**
   *
   * Start emitting screenshots.
   *
   * @returns {ScreenCapture}
   */
  start () {
    this.screenshotPid = setInterval(async () => {
      try {
        const screenshot = this.capture()

        this[privateTag].buffer.previous = this[privateTag].buffer.current
        this[privateTag].buffer.current = screenshot

        this.emit('screenshot', screenshot)

        if (this[privateTag].buffer.previous && this[privateTag].buffer.current) {
          this.emit('screenshot-pair', {
            time,
            previous: this[privateTag].buffer.previous,
            current: this[privateTag].buffer.current
          })
        }

      } catch (err) {
        this.emit('error', err)
      }

    }, this.interval)

    if (this.duration) {
      setTimeout(() => {
        this.stop()
      }, this.duration)
    }
    return this
  }
  /**
   *
   * Stop capturing screenshots.
   *
   * @returns {ScreenCapture}
   */
  stop () {
    if (this.screenshotPid) {
      clearInterval(this.screenshotPid)
      this.emit('close')
    }
    return this
  }
  /**
   *
   * Compare two screenshots
   *
   * @param {ScreenShot} the first screenshot.
   * @param {ScreenShot} the second screenshot.
   * @param {object} opts pixelmatch options.
   *
   * @returns {ScreenCapture}
   */
  static async compare (screenshot0, screenshot1, opts = {threshold: 0}) {
    const [png0, png1] = await Promise.all([screenshot0.asPNG(), screenshot1.asPNG()])

    const width = png0.width
    const height = png0.height

    const diff = new PNG({width, height});

    // compute the diff between two screenshots.
    const pixelDiff = pixelmatch(png0.data, png1.data, diff.data, width, height, opts)
    const pixelDiffPercentage = (width * height) / pixelDiff

    return {
      diff,
      pixelDiffPercentage
    }
  }
  /**
   *
   * Record screenshots to a buffer object.
   *
   * @fires record indicates the screenshot buffer was updated
   *
   * @returns {EventEmitter}
   */
  record () {
    this.start()
    this.on('screenshot', screenshot => {
      this.buffers.unprocessed.push(screenshot)
      this.emit('record', this.buffers.unprocessed)
    })
    return this
  }
  recordDiff () {
    this.start()
    this.on('screenshot-pair', async ({time, previous, current}) => {
      this.buffers.diffed.push(await this.compare(previous, current))
      this.emit('record-diff', this.buffers.diffed)
    })
    return this
  }
}

async function run () {
  const chrome = await puppeteer.launch({headless: true})
  const page = await chrome.newPage()
  await page.goto('https://media.giphy.com/media/14kqI3Y4urS3rG/giphy.gif')

  const screen = new browser.ScreenCapture({page, interval: 100, duration: 10000})
  screen.recordDiff()

  screen.on('record-diff', buffers => {

  })
  screen.on('error', err => {
    console.error(err)
  })
  screen.on('close', () => {
    screen.renderDiff()
  })
}
run().catch(err => {
  console.error(err)
})