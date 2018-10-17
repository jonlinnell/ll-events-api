const fs = require('fs')
const path = require('path')

const contentMetadataLocation = `${__dirname}/../content/content.json`

const get3x3content = () => new Promise((resolve, reject) => {
  if (fs.existsSync(contentMetadataLocation)) {
    if (fs.statSync(contentMetadataLocation).isFile()) {
      fs.readFile(path.resolve(contentMetadataLocation), (error, data) => {
        if (error) reject(error)

        const { content, contentType } = JSON.parse(data)
        const contentLocation = path.resolve(`${__dirname}/../content/${content}`)
        console.log(content, contentType)

        if (contentType === 'image') {
          if (fs.statSync(contentLocation).isFile()) {
            fs.readFile(contentLocation, (contentReadError, contentData) => {
              if (error) reject(contentReadError)

              resolve({
                contentType,
                content: contentData.toString('base64'),
              })
            })
          }
        } else {
          resolve({
            contentType: null,
          })
        }
      })
    }
  } else {
    resolve({
      contentType: null,
    })
  }
})

module.exports = get3x3content
