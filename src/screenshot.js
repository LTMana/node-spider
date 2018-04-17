const puppeteer = require('puppeteer')
const srcToImg = require('./helper/srcToimg')
const { mn } = require('./config/default')
const { screenshot } = require('./config/default')
puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  await page.goto('https://image.baidu.com')
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.focus('#kw')
  await page.keyboard.sendCharacter('狗')
  try {
    await page.click('.s_search')
  } catch (error) {
    console.log(error)
  }
  console.log('go to search list')
  page.on('load',async () => {
    console.log('page loading done, start fetch...')
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img')
      return Array.prototype.map.call(images, img => img.src)
    })
    console.log(`get ${srcs.length} images, start download`)
    srcs.forEach(async src => {
      await page.waitFor(200)
      srcToImg(src, mn)
    })
    // await page.screenshot({
    //   path: `${screenshot}/${Date.now()}.png`
    // })
    await browser.close()
  })
})
