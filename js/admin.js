document.addEventListener("DOMContentLoaded", () => {
    console.log("[ADMIN] Console v1.2 Initialized");
    
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // --- GLOBAL DATA HANDLERS ---
    window.loadMeals = async () => {
        const container = document.getElementById("inventory-container");
        if(!container) return;
        try {
            const res = await fetch("http://127.0.0.1:5001/api/meals", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const meals = await res.json();
            
            container.innerHTML = "";
            const times = ['Breakfast', 'Lunch', 'Dinner'];
            
            times.forEach(time => {
                const group = meals.filter(m => m.mealTime === time);
                const section = document.createElement("div");
                section.className = "meal-group";
                section.innerHTML = `<h4>${time} Items (${group.length})</h4>`;
                
                if (group.length === 0) {
                    section.innerHTML += `<p style="padding:10px; font-size:12px; color:#94a3b8;">No items for ${time}.</p>`;
                } else {
                    const table = document.createElement("table");
                    table.innerHTML = `
                        <thead><tr><th>Name</th><th>Type</th><th>Diet</th><th>Action</th></tr></thead>
                        <tbody>${group.map(m => `
                            <tr>
                                <td>${m.name}</td>
                                <td><span style="font-size:11px; color:#64748b;">${m.type}</span></td>
                                <td><span class="badge ${m.diet === 'veg' ? 'badge-veg' : 'badge-nonveg'}">${m.diet}</span></td>
                                <td><button class="delete-btn" onclick="deleteMeal('${m._id}')">Delete</button></td>
                            </tr>
                        `).join('')}</tbody>
                    `;
                    section.appendChild(table);
                }
                container.appendChild(section);
            });
            document.getElementById("stat-meals").innerText = meals.length;
        } catch (e) { console.error(e); }
    };

    window.loadUsers = async () => {
        const tbody = document.getElementById("usersTableBody");
        if(!tbody) return;
        try {
            const res = await fetch("http://127.0.0.1:5001/api/auth/users", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const users = await res.json();
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td>${u.name || u.email.split('@')[0]}</td>
                    <td>${u.email}</td>
                    <td><span class="badge ${u.role === 'admin' ? 'badge-veg' : ''}">${u.role}</span></td>
                    <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
            `).join('');
            document.getElementById("stat-users").innerText = users.length;
        } catch (e) { console.error(e); }
    };

    window.loadFeedback = async () => {
        const list = document.getElementById("feedback-list");
        if (!list) return;
        try {
            const res = await fetch("http://127.0.0.1:5001/api/support/tickets", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.length === 0) {
                list.innerHTML = "<p style='color: #64748b; text-align: center; padding: 40px;'>No feedback received yet.</p>";
                return;
            }
            list.innerHTML = data.map(f => `
                <div style="padding:15px; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; background:white;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:600; font-size:14px; color:#1e293b;">${f.parentName}</span>
                        <span style="font-size:11px; color:#64748b; font-weight:600;">#TG-${f._id.slice(-5).toUpperCase()}</span>
                    </div>
                    <p style="font-size:11px; color:#2563eb; margin-bottom:10px; font-weight:700; text-transform:uppercase;">Topic: ${f.topic}</p>
                    <p style="font-size:13px; color:#334155; line-height:1.5;">${f.message}</p>
                    <div style="margin-top:10px; padding-top:10px; border-top:1px solid #f1f5f9;">
                        ${f.adminResponse ? 
                            `<div style="background:#f8fafc; padding:10px; border-radius:8px; border-left:3px solid #10b981; font-size:12px; color:#475569;">
                                <strong>Your Reply:</strong> ${f.adminResponse}
                            </div>` :
                            `<div style="display:flex; flex-direction:column; gap:8px;">
                                <textarea id="reply-${f._id}" placeholder="Type your reply here..." style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; resize:vertical; min-height:60px; font-family:inherit;"></textarea>
                                <button onclick="submitReply('${f._id}')" style="align-self:flex-end; background:#ff7aa2; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">Send Reply</button>
                            </div>`
                        }
                    </div>
                    <div style="margin-top:10px; font-size:11px; color:#94a3b8; text-align:right;">
                        ${new Date(f.createdAt).toLocaleString()}
                    </div>
                </div>
            `).join('');
        } catch (e) { console.error(e); }
    };

    window.submitReply = async (id) => {
        const replyInput = document.getElementById(`reply-${id}`);
        const response = replyInput.value.trim();
        if (!response) {
            alert("Please type a reply first.");
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:5001/api/support/reply/${id}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ response })
            });

            if (res.ok) {
                alert("Reply sent successfully!");
                window.loadFeedback(); // Refresh the list
            } else {
                alert("Failed to send reply.");
            }
        } catch (err) {
            console.error("Reply Error:", err);
            alert("Connection error.");
        }
    };

    window.refreshViewData = (viewId) => {
        console.log("[ADMIN] Refreshing View:", viewId);
        if (viewId === 'meal-engine') window.loadMeals();
        if (viewId === 'managed-users') window.loadUsers();
        if (viewId === 'user-feedback') window.loadFeedback();
    };

    // Add Meal
    const addForm = document.getElementById("addMealForm");
    if (addForm) {
        addForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById("mName").value,
                mealTime: document.getElementById("mTime").value,
                type: document.getElementById("mType").value,
                diet: document.getElementById("mDiet").value,
                ingredients: document.getElementById("mIngredients").value.split(",").map(i => i.trim())
            };
            try {
                const res = await fetch("http://127.0.0.1:5001/api/meals", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    addForm.reset();
                    window.loadMeals();
                }
            } catch (err) { console.error(err); }
        });
    }

    window.deleteMeal = async (id) => {
        if (!confirm("Delete this item?")) return;
        try {
            await fetch(`http://127.0.0.1:5001/api/meals/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.loadMeals();
        } catch (err) { console.error(err); }
    };

    // Initial Load
    window.loadMeals();
    window.loadUsers();
    window.loadFeedback();
});
