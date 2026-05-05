document.addEventListener("DOMContentLoaded", () => {
    console.log("[ONBOARDING] Page loaded");

    const form = document.getElementById("childProfileForm");
    const feedback = document.getElementById("feedbackMessage");

    if (!form) {
        console.error("[ONBOARDING] Form 'childProfileForm' not found!");
        return;
    }

    // Pre-fill email from login page if available
    const savedEmail = localStorage.getItem("userEmail");
    const emailInput = document.getElementById("parentEmail");
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        console.log("[ONBOARDING] Pre-filled email:", savedEmail);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("[ONBOARDING] Profile form submitted");

        const email = document.getElementById("parentEmail").value.trim().toLowerCase();
        const childName = document.getElementById("childName").value.trim();
        const childAge = Number(document.getElementById("childAge").value);
        const childDiet = document.getElementById("childDiet").value;
        const rawAllergies = document.getElementById("childAllergies").value;
        const allergiesArray = rawAllergies ? rawAllergies.split(",").map(a => a.trim()).filter(Boolean) : [];

        // Validate
        if (!email || !childName || !childAge) {
            feedback.innerText = "Please fill all required fields.";
            feedback.style.color = "orange";
            return;
        }

        // Build profile object
        const userProfile = {
            email,
            name: childName,
            age: childAge,
            diet: childDiet,
            allergies: allergiesArray
        };

        console.log("[ONBOARDING] Profile data:", userProfile);

        feedback.innerText = "Saving your profile... ⏳";
        feedback.style.color = "#333";

        // --- NEW SECURE FLOW ---
        try {
            // 1. Attempt Signup (or Update if already logged in)
            const token = localStorage.getItem("token");
            const signupRes = await fetch("http://127.0.0.1:5001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: childName, email: email })
            });

            const signupData = await signupRes.json();

            if (signupRes.ok || signupRes.status === 400) {
                // If 400 and message contains 'registered', it might be okay if we are just completing profile
                if (signupRes.status === 400 && !signupData.message.includes("registered")) {
                    throw new Error(signupData.message || "Signup failed");
                }

                // If we got a new token/user, save it
                if (signupData.token) {
                    localStorage.setItem("token", signupData.token);
                    localStorage.setItem("userRole", signupData.role || "user");
                    localStorage.setItem("user", JSON.stringify({
                        name: signupData.name,
                        email: signupData.email,
                        _id: signupData._id
                    }));
                }

                // 2. Save Child Profile to Backend
                const activeToken = localStorage.getItem("token") || token;
                const userId = signupData._id || (JSON.parse(localStorage.getItem("user")) || {})._id;

                if (activeToken && userId) {
                    await fetch("http://127.0.0.1:5001/api/child", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${activeToken}`
                        },
                        body: JSON.stringify({
                            userId: userId,
                            name: childName,
                            age: childAge,
                            diet: childDiet,
                            allergies: allergiesArray
                        })
                    });
                }

                // SUCCESS: Save locally and redirect
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userProfile", JSON.stringify(userProfile));
                
                feedback.innerText = "Profile created! Welcome to the family. ✅";
                feedback.style.color = "green";
                setTimeout(() => window.location.href = "dashboard.html", 1000);

            } else {
                feedback.innerText = signupData.message || "Something went wrong. Please try again.";
                feedback.style.color = "#ef4444";
            }
        } catch (err) {
            console.warn("[ONBOARDING] Backend error, using local fallback:", err.message);
            // Fallback for offline/demo: Save locally anyway so they can see the UI
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userProfile", JSON.stringify(userProfile));
            feedback.innerText = "Profile saved locally (Offline Mode). Redirecting... ✅";
            feedback.style.color = "orange";
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        }
    });
});
