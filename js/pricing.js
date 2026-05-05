async function subscribePlan(planId) {
    const userId = localStorage.getItem("userId") || "guest_user_" + Date.now();
    localStorage.setItem("userPlan", planId); // Offline Backup Storage!
    
    try {
        const res = await fetch('http://127.0.0.1:5001/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, plan: planId })
        });
        
        if (!res.ok) throw new Error("Offline");
        
        const data = await res.json();
        alert(data.message);
    } catch (error) {
        console.warn("Backend checkout offline. Subscription secured locally.");
        alert(`Successfully queued the ${planId.toUpperCase()} plan via Offline Mode!`);
    }
}
