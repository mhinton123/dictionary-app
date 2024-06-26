const audioPlayBtn = document.getElementById('audio-play-btn')
const audioPlayer = document.getElementById('audio-player')
const audioContainer = document.getElementById('audio-play-btn-wr')
const errMsgContainer = document.getElementById('err-msg-wr')
const fontSelector = document.getElementById('font-selector')
const mainContainer = document.getElementById('main-container')
const notFoundMsgContainer = document.getElementById('not-found-msg-wr')
const searchBtn = document.getElementById('search-btn')
const searchBar = document.getElementById('searchbar')
const searchBarWrapper = document.getElementById('searchbar-wr')
const themeSwitch = document.getElementById('theme-switch')

let globalData 

// renders word when user clicks search btn
searchBtn.addEventListener('click', function(e){
    
    // check input is not empty
    if(searchBar.value) {
        
        // reset html
        searchBarWrapper.style.border = 'none'
        errMsgContainer.style.display = 'none'
        mainContainer.style.display = 'block'
        
        renderWordHtml()
    }
    else {
        
        // display err msg
        mainContainer.style.display = 'none'
        notFoundMsgContainer.style.display = 'none'
        errMsgContainer.style.display = 'flex'
        searchBarWrapper.style.border = 'solid 1px red'
    }
})


// plays audio when play btn is clicked
audioPlayBtn.addEventListener('click', function(e){
    
    const data = globalData
    
    // loads default page audio
    if(data === undefined) {
        audioPlayer.src = 'https://api.dictionaryapi.dev/media/pronunciations/en/keyboard-us.mp3'
    }
    // updates audio src from api
    else {
        const audioLink = data[0].phonetics.find(audioObj => audioObj.audio !== '')
        audioPlayer.src = audioLink.audio
    }
    
    // play audio when fully loaded
    audioPlayer.addEventListener('canplay', function(){
        audioPlayer.play()
    })
})

// changes font when option is clicked
fontSelector.addEventListener('change', function() {
    
    const selectedFont = fontSelector.value;
    document.body.style.fontFamily = selectedFont;
});

// changes theme when switch toggled
themeSwitch.addEventListener('change', function() {
    
    // Check if the switch is turned on
    if (themeSwitch.checked) {
        
        document.head.innerHTML = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- CSS -->
        <link rel="stylesheet" href="./css/colours.css">
        <link rel="stylesheet" href="./css/fonts.css">
        <link rel="stylesheet" href="./css/styles.css">
        <link rel="stylesheet" href="./css/dark-theme.css">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Inter:wght@400;700&family=Lora:wght@400;700&display=swap" rel="stylesheet">

        <title>Matt's Online Dictionary</title>
        `
        
    } else {
        
        console.log('Switch is OFF');
        document.head.innerHTML = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- CSS -->
        <link rel="stylesheet" href="./css/colours.css">
        <link rel="stylesheet" href="./css/fonts.css">
        <link rel="stylesheet" href="./css/dark-theme.css">
        <link rel="stylesheet" href="./css/styles.css">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Inter:wght@400;700&family=Lora:wght@400;700&display=swap" rel="stylesheet">

        <title>Matt's Online Dictionary</title>
    `
        
    }
})

async function renderWordHtml(){
    
    mainHtml = ''
    const searchInput = searchBar.value
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchInput}`
    
    // api call
    fetch(url)
    .then(response => response.json()) // assuming the response is JSON
    .then(data => {

        globalData = data
        
        // checks if a word array is returned
        if(data.title){
            notFoundMsgContainer.style.display = 'flex'
            mainContainer.style.display = 'none'
        }
        else {
            notFoundMsgContainer.style.display = 'none'
            mainContainer.style.display = 'block'

            renderWordTitle(data[0].word)
            renderAudioQue(data[0].phonetic)
            renderAudioSource(data)
            renderNounMeanings(data)
            renderSynonyms(data)
            renderVerbMeanings(data)
            renderSource(data)    
        }

  })
  .catch(error => {
    console.error('Error fetching data:', error)
  })

}

function renderWordTitle(word) {

    if (word) {
        const wordEl = document.getElementById('word-title')
        wordEl.innerText = word
    }
}

function renderAudioQue(audioQue) {

    const audioQueEl = document.getElementById('audio-que')
    
    if (audioQue) {
        audioQueEl.innerText = audioQue
    }
    else {
        audioQueEl.innerHTML = ''
    }
}

// load audio file ready to play
function renderAudioSource(data) {

    const audioLinksArr = data[0].phonetics.find(audioObj => audioObj.audio !== '')

    if (audioLinksArr === undefined) {
        audioPlayBtn.style.display = 'none'
    }
    else {
        audioPlayBtn.style.display = 'block'
    }

}

function renderNounMeanings(data) {

    const meaningsList = document.getElementById('noun-meanings-list')

    try {
        
        const meaningsArr = data[0].meanings[0].definitions.slice(0, 3).map(noun => noun.definition)
        let html = ''

        meaningsArr.forEach(meaning => {
            html += `<li>${meaning}</li>`
        })

        meaningsList.innerHTML = html
    }
    catch {
        meaningsList.innerHTML = 'No meanings found'
    }
}

function renderSynonyms(data) {

    try {
        const synonyms = data[0].meanings[0].synonyms.slice(0, 3)
        const synonymsListEl = document.getElementById('synonyms-list')
        let html = ''

        synonyms.forEach(syn => {
            html += `<a class="link-text">${syn}</a>`
        })

        synonymsListEl.innerHTML = html

    }
    catch {
        synonymsListEl.innerHTML = '<p>No Synonyms Found.</p>'
    }

}

function renderVerbMeanings(data){

    const verbContainerEl = document.getElementById('verb-meanings-list')
    let html = ''
    
    try {
        const verbMeanings = data[0].meanings[1].definitions.slice(0, 2)

        verbMeanings.forEach(verb=> {

            html += `<li>${verb.definition}</li>`

            if(verb.example) {
                html += `<p class="example-text">"${verb.example}"</p>`
            }
        })

        verbContainerEl.innerHTML = html
    }
    catch {
        verbContainerEl.innerHTML = 'No Verbs Found.'
    }
}

function renderSource(data){

    const sourceEl = document.getElementById('source-link')

    try {
        const sourceLink = data[0].sourceUrls
        sourceEl.innerHTML = `<a href="${sourceLink}" class="source-link body-s" id="source-link">${sourceLink}</a>`
    }
    catch {
        sourceEl.innerHTML = 'No Source Found'
    }
}