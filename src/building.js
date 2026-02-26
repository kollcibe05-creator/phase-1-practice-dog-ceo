// console.log('%c HI', 'color: firebrick')

const imgUrl = "https://dog.ceo/api/breeds/image/random";
const breedUrl = "https://dog.ceo/api/breeds/list/all";


const container = document.getElementById("dog-image-container")
const select = document.getElementById("breed-dropdown")
const dogBreeds = document.getElementById("dog-breeds")
const form = document.getElementById("form")
const searchInput = form.querySelector('input[id="search"]')
console.log(searchInput)

fetch (imgUrl)
.then ( (r) => {
    if (!r.ok) {return "ERR"}
    return r.json()
})
.then( data  => makeImage( data.message))
.catch ( (err) => console.log(err))



function makeImage (url) {
    const image = document.createElement("img")
    image.src = url

    container.append(image)
    
}



let allBreeds = []
let currentFilter = "all"
let currentSearch = ""

fetch(breedUrl) 
.then((r) => {
    if(!r.ok) return "ERRR"
    return r.json()
})
.then( data => {
    allBreeds = Object.keys (data.message).map(key => ({
        breed: key, 
        subBreeds: data.message[key]
    }))
    renderList(allBreeds)
    makeOptions(allBreeds)
    initListeners()
})

function renderList( breedsArr) {

    dogBreeds.innerHTML = ""

    breedsArr.forEach ( obj => {


        const breed = document.createElement("li")
        breed.textContent = obj.breed
        breed.className = "breed"        
        
        const subLi = obj.subBreeds.length > 0 ? obj.subBreeds: ["None"]
        
        subLi.map (subBreed => {
            const li = document.createElement("li")
            li.className = "sub"
            li.textContent = subBreed
            breed.appendChild(li)
        })  
        
        dogBreeds.appendChild(breed)

    }) 
}


function makeOptions (breedsArr) {
   
    breedsArr.forEach( obj => {
        const option = document.createElement("option")        
        option.textContent = obj.breed
        option.value = obj.breed
        select.appendChild(option)
    }) 
    
}




function selectEventListener (array) {

    const breedsObjWithChildren = Object.keys(array).map( (key) => ({breed: key, subBreeds: array[key]}))

    select.addEventListener("change", (e) => {
        filterLogic(breedsObjWithChildren, e.target.value)    

})
}


function applyFilters () {
    const filtered = allBreeds.filter (dog => {
        const matchesSelected = currentFilter === "all" || dog.breed === currentFilter
        const matchesSearch = dog.breed.toLowerCase().includes(currentSearch.toLowerCase())
        return matchesSearch && matchesSelected
    })

    renderList(filtered)
}


function initListeners () {
    select.addEventListener("change", (e) => {
        currentFilter = e.target.value
        applyFilters()
    })
    searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value
        applyFilters()
    })
    form.addEventListener("submit", (e) => e.preventDefault())
}



        