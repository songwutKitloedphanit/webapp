"use strict";

const foodNames = ["เบอร์เกอร์", "พิซซ่า", "ฮอตดอก"];
document.querySelectorAll("[data-vote]").forEach((button) => {
    button.addEventListener("click", () => {
        try {
            const index = Number(button.dataset.vote);
            if (!Number.isInteger(index) || index < 0 || index > 2) {
                throw new Error("ตัวเลือกโหวตไม่ถูกต้อง");
            }
            const votes = loadVotes();
            if (votes[index] === Number.MAX_SAFE_INTEGER) {
                throw new Error("คะแนนถึงค่าสูงสุดแล้ว");
            }
            votes[index]++;
            saveVotes(votes);
            showMessage("โหวต" + foodNames[index] + "แล้ว — " + votes[index] + " คะแนน");
        } catch (error) {
            showMessage(error.message, true);
        }
    });
});
