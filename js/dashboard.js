/**
 * TiffinGenie — Smart Meal Engine
 * Features: Culture-Aware Generation, Custom Meals, Interactive Modal, Per-Meal Regenerate
 */

// ─── DATA LOADED FROM meals_db.js ─────────────────────────────────────────────


// ─── MODULE-LEVEL PLAN & SWAP STATE ──────────────────────────────────────────
var currentPlan = {};
var swapCandidates = {};

// ─── LEARNING BEHAVIOR ENGINE ──────────────────────────────────────────────────
function getPreferences() {
    return JSON.parse(localStorage.getItem("mealPreferences") || "{}");
}

// ─── PACKING TIPS DATABASE ────────────────────────────────────────────────────
const GENIE_PACKING_TIPS = {
    "roti": "Wrap in aluminum foil while hot to keep them soft for 5+ hours.",
    "paratha": "Apply a thin layer of ghee to keep them moist in the box.",
    "rice": "Allow steam to escape for 1 minute before closing the lid to prevent sogginess.",
    "khichdi": "Add a small cube of butter on top before packing to prevent it from drying.",
    "sandwich": "Toast the bread lightly first so it doesn't get soggy from the fillings.",
    "poha": "Garnish with fresh lemon only just before eating to keep it fresh.",
    "idli": "Wrap idlis in a clean damp cloth inside the tiffin to keep them spongy.",
    "dosa": "Roll them loosely rather than folding flat to keep the texture better.",
    "chicken": "Keep the gravy separate or slightly thicker to avoid leakage.",
    "egg": "If packing Boiled Eggs, peel them just before packing to retain moisture.",
    "pasta": "Add a teaspoon of olive oil after boiling to keep it from sticking.",
    "noodles": "Pack with a small fork and ensure they are not overcooked.",
    "sabzi": "Drain excess oil before packing to keep the tiffin clean."
};

function getPackingTip(mealName) {
    var name = mealName.toLowerCase();
    var found = null;
    Object.keys(GENIE_PACKING_TIPS).forEach(function(key) {
        if (name.includes(key)) found = GENIE_PACKING_TIPS[key];
    });
    return found;
}

function updatePreference(mealName, action) {
    if (!mealName) return;
    var prefs = getPreferences();
    if (!prefs[mealName]) prefs[mealName] = { selected: 0, swappedOut: 0 };
    if (action === "select") prefs[mealName].selected++;
    if (action === "swapOut") prefs[mealName].swappedOut++;
    localStorage.setItem("mealPreferences", JSON.stringify(prefs));
    console.log("[LEARN] Updated preference:", mealName, prefs[mealName]);
}

function getMealWeight(meal, prefs) {
    var p = prefs[meal.name] || { selected: 0, swappedOut: 0 };
    // Base weight is 1.0. Selecting it increases chances, swapping out decreases chances.
    // Swapping 3 times reduces weight by 0.9, meaning it's very unlikely to be picked, but never 0.
    var weight = 1.0 + (p.selected * 0.4) - (p.swappedOut * 0.3);

    // Always give custom meals a significant boost so they actually appear in "options"
    if (meal.custom) {
        weight *= 3.0; 
    }

    // Favourites boost: meals hearted in Genie Kitchen get priority
    var favs = JSON.parse(localStorage.getItem("mealFavorites") || "[]");
    if (favs.indexOf(meal.name) !== -1) {
        weight *= 5.0;
    }

    return Math.max(0.1, weight); // never fully remove to maintain variety
}

// ─── ALLERGY FILTER ────────────────────────────────────────────────────────────
function filterByAllergy(meals, allergies) {
    if (!allergies || allergies.length === 0) return meals;
    return meals.filter(function(meal) {
        return !allergies.some(function(a) {
            return meal.name.toLowerCase().includes(a.toLowerCase());
        });
    });
}

// ─── WEIGHTED NON-REPEATING PICK ───────────────────────────────────────────────
function pickMeal(pool, lastUsed) {
    var available = pool.filter(function(m) { return m.name !== lastUsed; });
    if (available.length === 0) available = pool;

    var prefs = getPreferences();
    var totalWeight = 0;
    var weightedPool = available.map(function(m) {
        var w = getMealWeight(m, prefs);
        totalWeight += w;
        return { meal: m, weight: w };
    });

    var randomNum = Math.random() * totalWeight;
    var weightSum = 0;
    for (var i = 0; i < weightedPool.length; i++) {
        weightSum += weightedPool[i].weight;
        if (randomNum <= weightSum) {
            return weightedPool[i].meal;
        }
    }
    return available[Math.floor(Math.random() * available.length)];
}

// ─── LOAD CUSTOM MEALS FROM localStorage ──────────────────────────────────────
function getCustomMeals(cuisine) {
    var raw = localStorage.getItem("customMeals");
    if (!raw) return { breakfast: [], lunch: [], dinner: [] };
    var all = JSON.parse(raw);
    var matched = all.filter(function(m) {
        // More inclusive: show custom meals if they match user's cuisine OR if they are marked 'mixed'
        // OR if the user's cuisine isn't strictly set.
        return m.cuisine === cuisine || m.cuisine === "mixed" || cuisine === "mixed" || !cuisine;
    });
    var result = { breakfast: [], lunch: [], dinner: [] };
    matched.forEach(function(m) {
        var t = m.type.toLowerCase();
        if (result[t]) result[t].push({ name: m.name, tags: m.tags, custom: true });
    });
    console.log("[ENGINE] Custom meals merged:", result);
    return result;
}

// ─── GENERATE WEEKLY PLAN ──────────────────────────────────────────────────────
function generateWeeklyPlan(profile) {
    var cuisine  = profile.cuisine || (profile.diet === "non-veg" ? "indian_nonveg" : "indian_veg");
    var allergies = profile.allergies || [];

    console.log("[ENGINE] Profile:", profile);
    console.log("[ENGINE] Cuisine:", cuisine);

    var db     = MEAL_DB[cuisine] || MEAL_DB["indian_veg"];
    var custom = getCustomMeals(cuisine);

    var breakfasts = filterByAllergy(db.breakfast.concat(custom.breakfast), allergies);
    var lunches    = filterByAllergy(db.lunch.concat(custom.lunch),         allergies);
    var dinners    = filterByAllergy(db.dinner.concat(custom.dinner),       allergies);

    console.log("[ENGINE] Breakfast pool:", breakfasts.map(function(m){ return m.name; }));
    console.log("[ENGINE] Lunch pool:",    lunches.map(function(m){ return m.name; }));
    console.log("[ENGINE] Dinner pool:",   dinners.map(function(m){ return m.name; }));

    var plan = {}, lastB = "", lastL = "", lastD = "";
    DAYS.forEach(function(day) {
        var b = pickMeal(breakfasts, lastB);
        var l = pickMeal(lunches,    lastL);
        var d = pickMeal(dinners,    lastD);
        lastB = b.name; lastL = l.name; lastD = d.name;
        plan[day] = { breakfast: b, lunch: l, dinner: d };
    });

    console.log("[ENGINE] Generated plan:", plan);
    return plan;
}

// ─── RENDER DASHBOARD (SIMPLIFIED CLICKABLE CARDS) ────────────────────────────
function renderDashboard(profile, plan) {
    currentPlan = plan;
    document.getElementById("loadingState").style.display   = "none";
    document.getElementById("emptyState").style.display    = "none";
    document.getElementById("dashboardContent").style.display = "block";

    var box = document.getElementById("weeklyPlanBox");
    if (!box) return;

    // Inject CSS once
    if (!document.getElementById("meal-styles")) {
        var s = document.createElement("style");
        s.id = "meal-styles";
        s.textContent = [
            ".day-card{padding:24px 20px;border-radius:18px;background:#fff;border:1px solid #f0f0f0;",
            "cursor:pointer;transition:transform 0.22s cubic-bezier(.4,0,.2,1),box-shadow 0.22s;}",
            ".day-card:hover{transform:translateY(-6px);box-shadow:0 12px 30px rgba(255,122,162,0.13);border-color:#ffb6cb;}",
            "@keyframes modalIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}",
            ".modal-box{animation:modalIn 0.22s cubic-bezier(.4,0,.2,1);}"
        ].join("");
        document.head.appendChild(s);
    }

    var html = "";
    DAYS.forEach(function(day) {
        var d = plan[day];
        if (!d) return;
        var lunchName = d.lunch ? d.lunch.name : "";
        var hasCustom = (d.breakfast && d.breakfast.custom) || (d.lunch && d.lunch.custom) || (d.dinner && d.dinner.custom);
        var badge = hasCustom
            ? '<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#ede9fe;color:#7c3aed;font-weight:700;">Custom</span> '
            : "";
        html +=
            '<div class="day-card" onclick="openDayModal(\'' + day + '\')">'
            + '<h4 style="margin:0 0 10px;font-family:\'Fredoka\';font-size:20px;color:#ff7aa2;">' + day + '</h4>'
            + '<div style="font-size:13px;color:#6b7280;margin-bottom:8px;">&#9728;&#65039; ' + lunchName + '</div>'
            + '<div style="display:flex;gap:6px;align-items:center;">'
            + badge
            + '<span style="font-size:11px;color:#d1d5db;">Tap to view all meals &#8594;</span>'
            + '</div></div>';
    });
    box.innerHTML = html;
}

// ─── PREP REMINDERS LOGIC ─────────────────────────────────────────────────────
window.togglePrepReminders = function(enabled) {
    localStorage.setItem("prepRemindersEnabled", enabled);
    if (enabled) {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications.");
            return;
        }
        Notification.requestPermission().then(function(permission) {
            if (permission === "granted") {
                new Notification("TiffinGenie", { body: "Awesome! We'll remind you every evening to prep for tomorrow's tiffin." });
            }
        });
    }
}

// ─── BUILD ONE MEAL ROW FOR DAY MODAL ─────────────────────────────────────────
function buildMealSection(day, type, meal, emoji, bg, textColor) {
    var badge = meal.custom
        ? '<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#ede9fe;color:#7c3aed;font-weight:700;margin-left:6px;">Custom</span>'
        : "";
    var tagHTML = (meal.tags || []).map(function(t) {
        return '<span style="font-size:10px;padding:3px 10px;border-radius:10px;background:' + bg + ';color:' + textColor + ';font-weight:600;">' + t + '</span>';
    }).join(" ");

    var sectionId = "swap_" + day + "_" + type;

    var tip = getPackingTip(meal.name);
    var tipHTML = tip 
        ? '<div style="margin-top:12px;padding:8px 12px;background:#fffbeb;border-left:3px solid #f59e0b;font-size:12px;color:#92400e;border-radius:4px;">'
          + '<strong>💡 Genie Tip:</strong> ' + tip + '</div>'
        : '';

    return '<div id="section_' + sectionId + '" style="padding:16px;border-radius:14px;background:#f9fafb;margin-bottom:12px;transition:background 0.2s;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
        + '<span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;">' + emoji + ' ' + type + '</span>'
        + '<button onclick="showSwapOptions(\'' + day + '\',\'' + type + '\')" '
        + 'id="swapbtn_' + sectionId + '" '
        + 'style="font-size:12px;padding:5px 14px;border-radius:8px;border:1px solid #ff7aa2;background:#fff0f5;cursor:pointer;font-weight:600;color:#ff7aa2;transition:0.15s;"'
        + ' onmouseover="this.style.background=\'#ffe4ef\'" onmouseout="this.style.background=\'#fff0f5\'">'
        + '&#8644; Swap</button>'
        + '</div>'
        + '<div id="meal_' + sectionId + '" style="font-size:15px;font-weight:500;color:#111827;display:flex;align-items:center;flex-wrap:wrap;gap:6px;">'
        + meal.name + badge
        + '</div>'
        + '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">' + tagHTML + '</div>'
        + tipHTML
        + '<div id="' + sectionId + '" style="display:none;margin-top:12px;"></div>'
        + '</div>';
}

// ─── SMART SWAP ENGINE ────────────────────────────────────────────────────────
function getSmartSwaps(current, pool, maxResults) {
    maxResults = maxResults || 5;
    var currentTags = current.tags || [];
    var prefs = getPreferences();

    // Score by tag overlap (higher = more similar)
    // Custom meals get a +2 boost so they are prioritized in the suggestions
    // Learning profile influences the score natively
    var scored = pool
        .filter(function(m) { return m.name.toLowerCase() !== current.name.toLowerCase(); })
        .map(function(m) {
            var overlap = (m.tags || []).filter(function(t) {
                return currentTags.indexOf(t) !== -1;
            }).length;
            
            var p = prefs[m.name] || { selected: 0, swappedOut: 0 };
            var learnBoost = (p.selected * 0.5) - (p.swappedOut * 0.5);

            // Boost custom meals + learning behavior influence
            var score = overlap + (m.custom ? 2 : 0) + learnBoost;

            // Reality Mode priority
            var profileRaw = localStorage.getItem("userProfile");
            if (profileRaw) {
                var profile = JSON.parse(profileRaw);
                if (profile.realityMode) {
                    var isSimple = (m.tags || []).indexOf("simple") !== -1 || m.custom;
                    if (isSimple) score += 3; // strong boost to simple meals
                    else score -= 3; // strong penalty to complex meals
                }
            }

            return { meal: m, score: score };
        })
        .sort(function(a, b) { 
            // Sort by score descending
            // If scores are tied, custom meals win
            if (b.score === a.score) {
                return (b.meal.custom ? 1 : 0) - (a.meal.custom ? 1 : 0);
            }
            return b.score - a.score; 
        });

    // Deduplicate by name
    var seen = {};
    var results = [];
    for (var i = 0; i < scored.length && results.length < maxResults; i++) {
        var name = scored[i].meal.name.toLowerCase();
        if (!seen[name]) { seen[name] = true; results.push(scored[i].meal); }
    }
    console.log("[SWAP] Smart options for '" + current.name + "':", results.map(function(m){ return m.name; }));
    return results;
}

function showSwapOptions(day, type) {
    var sectionId = "swap_" + day + "_" + type;
    var panel     = document.getElementById(sectionId);
    if (!panel) return;

    // Toggle: if already open, close it
    if (panel.style.display !== "none") {
        panel.style.display = "none";
        return;
    }

    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) return;
    var profile  = JSON.parse(profileRaw);
    var cuisine  = profile.cuisine || (profile.diet === "non-veg" ? "indian_nonveg" : "indian_veg");
    var db       = MEAL_DB[cuisine] || MEAL_DB["indian_veg"];
    var custom   = getCustomMeals(cuisine);
    var allergies = profile.allergies || [];

    var pool    = filterByAllergy((db[type] || []).concat(custom[type] || []), allergies);
    var current = currentPlan[day][type];
    var options = getSmartSwaps(current, pool, 5);

    // Persist candidates for selectSwap()
    swapCandidates[sectionId] = options;

    if (options.length === 0) {
        panel.innerHTML = '<p style="font-size:13px;color:#9ca3af;margin:0;">No alternatives available.</p>';
        panel.style.display = "block";
        return;
    }

    var html = '<div style="font-size:11px;font-weight:700;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px;">Choose an alternative:</div>';
    options.forEach(function(meal, idx) {
        var tagPills = (meal.tags || []).map(function(t) {
            return '<span style="font-size:10px;padding:2px 8px;border-radius:8px;background:#e5e7eb;color:#374151;font-weight:600;">' + t + '</span>';
        }).join(" ");
        html +=
            '<div onclick="selectSwap(\'' + day + '\',\'' + type + '\',' + idx + ')" '
            + 'style="padding:10px 12px;border-radius:10px;border:1.5px solid #e5e7eb;background:#fff;margin-bottom:8px;cursor:pointer;transition:border-color 0.15s,box-shadow 0.15s;"'
            + ' onmouseover="this.style.borderColor=\'#ff7aa2\';this.style.boxShadow=\'0 2px 10px rgba(255,122,162,0.15)\'"'
            + ' onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.boxShadow=\'none\'">'
            + '<div style="font-size:14px;font-weight:500;color:#111827;margin-bottom:5px;">' + meal.name + (meal.custom ? ' <span style="font-size:10px;color:#7c3aed;font-weight:700;">[Custom]</span>' : '') + '</div>'
            + '<div style="display:flex;gap:5px;flex-wrap:wrap;">' + tagPills + '</div>'
            + '</div>';
    });
    html += '<button onclick="hideSwapOptions(\'' + day + '\',\'' + type + '\')" style="font-size:12px;color:#9ca3af;background:none;border:none;cursor:pointer;padding:0;margin-top:2px;">✕ Cancel</button>';

    panel.innerHTML  = html;
    panel.style.display = "block";
}

function hideSwapOptions(day, type) {
    var panel = document.getElementById("swap_" + day + "_" + type);
    if (panel) panel.style.display = "none";
}

function selectSwap(day, type, idx) {
    var sectionId = "swap_" + day + "_" + type;
    var options   = swapCandidates[sectionId];
    if (!options || !options[idx]) return;

    var original = currentPlan[day][type];
    var picked   = options[idx];

    console.log("[SWAP] Original:", original.name);
    console.log("[SWAP] Selected:", picked.name);

    // Track user learning behavior
    updatePreference(original.name, "swapOut");
    updatePreference(picked.name, "select");

    currentPlan[day][type] = picked;
    localStorage.setItem("weeklyPlan", JSON.stringify(currentPlan));

    // Refresh card grid
    var profileRaw = localStorage.getItem("userProfile");
    if (profileRaw) renderDashboard(JSON.parse(profileRaw), currentPlan);

    // Brief highlight then re-open modal
    var section = document.getElementById("section_" + sectionId);
    if (section) {
        section.style.background = "#fef3c7";
        setTimeout(function() {
            if (section) section.style.background = "#f9fafb";
        }, 600);
    }
    // Reopen modal with updated data
    setTimeout(function() { openDayModal(day); }, 80);
}

// ─── OPEN DAY MODAL ────────────────────────────────────────────────────────────
function openDayModal(day) {
    var d = currentPlan[day];
    if (!d) return;
    console.log("[MODAL] Opening:", day, d);

    var modal   = document.getElementById("dayDetailModal");
    var content = document.getElementById("dayModalContent");
    if (!modal || !content) return;

    content.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
        + '<h3 style="font-family:\'Fredoka\';font-size:28px;margin:0;color:#111827;">' + day + '</h3>'
        + '<button onclick="closeDayModal()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#9ca3af;line-height:1;padding:5px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:0.2s;" onmouseover="this.style.background=\'#f3f4f6\';this.style.color=\'#111827\'" onmouseout="this.style.background=\'none\';this.style.color=\'#9ca3af\'">&times;</button>'
        + '</div>'
        + buildMealSection(day, "breakfast", d.breakfast, "&#127749;", "#fef3c7", "#92400e")
        + buildMealSection(day, "lunch",     d.lunch,     "&#9728;&#65039;", "#d1fae5", "#065f46")
        + buildMealSection(day, "dinner",    d.dinner,    "&#127769;", "#e0e7ff", "#3730a3");

    modal.style.display = "flex";
}

window.closeDayModal = function() {
    var m = document.getElementById("dayDetailModal");
    if (m) m.style.display = "none";
};

// ─── REGENERATE A SINGLE MEAL ─────────────────────────────────────────────────
function regenerateMeal(day, type) {
    console.log("[REGEN] Day:", day, "| Type:", type);

    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) return;
    var profile  = JSON.parse(profileRaw);
    var cuisine  = profile.cuisine || (profile.diet === "non-veg" ? "indian_nonveg" : "indian_veg");
    var db       = MEAL_DB[cuisine] || MEAL_DB["indian_veg"];
    var custom   = getCustomMeals(cuisine);
    var allergies = profile.allergies || [];

    var pool = filterByAllergy((db[type] || []).concat(custom[type] || []), allergies);
    if (pool.length === 0) { console.warn("[REGEN] Empty pool for", type); return; }

    var current    = currentPlan[day][type];
    var candidates = pool.filter(function(m) { return m.name !== current.name; });
    if (candidates.length === 0) candidates = pool;

    var picked = candidates[Math.floor(Math.random() * candidates.length)];
    currentPlan[day][type] = picked;

    console.log("[REGEN]", current.name, "->", picked.name);
    localStorage.setItem("weeklyPlan", JSON.stringify(currentPlan));

    renderDashboard(profile, currentPlan);
    openDayModal(day); // re-open to show updated content
}

// ─── SAVE CUSTOM MEAL ──────────────────────────────────────────────────────────
function saveCustomMeal() {
    var name    = (document.getElementById("cmName").value || "").trim();
    var type    = document.getElementById("cmType").value;
    var cuisine = document.getElementById("cmCuisine").value;
    var tagEls  = document.querySelectorAll(".cm-tag-check:checked");
    var tags    = Array.from(tagEls).map(function(el) { return el.value; });
    var fb      = document.getElementById("cmFeedback");

    if (!name)        { fb.innerText = "Please enter a meal name.";        fb.style.color = "orange"; return; }
    if (!tags.length) { fb.innerText = "Please select at least one tag.";  fb.style.color = "orange"; return; }

    var existing = JSON.parse(localStorage.getItem("customMeals") || "[]");
    var isDup = existing.some(function(m) {
        return m.name.toLowerCase() === name.toLowerCase() && m.type === type;
    });
    if (isDup) { fb.innerText = '"' + name + '" already exists for ' + type + '.'; fb.style.color = "red"; return; }

    existing.push({ name: name, type: type, tags: tags, cuisine: cuisine, custom: true });
    localStorage.setItem("customMeals", JSON.stringify(existing));
    console.log("[CUSTOM] Saved:", existing);

    fb.innerText = '\u2705 "' + name + '" added! Regenerate plan to include it.';
    fb.style.color = "green";
    document.getElementById("cmName").value = "";
    document.querySelectorAll(".cm-tag-check").forEach(function(el) { el.checked = false; });
    setTimeout(closeAddMealModal, 1600);
}

// ─── ADD MEAL MODAL CONTROLS ──────────────────────────────────────────────────
function openAddMealModal() {
    var profileRaw = localStorage.getItem("userProfile");
    if (profileRaw) {
        var p  = JSON.parse(profileRaw);
        var el = document.getElementById("cmCuisine");
        if (el && p.cuisine) el.value = p.cuisine;
    }
    document.getElementById("addMealModal").style.display = "flex";
    document.getElementById("cmFeedback").innerText = "";
}

window.closeAddMealModal = function() {
    var m = document.getElementById("addMealModal");
    if (m) m.style.display = "none";
};

// ─── GENERATE & SAVE ───────────────────────────────────────────────────────────
function generateFullPlan() {
    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) {
        alert("No profile found. Please set up your profile first.");
        window.location.href = "onboarding.html";
        return;
    }
    var profile = JSON.parse(profileRaw);
    
    var genBtn = document.getElementById("generatePlanBtn");
    var originalHTML = "";
    if (genBtn) {
        originalHTML = genBtn.innerHTML;
        genBtn.innerHTML = "<span>⏳</span> Generating...";
        genBtn.style.opacity = "0.7";
        genBtn.style.pointerEvents = "none";
    }

    // Small delay to allow UI to render the button change
    setTimeout(function() {
        var plan = generateWeeklyPlan(profile);
        localStorage.setItem("weeklyPlan", JSON.stringify(plan));
        renderDashboard(profile, plan);

        if (genBtn) {
            genBtn.innerHTML = "<span>✅</span> Plan Ready!";
            setTimeout(function() {
                genBtn.innerHTML = originalHTML;
                genBtn.style.opacity = "1";
                genBtn.style.pointerEvents = "auto";
            }, 1200);
        }
    }, 150);
}

// ─── INIT ──────────────────────────────────────────────────────────────────────
function initDashboard() {
    console.log("[DASHBOARD] Initializing...");
    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) {
        console.warn("[DASHBOARD] No profile, redirecting to login");
        window.location.href = "login.html";
        return;
    }
    var profile = JSON.parse(profileRaw);
    console.log("[DASHBOARD] Profile:", profile);

    var titleEl = document.getElementById("childNameTitle");
    if (titleEl) titleEl.innerText = " \u2013 " + profile.name;

    var realityToggle = document.getElementById("realityModeToggle");
    if (realityToggle) {
        realityToggle.checked = !!profile.realityMode;
    }

    var savedPlan = localStorage.getItem("weeklyPlan");
    if (savedPlan) {
        renderDashboard(profile, JSON.parse(savedPlan));
    } else {
        document.getElementById("loadingState").style.display    = "none";
        document.getElementById("dashboardContent").style.display = "none";
        document.getElementById("emptyState").style.display     = "block";
    }
}

// ─── REALITY MODE TOGGLE ───────────────────────────────────────────────────────
function toggleRealityMode(isOn) {
    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) return;
    var profile = JSON.parse(profileRaw);
    profile.realityMode = isOn;
    localStorage.setItem("userProfile", JSON.stringify(profile));
    console.log("[REALITY MODE]", isOn ? "ON" : "OFF");
    
    // Optionally alert user or just regenerate silently
    // For a cleaner UX, we just let them click 'Generate Weekly Plan' when ready,
    // or we can auto-regenerate. Let's auto-regenerate if a plan exists to show effect immediately.
    if (localStorage.getItem("weeklyPlan")) {
        generateFullPlan();
    }
}

// ─── GROCERY LIST ENGINE ───────────────────────────────────────────────────────
function extractIngredients(mealName) {
    var name = mealName.toLowerCase();
    var ingredients = [];

    // format: { name, category, qtyPerMeal, unit }
    if (name.includes("poha")) {
        ingredients.push({ name: "Rice Flakes (Poha)", category: "Grains", qty: 100, unit: "g" });
        ingredients.push({ name: "Peanuts", category: "Protein", qty: 15, unit: "g" });
        ingredients.push({ name: "Onion", category: "Vegetables", qty: 0.5, unit: "pc" });
    }
    if (name.includes("dal") || name.includes("sambar") || name.includes("rajma") || name.includes("chole") || name.includes("lentil") || name.includes("besan") || name.includes("kadhi") || name.includes("moong") || name.includes("masoor")) {
        ingredients.push({ name: "Mixed Lentils / Pulses", category: "Protein", qty: 80, unit: "g" });
    }
    if (name.includes("roti") || name.includes("paratha") || name.includes("chapati") || name.includes("thepla") || name.includes("bhature") || name.includes("wheat")) {
        ingredients.push({ name: "Wheat Flour", category: "Grains", qty: 120, unit: "g" });
    }
    if (name.includes("rice") || name.includes("chawal") || name.includes("biryani") || name.includes("pulao") || name.includes("khichdi") || name.includes("idli") || name.includes("dosa")) {
        ingredients.push({ name: "Rice", category: "Grains", qty: 100, unit: "g" });
    }
    if (name.includes("paneer")) ingredients.push({ name: "Paneer", category: "Dairy", qty: 100, unit: "g" });
    if (name.includes("chicken")) ingredients.push({ name: "Chicken", category: "Protein", qty: 150, unit: "g" });
    if (name.includes("egg") || name.includes("omelette")) ingredients.push({ name: "Eggs", category: "Protein", qty: 2, unit: "pcs" });
    if (name.includes("fish") || name.includes("prawn")) ingredients.push({ name: "Fish / Seafood", category: "Protein", qty: 150, unit: "g" });
    if (name.includes("mutton") || name.includes("keema")) ingredients.push({ name: "Mutton", category: "Protein", qty: 150, unit: "g" });
    if (name.includes("sabzi") || name.includes("gobi") || name.includes("veg") || name.includes("pav bhaji")) ingredients.push({ name: "Mixed Vegetables", category: "Vegetables", qty: 150, unit: "g" });
    if (name.includes("palak")) ingredients.push({ name: "Spinach", category: "Vegetables", qty: 100, unit: "g" });
    if (name.includes("aloo")) ingredients.push({ name: "Potatoes", category: "Vegetables", qty: 1, unit: "pc" });
    if (name.includes("bread") || name.includes("sandwich") || name.includes("pav") || name.includes("toast")) ingredients.push({ name: "Bread", category: "Grains", qty: 3, unit: "slices" });
    if (name.includes("upma") || name.includes("rava")) ingredients.push({ name: "Semolina (Rava)", category: "Grains", qty: 80, unit: "g" });
    if (name.includes("curd")) ingredients.push({ name: "Curd / Yogurt", category: "Dairy", qty: 100, unit: "g" });
    
    ingredients.push({ name: "Cooking Oil / Ghee", category: "Others", qty: 15, unit: "ml" });
    ingredients.push({ name: "Salt & Basic Spices", category: "Others", qty: 5, unit: "g" });

    return ingredients;
}

function generateGroceryList() {
    var rawPlan = localStorage.getItem("weeklyPlan");
    if (!rawPlan) return {};
    
    var plan = JSON.parse(rawPlan);
    var listMap = {};

    // Get Age Multiplier
    var ageMult = 1.0;
    var profileRaw = localStorage.getItem("userProfile");
    if (profileRaw) {
        var p = JSON.parse(profileRaw);
        var age = parseInt(p.childAge || 7);
        if (age < 5) ageMult = 0.7;
        else if (age > 12) ageMult = 1.4;
    }
    
    ["Vegetables", "Fruits", "Grains", "Protein", "Dairy", "Others"].forEach(function(cat) {
        listMap[cat] = {};
    });

    Object.keys(plan).forEach(function(day) {
        var dayPlan = plan[day];
        ["breakfast", "lunch", "dinner"].forEach(function(mealType) {
            if (dayPlan[mealType]) {
                var ings = extractIngredients(dayPlan[mealType].name);
                ings.forEach(function(item) {
                    var cat = item.category;
                    if (listMap[cat]) {
                        if (!listMap[cat][item.name]) {
                            listMap[cat][item.name] = { qty: 0, unit: item.unit };
                        }
                        listMap[cat][item.name].qty += (item.qty * ageMult);
                    }
                });
            }
        });
    });
    
    return listMap;
}

function openGroceryModal() {
    var listMap = generateGroceryList();
    var container = document.getElementById("groceryModalContent");
    if (!container) return;
    
    var html = "";
    var totalItems = 0;

    Object.keys(listMap).forEach(function(cat) {
        var items = listMap[cat];
        var itemNames = Object.keys(items);
        
        if (itemNames.length > 0) {
            html += '<div style="margin-bottom:20px;">';
            html += '<h4 style="margin:0 0 12px;font-size:15px;color:#ff7aa2;border-bottom:1.5px solid #fff0f5;padding-bottom:6px;font-family:\'Fredoka\'">' + cat + '</h4>';
            
            itemNames.forEach(function(name) {
                var data = items[name];
                var displayQty = data.qty;
                
                if (data.unit === "g" && displayQty >= 1000) {
                    displayQty = (displayQty / 1000).toFixed(1) + " kg";
                } else if (data.unit === "ml" && displayQty >= 1000) {
                    displayQty = (displayQty / 1000).toFixed(1) + " L";
                } else {
                    displayQty = Math.ceil(displayQty) + " " + data.unit;
                }

                html += '<label style="display:flex;align-items:center;gap:12px;margin-bottom:8px;font-size:14px;color:#374151;cursor:pointer;padding:6px;border-radius:8px;transition:background 0.2s;" onmouseover="this.style.background=\'#f9fafb\'" onmouseout="this.style.background=\'none\'">';
                html += '<input type="checkbox" style="width:18px;height:18px;accent-color:#ff7aa2;cursor:pointer;">';
                html += '<span style="flex:1;">' + name + '</span>';
                html += '<span style="font-size:13px;color:#9ca3af;font-weight:600;">' + displayQty + '</span>';
                html += '</label>';
                totalItems++;
            });
            html += '</div>';
        }
    });

    if (totalItems === 0) {
        html = "<p style='color:#6b7280;text-align:center;padding:20px;font-size:14px;'>Generate a weekly plan first to view your grocery list!</p>";
    }

    container.innerHTML = html;
    document.getElementById("groceryModal").style.display = "flex";
}

function closeGroceryModal() {
    document.getElementById("groceryModal").style.display = "none";
}

// ─── NUTRITION INSIGHTS LOGIC ──────────────────────────────────────────────────
function openInsightsModal() {
    var rawPlan = localStorage.getItem("weeklyPlan");
    var container = document.getElementById("insightsModalContent");
    if (!container) return;

    if (!rawPlan) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px 20px;">
                <h3 style="font-family:'Fredoka'; font-size:22px; color:#111827;">No meals planned yet</h3>
                <p style="color:#6b7280; margin-top:10px;">Generate your weekly plan first to see insights here.</p>
                <button class="btn-primary" onclick="closeInsightsModal(); generateFullPlan();" style="margin-top:20px; padding:10px 20px;">✨ Generate Now</button>
            </div>
        `;
        document.getElementById("insightsModal").style.display = "flex";
        return;
    }

    var plan = JSON.parse(rawPlan);
    var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var TARGETS = {
        protein: { name: "Protein", color: "#6aa9ff" },
        carbs:   { name: "Carbohydrates", color: "#f59e0b" },
        fiber:   { name: "Fiber & Veggies", color: "#10b981" }
    };

    function calcStats(meals) {
        var counts = { protein: 0, carbs: 0, fiber: 0 };
        if (meals.length === 0) return counts;
        meals.forEach(function(m) {
            if (!m || !m.tags) return;
            var t = m.tags.join(" ").toLowerCase();
            if (t.includes("protein") || t.includes("iron") || t.includes("omega-3") || t.includes("calcium")) counts.protein++;
            if (t.includes("carbs") || t.includes("energy")) counts.carbs++;
            if (t.includes("fiber") || t.includes("vitamins") || t.includes("light")) counts.fiber++;
        });
        return {
            protein: Math.round((counts.protein / meals.length) * 100),
            carbs:   Math.round((counts.carbs / meals.length) * 100),
            fiber:   Math.round((counts.fiber / meals.length) * 100)
        };
    }

    function getInsightMsg(type, pct) {
        if (type === "protein") {
            if (pct < 30) return { text: "This week is slightly low in protein.", status: "yellow" };
            return { text: "Great balance of protein for growth!", status: "green" };
        }
        if (type === "carbs") {
            if (pct < 30) return { text: "Slightly low on energy-giving carbs.", status: "yellow" };
            if (pct > 80) return { text: "Very carb-heavy. Balance with fiber.", status: "yellow" };
            return { text: "Good balance for steady energy.", status: "green" };
        }
        if (type === "fiber") {
            if (pct < 30) return { text: "Add more fiber-rich meals or side salads.", status: "red" };
            return { text: "Excellent amount of fiber and vitamins.", status: "green" };
        }
        return { text: "Looks good.", status: "green" };
    }

    function renderInsightsUI(targetId, stats) {
        var html = "";
        Object.keys(TARGETS).forEach(function(key) {
            var val = stats[key] || 0;
            var insight = getInsightMsg(key, val);
            var color = TARGETS[key].color;
            if (insight.status === "red") color = "#ef4444";
            else if (insight.status === "yellow") color = "#f59e0b";
            else if (insight.status === "green") color = "#10b981";

            html += `
                <div style="margin-bottom: 20px;">
                    <div class="insight-row">
                        <span class="insight-label">${TARGETS[key].name}</span>
                        <span class="insight-percent" style="color: ${color}">${val}%</span>
                    </div>
                    <div class="insight-bar-bg">
                        <div class="insight-bar-fill" style="width: 0%; background-color: ${color};" data-width="${val}%"></div>
                    </div>
                    <div class="insight-text">${insight.text}</div>
                </div>
            `;
        });
        document.getElementById(targetId).innerHTML = html;
        setTimeout(function() {
            var fills = document.querySelectorAll("#" + targetId + " .insight-bar-fill");
            fills.forEach(function(f) { f.style.width = f.getAttribute("data-width"); });
        }, 100);
    }

    // Modal Template
    container.innerHTML = `
        <div class="insight-card">
            <h4 style="font-family:'Fredoka'; font-size:18px; margin:0 0 15px; color:#111827;">Weekly Summary</h4>
            <div id="modalScoreBox" style="margin-bottom:20px;"></div>
            <div id="weeklyStatsBox"></div>
        </div>
        <div class="insight-card">
            <h4 style="font-family:'Fredoka'; font-size:18px; margin:0 0 15px; color:#111827;">Daily Breakdown</h4>
            <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:10px; margin-bottom:15px;" id="dayTabs"></div>
            <div id="dailyStatsBox"></div>
        </div>
    `;

    // Weekly Calculation
    var all = [];
    DAYS.forEach(function(d) {
        if (plan[d]) {
            if (plan[d].breakfast) all.push(plan[d].breakfast);
            if (plan[d].lunch) all.push(plan[d].lunch);
            if (plan[d].dinner) all.push(plan[d].dinner);
        }
    });
    var weeklyStats = calcStats(all);
    renderInsightsUI("weeklyStatsBox", weeklyStats);

    // Render Modal Score
    var avg = Math.round((weeklyStats.protein + weeklyStats.fiber + weeklyStats.energy) / 3);
    var sColor = avg >= 80 ? "#10b981" : (avg >= 60 ? "#f59e0b" : "#ef4444");
    var sText = avg >= 80 ? "Excellent" : (avg >= 60 ? "Good" : "Needs Work");
    document.getElementById("modalScoreBox").innerHTML = `
        <div style="display:flex; align-items:center; gap:15px; background:#f9fafb; padding:15px; border-radius:15px; border:1px solid #f0f0f0;">
            <div style="width:60px; height:60px; border-radius:50%; background:${sColor}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:700; font-family:'Fredoka';">${avg}</div>
            <div>
                <div style="font-size:12px; color:#9ca3af; font-weight:700; text-transform:uppercase;">Weekly Health Score</div>
                <div style="font-size:18px; color:#111827; font-weight:600;">${sText}</div>
            </div>
        </div>
    `;

    // Daily Tabs
    var tabs = document.getElementById("dayTabs");
    DAYS.forEach(function(d, i) {
        var btn = document.createElement("button");
        btn.className = "day-tab" + (i === 0 ? " active" : "");
        btn.innerText = d;
        btn.onclick = function() {
            document.querySelectorAll(".day-tab").forEach(function(t) { t.classList.remove("active"); });
            btn.classList.add("active");
            var dayMeals = [];
            if (plan[d]) {
                if (plan[d].breakfast) dayMeals.push(plan[d].breakfast);
                if (plan[d].lunch) dayMeals.push(plan[d].lunch);
                if (plan[d].dinner) dayMeals.push(plan[d].dinner);
            }
            renderInsightsUI("dailyStatsBox", calcStats(dayMeals));
        };
        tabs.appendChild(btn);
    });

    // Initial Day
    var initialDay = DAYS[0];
    var firstDayMeals = [];
    if (plan[initialDay]) {
        if (plan[initialDay].breakfast) firstDayMeals.push(plan[initialDay].breakfast);
        if (plan[initialDay].lunch) firstDayMeals.push(plan[initialDay].lunch);
        if (plan[initialDay].dinner) firstDayMeals.push(plan[initialDay].dinner);
    }
    renderInsightsUI("dailyStatsBox", calcStats(firstDayMeals));

    document.getElementById("insightsModal").style.display = "flex";
}

window.closeInsightsModal = function() {
    var modal = document.getElementById("insightsModal");
    if (modal) modal.style.display = "none";
};

window.closeGroceryModal = function() {
    var modal = document.getElementById("groceryModal");
    if (modal) modal.style.display = "none";
};

// ─── BACKDROP CLOSE ────────────────────────────────────────────────────────────
window.addEventListener("click", function(e) {
    var dm = document.getElementById("dayDetailModal");
    if (dm && e.target === dm) closeDayModal();
    var am = document.getElementById("addMealModal");
    if (am && e.target === am) closeAddMealModal();
    var gm = document.getElementById("groceryModal");
    if (gm && e.target === gm) closeGroceryModal();
    var im = document.getElementById("insightsModal");
    if (im && e.target === im) closeInsightsModal();
});

function initDashboard() {
    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) {
        window.location.href = "login.html";
        return;
    }
    var profile = JSON.parse(profileRaw);
    document.getElementById("childNameTitle").innerText = "for " + profile.name;
    
    var planRaw = localStorage.getItem("weeklyPlan");
    if (!planRaw) {
        document.getElementById("loadingState").style.display = "none";
        document.getElementById("emptyState").style.display = "block";
    } else {
        renderDashboard(profile, JSON.parse(planRaw));
    }
}

window.addEventListener("DOMContentLoaded", initDashboard);
