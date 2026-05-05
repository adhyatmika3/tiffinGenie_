document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("contactFormBlock");
    var feedback = document.getElementById("contactFeedback");
    var subjInput = document.getElementById("cSubj");
    
    // 1. Smart Prefill
    var profileRaw = localStorage.getItem("userProfile");
    if (profileRaw) {
        var profile = JSON.parse(profileRaw);
        if (profile.name) document.getElementById("cName").value = profile.name;
        if (profile.email) document.getElementById("cEmail").value = profile.email;
    }

    // 2. Quick Help Logic
    window.setSubject = function(text) {
        if (subjInput) {
            subjInput.value = text;
            subjInput.focus();
            // Subtle highlight effect
            subjInput.style.borderColor = "#ff7aa2";
            setTimeout(function() {
                subjInput.style.borderColor = "#ddd";
            }, 1000);
        }
    };

    // 3. Form Submission
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            
            var newFeedback = {
                id: Date.now(),
                name: document.getElementById("cName").value,
                email: document.getElementById("cEmail").value,
                subject: document.getElementById("cSubj").value || "General Inquiry",
                message: document.getElementById("cMsg").value,
                date: new Date().toLocaleString(),
                status: "Pending"
            };

            // Save to "Site Feedback" Database
            var feedbacks = JSON.parse(localStorage.getItem("siteFeedbacks") || "[]");
            feedbacks.unshift(newFeedback); // Newest first
            localStorage.setItem("siteFeedbacks", JSON.stringify(feedbacks));
            
            // Mock submission feedback
            feedback.innerText = "Thanks! We’ll get back to you shortly. ✅";
            feedback.style.color = "#10b981";
            
            // Clear inputs except prefilled ones
            document.getElementById("cSubj").value = "";
            document.getElementById("cMsg").value = "";
            
            console.log("[CONTACT] Feedback saved to Admin Inbox:", newFeedback);

            // Reset feedback after 5 seconds
            setTimeout(function() {
                feedback.innerText = "";
            }, 5000);
        };
    }
});
