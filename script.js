const { count } = require('console');
const fs = require('fs');
const fileName = process.argv[2];

// Animal Class
function Animal(name, bDate, species){
    this.name = name;
    this.bDate = bDate;
    this.species = species;
    // this.speciesFinder();
}

Animal.prototype.speak = function(){
    console.log(this.species);
}
Animal.prototype.findAge = function(){
    let bdateYear = new Date(this.bDate).getFullYear();
    let todayYear = new Date().getFullYear();
    return todayYear - bdateYear;
}

// Dog Class
function Dog(name, bDate, species){
    Animal.call(this, name, bDate, species);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.speak = function(){
    return 'Woof'
}


// Cat Class
function Cat(name, bDate, species){
    Animal.call(this, name, bDate, species);
}
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.speak = function(){
    return 'Moew'
}

// Bird Class
function Bird(name, bDate, species){
    Animal.call(this, name, bDate, species);
}
Bird.prototype = Object.create(Animal.prototype);
Bird.prototype.speak = function(){
    return 'Tweet'
}

let allAnimalInfoString = [];
fs.readFile(fileName, 'utf8', (err, data)=>{
    // all of this to split the data at newline char, then at ',' 
    // then to get rid of the extra quotes and to get rid of any trailing spaces
    if(err) return console.log(err);
    allAnimalInfoString = data.split("\n");
    let actualInfo = [];
    let trimmedActualInfo = [];
    allAnimalInfoString.forEach((animal, animalIndex)=>{
        let trimmedArray = [];
        actualInfo = animal.split(",")
        actualInfo.forEach((word)=>{
            
            let newWord = ""
            for(let charIndex = 0; charIndex < word.length; charIndex++){
                let char = word[charIndex]
                // console.log(char);
                char !== "\'" && char !== "\"" && char !== " " ? newWord += char : '';
            }
            trimmedArray.push(newWord);
        })
        allAnimalInfoString[animalIndex] = trimmedArray;
    })

    // Now that we got the trimming done, we will need to actually create the new animal objects
    animalArray = [];
    allAnimalInfoString.forEach((animalInfo, animalIndex)=>{
        if(animalIndex !== 0 && animalInfo[0] !== '' && animalInfo[2] !== ' '){
            if(animalInfo[2] === 'dog'){
                animalArray.push(new Dog(animalInfo[0], animalInfo[1], animalInfo[2]));
            }else if(animalInfo[2] === 'cat'){
                animalArray.push(new Cat(animalInfo[0], animalInfo[1], animalInfo[2]));
            }else if(animalInfo[2] === 'bird'){
                animalArray.push(new Bird(animalInfo[0], animalInfo[1], animalInfo[2]));
            }
        }
    })
    // console.log(animalArray[0]);
    // animalArray[0].speak();
    // console.log(animalArray[0].findAge());
    
    // Finding the oldest Animal
    let oldestAnimal = 0;
    let actualAnimal;
    animalArray.forEach(animal=>{
        let animalAge = animal.findAge();
        if(animalAge >= oldestAnimal){
            oldestAnimal = animalAge;
            actualAnimal = animal;
        }
    })
    // console.log(`${actualAnimal.name} the ${actualAnimal.findAge()} year old ${actualAnimal.species} says "${actualAnimal.speak()}!"`)

    // Most frequently occurred group of animals by species
    let countObject = {};
    let highestFreq = {'spec':'', 'freq': 0};
    animalArray.forEach(animal=>{
        if(countObject[animal.species]){
            countObject[animal.species] += 1;
            if(countObject[animal.species] > highestFreq.freq){
                highestFreq.spec = animal.species
                highestFreq.freq = countObject[animal.species]
            }
        }else{
            countObject[animal.species] = 1;
        }
    })
    console.log(countObject);
    console.log(highestFreq);
})

