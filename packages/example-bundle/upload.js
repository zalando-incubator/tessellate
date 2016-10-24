const fs = require('fs')
const path = require('path')
const glob = require('glob')
const AWS = require('aws-sdk')
const nconf = require('nconf')
  .argv()
  .env()
  .file(path.resolve(__dirname, 'config.json'))

const s3 = new AWS.S3({
  region: nconf.get('S3_REGION')
})

glob(path.resolve(__dirname, nconf.get('SOURCE_DIR'), '*.+(js|css)'), (error, files) => {
  if (error) return console.error(error)

  console.log(`Uploading ${files.length} file(s)...`)

  const promises = files.map(file => {
    console.log(`Uploading ${file}`)

    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: nconf.get('S3_BUCKET'),
        Key: path.join(nconf.get('S3_PREFIX'), path.basename(file)),
        Body: fs.createReadStream(file),
        ContentType: 'text/plain'
      }, (error, response) => {
        if (error) {
          console.error(error)
          reject(error)
        }
        else resolve(response)
      })
    })
  })

  Promise.all(promises)
    .then(responses => {
      console.log(`Uploaded ${responses.length} file(s).`)
    })
    .catch(error => {
      console.error('Failed to upload file(s).')
    })
})
