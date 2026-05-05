document.addEventListener("DOMContentLoaded", () => {
    
    // Hardcoded simple admin gate
    let isAdmin = sessionStorage.getItem("adminAccess");
    if(!isAdmin) {
        let code = prompt("Enter Owner Access Password:");
        if(code === "admin123") {
            sessionStorage.setItem("adminAccess", "true");
        } else {
            alert("Access Denied");
            window.location.href = "index.html";
            return;
        }
    }

    // --- OFFLINE SYNC HANDLERS ---
    const getLocalMeals = () => {
        const stored = localStorage.getItem("admin_mealsDB");
        return stored ? JSON.parse(stored) : [];
    };

    const saveLocalMeals = (meals) => {
        localStorage.setItem("admin_mealsDB", JSON.stringify(meals));
    };

    const loadMeals = async () => {
        const tbody = document.getElementById("mealsTableBody");
        tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
        
        let meals = [];
        let isOffline = false;
        
        try {
            const res = await fetch("http://localhost:5000/api/meals");
            if (!res.ok) throw new Error("Server Offline");
            meals = await res.json();
            // Cache successfully verified server meals back to local backup
            saveLocalMeals(meals);
        } catch (e) {
            isOffline = true;
            meals = getLocalMeals();
        }
        
        tbody.innerHTML = "";
        
        if (isOffline) {
            const tr = document.createElement("tr");
            tr.innerHTML = "<td colspan='5' style='color:#ff7aa2; font-weight:600; text-align:center; background:#fff0f5;'>⚠️ Running in offline mode (Saving to LocalStorage)</td>";
            tbody.appendChild(tr);
        }

        if (meals.length === 0) {
            tbody.innerHTML += "<tr><td colspan='5'>No meals found in Database.</td></tr>";
            return;
        }
        
        meals.forEach(m => {
            let ingStr = m.ingredients && m.ingredients.length > 0 ? m.ingredients.join(", ") : "None";
            let trueId = m._id || m.localId; // Dynamic id fetch mechanism
            tbody.innerHTML += `
                <tr>
                    <td>${m.name}</td>
                    <td>${m.type}</td>
                    <td style="text-transform:capitalize">${m.diet}</td>
                    <td>${ingStr}</td>
                    <td><button class="delete-btn" onclick="deleteMeal('${trueId}')">Delete</button></td>
                </tr>
            `;
        });
    };
    
    // Add Meal Logic
    const addForm = document.getElementById("addMealForm");
    if(addForm) {
        addForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            const nm = document.getElementById("mName").value;
            const ty = document.getElementById("mType").value;
            const dt = document.getElementById("mDiet").value;
            const igRaw = document.getElementById("mIng").value;
            
            const payload = {
                name: nm,
                type: ty,
                diet: dt,
                ingredients: igRaw ? igRaw.split(",").map(i=>i.trim()) : []
            };
            
            try {
                const res = await fetch("http://localhost:5000/api/meals", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                
                if(!res.ok) throw new Error("Add failed");
                alert("Meal successfully added to Backend MongoDB!");
            } catch (error) {
                // Offline LocalStorage Fallback Injection
                const fallbackCache = getLocalMeals();
                payload.localId = "tmplocal_" + Date.now();
                fallbackCache.push(payload);
                saveLocalMeals(fallbackCache);
            } finally {
                addForm.reset();
                loadMeals();
            }
        });
    }

    // Attach to window so onclick works globally
    window.deleteMeal = async (id) => {
        if(confirm("Are you sure you want to delete this meal?")) {
            try {
                if(id.startsWith("tmplocal_")) throw new Error("Local Unsynced Item");
                const res = await fetch(`http://localhost:5000/api/meals/${id}`, { method: 'DELETE' });
                if(!res.ok) throw new Error("Delete failed.");
            } catch (e) {
                // Offline LocalStorage Purger Fallback
                let fallbackCache = getLocalMeals();
                fallbackCache = fallbackCache.filter(m => (m._id !== id && m.localId !== id));
                saveLocalMeals(fallbackCache);
            } finally {
                loadMeals();
            }
        }
    };

    const loadFeedbacks = () => {
        const tbody = document.getElementById("feedbackTableBody");
        if (!tbody) return;
        
        const feedbacks = JSON.parse(localStorage.getItem("siteFeedbacks") || "[]");
        
        if (feedbacks.length === 0) {
            tbody.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:30px; color:#9ca3af;'>No feedback messages yet.</td></tr>";
            return;
        }
        
        tbody.innerHTML = "";
        feedbacks.forEach(f => {
            tbody.innerHTML += `
                <tr>
                    <td style="font-size:12px; color:#6b7280;">${f.date}</td>
                    <td>
                        <div style="font-weight:600;">${f.name}</div>
                        <div style="font-size:12px; color:#6aa9ff;">${f.email}</div>
                    </td>
                    <td style="font-weight:500;">${f.subject}</td>
                    <td style="font-size:13px; color:#4b5563; max-width:300px; line-height:1.4;">${f.message}</td>
                    <td>
                        <span style="padding:4px 8px; border-radius:12px; background:${f.status==='Replied'?'#d1fae5':'#fef3c7'}; color:${f.status==='Replied'?'#065f46':'#92400e'}; font-size:11px; font-weight:600;">${f.status}</span>
                    </td>
                    <td>
                        <button onclick="replyFeedback(${f.id})" style="background:#6aa9ff; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:11px;">Reply</button>
                    </td>
                </tr>
            `;
        });
    };

    window.replyFeedback = (id) => {
        const feedbacks = JSON.parse(localStorage.getItem("siteFeedbacks") || "[]");
        const fb = feedbacks.find(item => item.id === id);
        if (!fb) return;

        const reply = prompt(`Reply to ${fb.name} (${fb.email}):\n\nUser Message: "${fb.message}"`);
        if (reply && reply.trim() !== "") {
            fb.adminReply = reply;
            fb.status = "Replied";
            fb.replyDate = new Date().toLocaleString();
            localStorage.setItem("siteFeedbacks", JSON.stringify(feedbacks));
            alert("Response sent to User's Dashboard!");
            loadFeedbacks();
        }
    };

    window.clearAllFeedback = () => {
        if (confirm("Are you sure you want to clear all user feedback? This cannot be undone.")) {
            localStorage.removeItem("siteFeedbacks");
            loadFeedbacks();
        }
    };

    // Initial Execute
    loadMeals();
    loadFeedbacks();
});
