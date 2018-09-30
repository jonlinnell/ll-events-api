const axios = require('axios')

const testData = require('../testData/headlines.json')

const fetchHeadlines = () => new Promise((resolve, reject) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'gb',
        apiKey: process.env.NEWSAPI_KEY,
      },
    })
      .then(response => resolve(response.data.articles))
      .catch(error => reject(error))
  }
})

module.exports = fetchHeadlines
