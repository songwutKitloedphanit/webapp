"use strict";

function renderVotes() {
    try {
        const votes = loadVotes();
        votes.forEach((value, index) => {
            document.getElementById("score-" + index).textContent = value;
        });
        document.getElementById("total").textContent =
            "รวม " + votes.reduce((sum, value) => sum + value, 0) + " คะแนน";
        showMessage("");
    } catch (error) {
        document.querySelectorAll(".score").forEach((element) => (element.textContent = "—"));
        document.getElementById("total").textContent = "";
        showMessage(error.message + " สามารถกดล้างคะแนนเพื่อเริ่มใหม่", true);
    }
}

document.getElementById("clear").addEventListener("click", () => {
    try {
        saveVotes([0, 0, 0]);
        renderVotes();
        showMessage("ล้างคะแนนทั้งหมดแล้ว");
    } catch (error) {
        showMessage(error.message, true);
    }
});

window.addEventListener("pageshow", renderVotes);

window.addEventListener("storage", renderVotes);
renderVotes();
