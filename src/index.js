// console.log('%c HI', 'color: firebrick')

const imgUrl = "https://dog.ceo/api/breeds/image/random";

const container = document.getElementById("dog-image-container")

const select = document.getElementById("breed-dropdown")

const dogBreeds = document.getElementById("dog-breeds")

const form = document.getElementById("form")

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

const breedUrl = "https://dog.ceo/api/breeds/list/all";


let data;

fetch(breedUrl) 
.then((r) => {
    if(!r.ok) return "ERRR"
    return r.json()
})
.then( data => {
    data = data.message
    makeBreedAndSubList(data)
    makeOptions(data)
    selectEventListener(data)
    searchEventListener(data)
})

function makeBreedAndSubList( breedsObj) {

    const breedsObjWithChildren = Object.keys(breedsObj).map( (key) => ({breed: key, subBreeds: breedsObj[key]}))

    breedsObjWithChildren.map ( obj => {


        const breed = document.createElement("li")


        breed.textContent = obj.breed
        breed.className = "breed"
        
        dogBreeds.appendChild(breed)

        if (obj.subBreeds.length > 0) {
        obj.subBreeds.map (subBreed => {
            const li = document.createElement("li")

            li.className = "sub"

            li.textContent = subBreed

            breed.appendChild(li)
        })  
    }else{
        const li = document.createElement("li")

            li.className = "sub"

            li.textContent = "None"

            breed.appendChild(li)
    }



    }) 
}


function makeOptions (array) {
    const breedsObjWithChildren = Object.keys(array).map( (key) => ({breed: key, subBreeds: array[key]}))

    breedsObjWithChildren.forEach( obj => {
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



        

function filterLogic (arr, value="all") {

    let updatedValues = arr.filter( dog => {
        if (value === "all") return true
        return dog.breed === value      
        
    })


    const newobj = {}

    updatedValues.forEach (dog => {
        newobj[dog.breed] = dog.subBreeds
    })
    dogBreeds.innerHTML = ""                                    //VERY IMPORTANT 
     makeBreedAndSubList(newobj)
}


function searchEventListener (array) {

    const breedsObjWithChildren = Object.keys(array).map( (key) => ({breed: key, subBreeds: array[key]}))
    form.addEventListener("submit", (e) => {

            e.preventDefault()
            searchLogic(breedsObjWithChildren, e.target.search.value)
            e.target.reset()
    })
}

function searchLogic (arr,search) {    
    
    let dog = arr.find( dog => dog.breed === search)
    if (!dog) {
        console.log("Beep Beep, ERRR")
        return 
    } 

    const newObj= {
        [dog.breed]: dog.subBreeds
    }    

    dogBreeds.innerHTML = ""
     makeBreedAndSubList(newObj)

}

