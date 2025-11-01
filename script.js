let isSending = false;
let cooldownTimer;

document.getElementById("buffBtn").onclick = sendBuff;

async function sendBuff() {
  const id = document.getElementById("discordId").value.trim();
  const btn = document.getElementById("buffBtn");
  const resultBox = document.getElementById("result");

  if (!id) {
    resultBox.innerHTML = "<span class='error'>Vui lòng nhập ID</span>";
    return;
  }

  if (isSending) return;

  isSending = true;
  btn.disabled = true;
  resultBox.style.opacity = "1";
  resultBox.innerHTML = `<div class='loading'></div> Đang xử lý...`;

  try {
    const res = await fetch(`https://waifucat.pythonanywhere.com/buff?id=${id}`, {
      method: "GET",
      headers: {
        "User-Agent": navigator.userAgent,
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://discord.com/",
        "Origin": "https://discord.com",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Connection": "keep-alive",
      }
    });

    const data = await res.json();

    if (data.error) {
      resultBox.innerHTML = `${data.error}\n`;

      if (data.wait_seconds) {
        let remaining = data.wait_seconds;
        cooldownTimer = setInterval(() => {
          remaining--;
          resultBox.innerHTML = `${data.error}\nChờ: ${remaining}s`;
          if (remaining <= 0) {
            clearInterval(cooldownTimer);
            location.reload();
          }
        }, 1000);
      }

      if (data.invite) resultBox.innerHTML += `\n${data.invite}`;

    } else {
      resultBox.innerHTML =
        `Trạng thái: ${data.Status}\n` +
        `ID: ${data.ID}\n` +
        `Thành công: ${data.Success}\n` +
        `Thất bại: ${data.Failed}\n` +
        `Tổng: ${data.Total}`;
    }

  } catch {
    resultBox.innerHTML = "<span class='error'>Lỗi kết nối API</span>";
  }

  setTimeout(() => { resultBox.style.opacity = "0.9"; }, 800);

  setTimeout(() => {
    btn.disabled = false;
    isSending = false;
  }, 2000);
}
