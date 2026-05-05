document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactFormBlock");
    const feedbackBox = document.getElementById("contactFeedback");

    console.log("[CONTACT] Support System v3.0 (Master Lane Active - Port 5001)");

    window.setSubject = function(topic) {
        const input = document.getElementById("cSubj");
        if (input) {
            input.value = topic;
            input.style.borderColor = "#ff7aa2";
            input.style.background = "#fff5f8";
            input.focus();
        }
    };

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "⏳ Connecting...";

            const payload = {
                parentName: document.getElementById("cName").value,
                parentEmail: document.getElementById("cEmail").value,
                topic: document.getElementById("cSubj").value || "General Inquiry",
                message: document.getElementById("cMsg").value
            };

            try {
                // TRYING DIRECT IP ON PORT 5001
                const res = await fetch("http://127.0.0.1:5001/api/support/ticket", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (res.ok) {
                    feedbackBox.innerHTML = `
                        <div style="padding:20px; background:#dcfce7; color:#166534; border-radius:12px; text-align:center; border:1.5px solid #86efac;">
                            <h4 style="margin-bottom:5px;">✅ Message Sent!</h4>
                            <p style="font-size:13px;">Ticket ID: <strong>#TG-${data._id.slice(-5).toUpperCase()}</strong></p>
                        </div>
                    `;
                    contactForm.reset();
                } else {
                    feedbackBox.innerHTML = `<div style="padding:15px; background:#fee2e2; color:#991b1b; border-radius:10px; font-size:13px;">❌ Error: ${data.message}</div>`;
                }
            } catch (err) {
                console.error("Connection Error:", err);
                feedbackBox.innerHTML = `<div style="padding:15px; background:#fef3c7; color:#92400e; border-radius:10px; font-size:13px;">⚠️ Port 5001 Connection Failed. Ensure Backend is running.</div>`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
            }
        });
    }
});
