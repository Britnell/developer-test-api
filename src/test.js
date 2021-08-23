const axios = require('axios')

let tests = [
        {
            surname: 'Barrett',
            address: '2 Newhouse Lane',
            postcode: 'NH1 7EQ',
        },
        {
            surname: "Elliott",
            address: "76 Goodhouse Road",
            postcode: "BL1 8QT"
        },
        {
            surname: 'Rogers',
            address: 'Flat 1 7 Ascot Park Street',
            postcode: 'L9 7AR',
        }
    ]
axios
  .post('http://localhost:8080/credit-search', tests[2] )
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
  })
  .catch(error => {
    console.error(` FETCH ERROR ` )
  })