const axios = require('axios')

const fetchHeadlines = () => new Promise((resolve, reject) => {
  axios.get('https://newsapi.org/v2/top-headlines', {
    params: {
      country: 'gb',
      apiKey: process.env.NEWSAPI_KEY,
    },
  })
    .then(response => resolve(response.data.articles))
    .catch(error => reject(error))
})

module.exports = fetchHeadlines
