// ─── MEAL DATABASE ─────────────────────────────────────────────────────────────
var MEAL_DB = {
    indian_veg: {
        breakfast: [
            { name: "Poha",               tags: ["carbs", "light", "iron", "simple"]    },
            { name: "Idli with Sambar",   tags: ["carbs", "protein", "light", "simple"] },
            { name: "Upma",               tags: ["carbs", "vitamins", "simple"]         },
            { name: "Aloo Paratha",       tags: ["carbs", "energy"]           },
            { name: "Moong Dal Chilla",   tags: ["protein", "fiber", "simple"]          },
            { name: "Thepla with Curd",   tags: ["vitamins", "carbs"]         },
            { name: "Besan Cheela",       tags: ["protein", "fiber", "simple"]          },
            { name: "Bread Upma",         tags: ["carbs", "light", "simple"]            },
            { name: "Sabudana Khichdi",   tags: ["carbs", "energy", "simple"]           }
        ],
        lunch: [
            { name: "Dal Roti",           tags: ["protein", "carbs", "fiber", "simple"] },
            { name: "Rajma Chawal",       tags: ["protein", "carbs"]          },
            { name: "Chole Bhature",      tags: ["protein", "carbs"]          },
            { name: "Paneer Sabzi + Roti",tags: ["protein", "calcium"]        },
            { name: "Kadhi Chawal",       tags: ["light", "probiotics", "simple"]       },
            { name: "Aloo Gobi + Roti",   tags: ["vitamins", "carbs"]         },
            { name: "Sambar Rice",        tags: ["protein", "fiber", "simple"]          },
            { name: "Mix Veg + Roti",     tags: ["vitamins", "fiber", "simple"]         },
            { name: "Pav Bhaji",          tags: ["carbs", "vitamins"]         }
        ],
        dinner: [
            { name: "Khichdi",            tags: ["light", "protein", "simple"]          },
            { name: "Sabzi Roti",         tags: ["fiber", "vitamins", "simple"]         },
            { name: "Dal Tadka + Rice",   tags: ["protein", "carbs", "simple"]          },
            { name: "Paneer Paratha",     tags: ["protein", "calcium"]        },
            { name: "Vegetable Pulao",    tags: ["carbs", "vitamins"]         },
            { name: "Moong Dal Soup + Roti", tags: ["protein", "light", "simple"]       },
            { name: "Masoor Dal + Rice",  tags: ["protein", "iron", "simple"]           },
            { name: "Palak Paneer + Roti",tags: ["iron", "calcium"]           }
        ]
    },
    indian_nonveg: {
        breakfast: [
            { name: "Egg Bhurji + Roti",  tags: ["protein", "carbs", "simple"]          },
            { name: "Omelette + Toast",   tags: ["protein", "carbs", "simple"]          },
            { name: "Boiled Egg + Poha",  tags: ["protein", "carbs", "light", "simple"] },
            { name: "Egg Paratha",        tags: ["protein", "carbs"]          },
            { name: "Chicken Sandwich",   tags: ["protein", "carbs"]          },
            { name: "Egg Dosa",           tags: ["protein", "carbs"]          }
        ],
        lunch: [
            { name: "Chicken Curry + Rice",tags: ["protein", "carbs"]         },
            { name: "Egg Curry + Roti",   tags: ["protein", "carbs", "simple"]          },
            { name: "Mutton Keema + Rice",tags: ["protein", "iron"]           },
            { name: "Fish Curry + Rice",  tags: ["protein", "omega-3"]        },
            { name: "Chicken Biryani",    tags: ["protein", "carbs"]          },
            { name: "Prawn Masala + Rice",tags: ["protein", "omega-3"]        },
            { name: "Dal + Chicken Roti", tags: ["protein", "fiber", "simple"]          }
        ],
        dinner: [
            { name: "Grilled Chicken + Roti", tags: ["protein", "low-fat"]   },
            { name: "Egg Fried Rice",     tags: ["protein", "carbs"]          },
            { name: "Chicken Soup + Bread",tags: ["protein", "light", "simple"]         },
            { name: "Baked Fish + Veggies",tags: ["protein", "omega-3"]       },
            { name: "Mutton Curry + Rice",tags: ["protein", "carbs"]          },
            { name: "Chicken Khichdi",    tags: ["protein", "light", "simple"]          }
        ]
    },
    mixed: {
        breakfast: [
            { name: "Poha",               tags: ["carbs", "light", "simple"]            },
            { name: "Egg Bhurji + Roti",  tags: ["protein", "carbs", "simple"]          },
            { name: "Idli with Sambar",   tags: ["carbs", "protein", "simple"]          },
            { name: "Omelette + Toast",   tags: ["protein", "carbs", "simple"]          },
            { name: "Upma",               tags: ["carbs", "vitamins", "simple"]         },
            { name: "Moong Dal Chilla",   tags: ["protein", "fiber", "simple"]          },
            { name: "Aloo Paratha",       tags: ["carbs", "energy"]           },
            { name: "Chicken Sandwich",   tags: ["protein", "carbs"]          }
        ],
        lunch: [
            { name: "Dal Roti",           tags: ["protein", "carbs", "simple"]          },
            { name: "Chicken Curry + Rice",tags: ["protein", "carbs"]         },
            { name: "Rajma Chawal",       tags: ["protein", "fiber"]          },
            { name: "Egg Curry + Roti",   tags: ["protein", "carbs", "simple"]          },
            { name: "Paneer Sabzi + Roti",tags: ["protein", "calcium"]        },
            { name: "Fish Curry + Rice",  tags: ["protein", "omega-3"]        },
            { name: "Sambar Rice",        tags: ["protein", "fiber", "simple"]          },
            { name: "Chicken Biryani",    tags: ["protein", "carbs"]          }
        ],
        dinner: [
            { name: "Khichdi",            tags: ["light", "protein", "simple"]          },
            { name: "Grilled Chicken + Roti", tags: ["protein", "low-fat"]   },
            { name: "Sabzi Roti",         tags: ["fiber", "vitamins", "simple"]         },
            { name: "Egg Fried Rice",     tags: ["protein", "carbs"]          },
            { name: "Dal Tadka + Rice",   tags: ["protein", "carbs", "simple"]          },
            { name: "Baked Fish + Veggies",tags: ["protein", "omega-3"]       },
            { name: "Palak Paneer + Roti",tags: ["iron", "calcium"]           }
        ]
    }
};

var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
