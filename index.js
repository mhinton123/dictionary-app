fetch('https://api.dictionaryapi.dev/api/v2/entries/en/pike')
  .then(response => response.json()) // assuming the response is JSON
  .then(data => {

    // all Data
    console.log(data);

    // word-title
    console.log(data[0].word);
    
    // audio-que
    try {
        console.log(data[0].phonetic);
    }
    catch {
        console.log('Audio Que Not Found')
    }
    
    // audio file (map array until .audio === truthy)
    // Audio File
    try {
        const audioArr = data[0].phonetics
        const audioFileLink = audioArr.find(audioObj => audioObj.audio !== '')
    
        console.log(audioFileLink.audio)
    }
    catch {
        console.log('Audio Not Found')
    }

    // noun-meanings-list (loop over arr and target .definition) (cap to 3)
    try {
        console.log(data[0].meanings[0].definitions.slice(0, 3))
    }
    catch {
        console.log('Nouns Not Found')
    }
    
    // synonyms-list (loop over arr) (cap to 3)
    try {
        console.log(data[0].meanings[0].synonymsslice(0, 3))
    }
    catch {
        console.log('Synonyms Not Found')
    }
    
    // verb-meanings-list (loop over arr and target .definition & .example) (cap to 3)
    try {
        console.log(data[0].meanings[1].definitions.slice(0, 3))
    }
    catch {
        console.log('Verbs Not Found')
    }
    
    //source-link
    try {
        console.log(data[0].sourceUrls)
    }
    catch {
        console.log('Source Not Found')
    }



    

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });