const textName = document.getElementById("name")
const textSay = document.getElementById("say")
const nextButton = document.getElementById("nextButton") 
const backButton = document.getElementById("backButton") 
const container = document.getElementById("characters")
const substrateObj = document.getElementById("substrate")
const choices = document.getElementById("choices")
const fades = document.getElementById("fades")
const body = document.body
const dialogues = await fetch("./dialogues.json")
const storyData = await dialogues.json()
let currentLine = storyData.chapter_1_scene_1[0]
let step = 0
let permit = true
let option = 0
let option_value = 0
let fadeToggle = false
let fadeFrame = 1

//love points
const love_points = {
    none: 0,
    sb: 0
}
let love_points_history = {0: {...love_points}}
//love points

function newFrame(n){
        if (permit == true && pauseToggle == false){
            step += n
            if (step < 0){
                step = 0
            }

        if(n<0 && love_points_history[step]){
            love_points.none = love_points_history[step].none
            love_points.sb = love_points_history[step].sb
        }

        currentLine = storyData.chapter_1_scene_1[step]
        if (currentLine.background != "none"){
            body.style.backgroundImage = body.style.backgroundImage = currentLine.background
        }
        if(currentLine.type == "диалог" || currentLine.type == "fade-out"){
            if(currentLine.name !="none"){
                textName.textContent = currentLine.name
            }
            if(currentLine.name_color != "none"){
                textName.style.color = currentLine.name_color
            }
            if(currentLine.say != "none"){
                textSay.textContent = currentLine.say
            }
        }
        else if(currentLine.type == "выбор"){
            if(!love_points_history[step]){
                love_points_history[step] = {...love_points}
            }
            permit = false
            permitHTML = false
            choices.innerHTML = ""
            for (let n=1; n<=currentLine.numberOfOptions; n++){
                let buttonNum = `option_${n}`
                const choiceButton = document.createElement("button")
                choiceButton.id = `${n}`
                choiceButton.classList.add("choiceButton");
                choiceButton.addEventListener("click", choiceButtonFunc); 
                choiceButton.textContent = currentLine[buttonNum]
                choices.style.visibility = "visible"
                choices.appendChild(choiceButton)
                substrateObj.classList.add("fade-out")
                choices.classList.add("fade-in")
                substrateObj.classList.remove("fade-in")
                choices.classList.remove("fade-out")
            }
        }
        else if(currentLine.type == "fade-in"){
            fade_in()
        }
        if(currentLine.type == "fade-out"){
            fade_out()
        }
    }
}

function fade_in(){
    fadeToggle = true
    fades.innerHTML = ""
    const fade = document.createElement("div")
    fade.id = "fadeChild"
    fade.classList.add("fade-in-child")
    fade.classList.remove("fade-out-child")
    fade.addEventListener("animationend",() => {
        if(fadeToggle == true){
        newFrame(fadeFrame)
        stepSprite()
        fade_out()
        }
    })
    fades.appendChild(fade)
}

function fade_out(){
    fadeToggle = false
    const fade = document.getElementById("fadeChild")
    fade.classList.add("fade-out-child")
    fade.classList.remove("fade-in-child")
}

function stepSprite(){
    if (pauseToggle == false)
        if(permit == true && pauseToggle == false){
            container.innerHTML = ""
            if (currentLine.sprite != "none"){
                const sprite = document.createElement("img")
                container.appendChild(sprite)
                sprite.src = currentLine.sprite
                sprite.alt = "sprite"
                sprite.style.width = `${currentLine.spriteSize*0.325}vh`
                sprite.style.position = "fixed"
                sprite.style.left = `${currentLine.spriteX}%`
                sprite.style.bottom = `${currentLine.spriteY}%`
                sprite.style.transform = "translateX(-50%)"
                sprite.style.filter= `brightness(${currentLine.spriteBrightness/100})`
        }
    }
}

function choiceButtonFunc(event){
    option = `option_${event.currentTarget.id}_result`
    option_value = `option_${event.currentTarget.id}_result_value`
    substrateObj.classList.add("fade-in")
    choices.classList.add("fade-out")
    permit = true
    permitHTML = true
    love_points[currentLine[option]] += Number([currentLine[option_value]])
    newFrame(1)
    stepSprite()
}

body.style.backgroundImage = currentLine.background
textName.textContent = currentLine.name
textName.style.color = currentLine.name_color
textSay.textContent = currentLine.say
stepSprite()

    nextButton.addEventListener("click", async()=>{
        fadeFrame = 1
        newFrame(1)
        stepSprite()
    })

    backButton.addEventListener("click", async()=>{
        fadeFrame = -1
        newFrame(-1)
        stepSprite()
    })
    
    window.addEventListener("keydown", function(event){
        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'ArrowRight') {
        event.preventDefault();
        fadeFrame = 1
        newFrame(1)
        stepSprite()
        }
        else if(event.code === 'ArrowLeft'){
            if(permit == false && pauseToggle == false){
                permit = true
                permitHTML = true
                substrateObj.classList.add("fade-in")
                choices.classList.add("fade-out")
            }
            if(fadeToggle == true){
                fade_out()
            }
            fadeFrame = -1
            newFrame(-1)
            stepSprite()
        }
    })
