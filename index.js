const searchBtn = document.getElementById('search-btn')
const searchBar = document.getElementById('searchbar')
const mainContainer = document.getElementById('main-container')
const searchBarWrapper = document.getElementById('searchbar-wr')
const audioPlayBtn = document.getElementById('audio-play-btn')
const audioPlayer = document.getElementById('audio-player')
const audioContainer = document.getElementById('audio-play-btn-wr')
let globalData 


// renders page when the user clicks search btn
searchBtn.addEventListener('click', function(e){
    
    // check iput is not empty
    if(searchBar.value) {
        
        // reset searchbar border
        searchBarWrapper.style.border = 'none'
        renderWordHtml()
    }
    else {
        
        // err msg
        mainContainer.innerHTML = `<p class="err-msg">Whoops, can't be empty...</p>`
        searchBarWrapper.style.border = 'solid 1px red'
    }
})


// plays audio when btn is clicked
audioPlayBtn.addEventListener('click', function(e){
    
    getAudioLink(globalData)
    
})

function getAudioLink(data) {

    const audioLink = data[0].phonetics.find(audioObj => audioObj.audio !== '')
    audioPlayer.src = audioLink.audio
    audioPlayer.addEventListener('canplay', function(){
        audioPlayer.play()
    })

}


async function renderWordHtml(){
    
    mainHtml = ''
    const searchInput = searchBar.value
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchInput}`
    
    // api call
    fetch(url)
    .then(response => response.json()) // assuming the response is JSON
    .then(data => {

        globalData = data

        if(typeof(data) !== Array){
            console.log(data)
        }
        else {

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
    console.error('Error fetching data:', error);
  });

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

    // synonyms-list (loop over arr) (cap to 3)
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
    //source-link
    try {
        const sourceLink = data[0].sourceUrls
        sourceEl.innerHTML = `<a href="${sourceLink}" class="source-link body-s" id="source-link">${sourceLink}</a>`
    }
    catch {
        sourceEl.innerHTML = 'No Source Found'
    }
}