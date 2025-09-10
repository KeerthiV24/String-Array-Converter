// Convert Button
document.getElementById("convertBtn").addEventListener("click", async () => {
  const text = document.getElementById("inputText").value;

  const res = await fetch("/api/convert", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({input: text})
  });

  if (!res.ok) {
    const data = await res.json();
    document.getElementById("charBoxes").innerHTML = `<div style="color:red;font-weight:bold">${data.error}</div>`;
    document.getElementById("outputArea").textContent = "";
    return;
  }

  const data = await res.json();

  // Show character boxes
  const charBoxes = document.getElementById("charBoxes");
  charBoxes.innerHTML = "";
  data.chars.forEach(ch => {
    const div = document.createElement("div");
    div.className = "char-box";
    div.textContent = ch === " " ? "␣" : ch; // space shown as ␣
    charBoxes.appendChild(div);
  });

  // Show JSON output
  document.getElementById("outputArea").textContent = JSON.stringify(data.chars, null, 2);
});

// Export Button
document.getElementById("exportBtn").addEventListener("click", async () => {
  const text = document.getElementById("inputText").value;
  const res = await fetch("/api/export", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({input: text})
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chars.json";
  a.click();
  window.URL.revokeObjectURL(url);
});

// Clear Button
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("inputText").value = "";
  document.getElementById("charBoxes").innerHTML = "";
  document.getElementById("outputArea").textContent = "";
});
