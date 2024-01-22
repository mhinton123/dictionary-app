fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello')
  .then(response => response.json()) // assuming the response is JSON
  .then(data => {
    console.log(data);
    // Handle the data here
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });