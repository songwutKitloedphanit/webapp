"use strict";

const input = document.getElementById("word");
const list = document.getElementById("word-list");

function renderWords() {
    list.replaceChildren();
    for (const word of loadWords()) {
        const item = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = word;
        const remove = document.createElement("button");
        remove.className = "delete-word";
        remove.setAttribute("aria-label", "ลบ " + word);
        remove.title = "ลบ " + word;
        remove.addEventListener("click", () => {
            try {
                saveWords(loadWords().filter((value) => value !== word));
                renderWords();
                showMessage("ลบ " + word + " แล้ว");
            } catch (error) {
                showMessage(error.message, true);
            }
        });
        item.appendChild(label);
        item.appendChild(remove);
        list.appendChild(item);
    }
}

document.getElementById("word-form").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const word = input.value.trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(word)) throw new Error("กรอกตัวอักษรอังกฤษ 3 ตัวเท่านั้น");
        const words = loadWords();
        if (words.includes(word)) throw new Error("มีคำว่า " + word + " อยู่แล้ว");
        saveWords([...words, word]);
        renderWords();
        input.value = "";
        input.focus();
        showMessage("เพิ่ม " + word + " แล้ว");
    } catch (error) {
        showMessage(error.message, true);
    }
});
try {
    renderWords();
} catch (error) {
    showMessage(error.message, true);
}
