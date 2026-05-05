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

        // Save to localStorage IMMEDIATELY (this is the source of truth)
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        console.log("[ONBOARDING] Profile saved to localStorage ✅");

        feedback.innerText = "Profile saved! Setting up your dashboard... ⏳";
        feedback.style.color = "#333";

        // Try backend registration (optional, non-blocking)
        try {
            const authRes = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: childName, email })
            });

            const authData = await authRes.json();
            console.log("[ONBOARDING] Backend signup response:", authData);

            if (authRes.ok) {
                localStorage.setItem("token", authData.token);
                localStorage.setItem("user", JSON.stringify({
                    name: authData.name,
                    email: authData.email,
                    _id: authData._id
                }));

                // Try creating child profile on backend
                try {
                    await fetch("http://localhost:5000/api/child", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authData.token}`
                        },
                        body: JSON.stringify({
                            userId: authData._id,
                            name: childName,
                            age: childAge,
                            diet: childDiet,
                            allergies: allergiesArray
                        })
                    });
                    console.log("[ONBOARDING] Child profile sent to backend");
                } catch (childErr) {
                    console.warn("[ONBOARDING] Child profile backend save skipped:", childErr.message);
                }
            }
        } catch (err) {
            console.warn("[ONBOARDING] Backend unreachable, continuing with localStorage:", err.message);
        }

        // Always redirect to dashboard
        feedback.innerText = "Profile created! Redirecting... ✅";
        feedback.style.color = "green";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);
    });
});
