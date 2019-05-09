const axios = require('axios')

const testData = require('./offlineData/headlines.json')

const sources = [
  'bbc-news',
  'the-telegraph',
  'independent',
  'the-guardian-uk',
  'the-new-york-times',
  'the-washington-post',
]

const fetchHeadlines = () => new Promise((resolve, reject) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        sources: sources.join(','),
        apiKey: process.env.NEWSAPI_KEY,
      },
    })
      .then(response => resolve(response.data.articles))
      .catch(error => reject(error))
  }
})

module.exports = fetchHeadlines
