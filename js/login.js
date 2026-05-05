document.addEventListener("DOMContentLoaded", () => {
    console.log("[LOGIN] Page loaded");

    const form = document.getElementById("loginFormBlock");
    const feedback = document.getElementById("loginFeedback");

    if (!form) {
        console.error("[LOGIN] Form element 'loginFormBlock' not found!");
        return;
    }

    // If user already has a profile, skip straight to dashboard
    const existingProfile = localStorage.getItem("userProfile");
    if (existingProfile) {
        console.log("[LOGIN] Profile already exists, redirecting to dashboard");
        window.location.href = "dashboard.html";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const email = emailInput.value.trim().toLowerCase();

        if (!email) {
            feedback.innerText = "Please enter a valid email address.";
            feedback.style.color = "orange";
            return;
        }

        console.log("[LOGIN] Email entered:", email);

        // Store email in localStorage immediately
        localStorage.setItem("userEmail", email);
        console.log("[LOGIN] Email saved to localStorage");

        feedback.innerText = "Verifying... ⏳";
        feedback.style.color = "#333";

        // Try backend first, fall back to localStorage-only flow
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("[LOGIN] Backend auth successful");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({
                    name: data.name,
                    email: data.email,
                    _id: data._id
                }));

                feedback.innerText = "Authenticated! Redirecting... ✅";
                feedback.style.color = "green";

                // Check if profile exists → dashboard, else → onboarding
                const profile = localStorage.getItem("userProfile");
                setTimeout(() => {
                    window.location.href = profile ? "dashboard.html" : "onboarding.html";
                }, 600);
                return;
            } else {
                console.log("[LOGIN] Backend says user not found, routing to onboarding");
            }
        } catch (err) {
            console.warn("[LOGIN] Backend unreachable, using localStorage flow:", err.message);
        }

        // Fallback: No backend or user not registered yet → go to onboarding
        feedback.innerText = "Welcome! Setting up your profile... ✅";
        feedback.style.color = "green";

        setTimeout(() => {
            window.location.href = "onboarding.html";
        }, 600);
    });
});
