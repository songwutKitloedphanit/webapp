/* ข้อ1 */
const changeButton  = document.querySelector("#changeButton");
const buttonStatus  = document.querySelector("#buttonStatus");
let isRed = false

changeButton.addEventListener("click", () => {
    isRed = !isRed

    if (isRed) {
        changeButton.style.backgroundColor = "#F52727"
        changeButton.textContent = "เปลี่ยนเป็นสีน้ำเงิน"
        buttonStatus.textContent = "ตอนนี้เป็นสีแดง"
    } else {
        changeButton.style.backgroundColor = "#2563EB"
        changeButton.textContent = "เปลี่ยนเป็นสีแดง"
        buttonStatus.textContent = "ตอนนี้เป็นสีน้ำเงิน"
    }
})

/* ข้อ2 */
const displayForm = document.querySelector("#displayForm");
const displayTextInput = document.querySelector("#displayTextInput");
const displayColorInput = document.querySelector("#displayColorInput");
const displayResult = document.querySelector("#displayResult");

displayForm.addEventListener("submit",(event) =>{
    event.preventDefault();
    displayResult.textContent = displayTextInput.value;
    displayResult.style.backgroundColor = displayColorInput.value;
})

/* ข้อ3 */
const decreaseButton = document.querySelector("#decreaseButton")
const counterValue = document.querySelector("#counterValue")
const increaseButton = document.querySelector("#increaseButton")

let count = 0;

decreaseButton.addEventListener("click",() => {
    count = count - 1;
    counterValue.textContent = count;
})

increaseButton.addEventListener("click",() =>{
    count = count + 1;
    counterValue.textContent = count;
})

/* ข้อ4 และข้อ5 */
const messageForm = document.querySelector("#messageForm")
const newMessageInput = document.querySelector("#newMessageInput")
const messageStatus = document.querySelector("#messageStatus")
const messageList = document.querySelector("#messageList")

const previousButton = document.querySelector("#previousButton")
const nextButton = document.querySelector("#nextButton")        
const messagePosition = document.querySelector("#messagePosition")
const currentMessage = document.querySelector("#currentMessage")
let currentIndex = 0                                          

const messages = []
function renderMessage() {
    messageList.textContent = ""

    if (messages.length === 0){
        currentMessage.textContent = "ยังไม่มีข้อความ"
        messagePosition.textContent = "0 / 0"
        previousButton.disabled = true
        nextButton.disabled = true
        return
    }

    messages.forEach((message) => {
        const listItem = document.createElement("li")
            listItem.textContent = message
            messageList.append(listItem)
    })

    currentMessage.textContent = messages[currentIndex]
    messagePosition.textContent = `${currentIndex+1} / ${messages.length}`
    previousButton.disabled = false
    nextButton.disabled = false
}
messageForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const text = newMessageInput.value.trim()
    if(text === ""){
        messageStatus.textContent = "กรุณาใส่ข้อความก่อน"
        return
    }
    messages.push(text)
    currentIndex = messages.length-1
    newMessageInput.value =""
    messageStatus.textContent = `เพิ่มข้อความแล้ว ${messages.length} รายการ`
    
    renderMessage()
})

nextButton.addEventListener("click", () =>{
    currentIndex = (currentIndex+1)%messages.length
    renderMessage()
})

previousButton.addEventListener("click", () =>{
    currentIndex = (currentIndex-1+messages.length)%messages.length
    renderMessage()
})
renderMessage()

/* ข้อ6 */
const myObj = {
    name: "john",
    age: 30,
    cars: [
        {
            name:"Ford",
            models:["Fiesta", "Focus", "Mustang"]
        },
        {
            name:"BMW",
            models:["320", "X3", "X5"]
        },
        {
            name:"Fiat",
            models:["500", "Panda"]
        }
    ]
};
const carSelect = document.querySelector("#carSelect")
const objectResult = document.querySelector("#objectResult")

function renderobject(){
    const selectedCar = myObj.cars.find((car) => {
        return car.name === carSelect.value;
    });
    objectResult.textContent = `ชื่อ: ${myObj.name}\n` + `อายุ: ${myObj.age}\n` + `รถ: ${selectedCar.name}\n` + `รุ่น: ${selectedCar.models.join(", ")}`;
}

carSelect.addEventListener("change", renderobject);
renderobject();