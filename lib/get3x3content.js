const fs = require('fs')
const path = require('path')

const contentMetadataLocation = `${__dirname}/../content/content.json`

const errorContent = {
  contentType: null,
}

const get3x3content = () => new Promise((resolve) => {
  fs.readFile(path.resolve(contentMetadataLocation), (metadataReadError, data) => {
    if (metadataReadError) {
      resolve(errorContent)
    } else {
      const { content, contentType } = JSON.parse(data)

      if (contentType === 'image') {
        const contentLocation = path.resolve(`${__dirname}/../content/${content}`)

        if (fs.existsSync(contentLocation)) {
          fs.readFile(contentLocation, (contentReadError, contentData) => {
            if (contentReadError) resolve(errorContent)

            resolve({
              contentType,
              content: contentData.toString('base64'),
            })
          })
        } else {
          resolve(errorContent)
        }
      } else if (contentType === 'youtube') {
        resolve({
          contentType,
          content,
        })
      } else {
        resolve(errorContent)
      }
    }
  })
})

module.exports = get3x3content
