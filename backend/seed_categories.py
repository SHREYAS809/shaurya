from supabase_client import supabase

CATEGORIES = [
    {"name": "Analgesics (Pain Relief)", "icon": "💊"},
    {"name": "Antipyretics (Fever Relief)", "icon": "🌡️"},
    {"name": "Antiobiotics", "icon": "🦠"},
    {"name": "Antivirals", "icon": "🛡️"},
    {"name": "Antifungals", "icon": "🍄"},
    {"name": "Cold & Cough", "icon": "🤧"},
    {"name": "Digestion & Gastric", "icon": "🍎"},
    {"name": "Diabetes Management", "icon": "🩸"},
    {"name": "Cardiac & Blood Pressure", "icon": "🫀"},
    {"name": "Respiratory & Asthma", "icon": "🫁"},
    {"name": "Skin Care (Dermatology)", "icon": "🧴"},
    {"name": "Eye Care (Ophthalmic)", "icon": "👁️"},
    {"name": "Ear & Nose Care", "icon": "👂"},
    {"name": "Dental & Oral Care", "icon": "🪥"},
    {"name": "Vitamins & Supplements", "icon": "🥗"},
    {"name": "First Aid & Wound Care", "icon": "🩹"},
    {"name": "Women's Health", "icon": "👩"},
    {"name": "Men's Health", "icon": "👨"},
    {"name": "Pediatric (Baby Care)", "icon": "👶"},
    {"name": "Orthopedic & Joints", "icon": "🦴"},
    {"name": "Ayurvedic & Herbal", "icon": "🌱"},
    {"name": "Neurological Care", "icon": "🧠"},
    {"name": "Surgical Supplies", "icon": "✂️"}
]

def seed_categories():
    print("Seeding medical categories...")
    for cat in CATEGORIES:
        # Check if category exists
        res = supabase.table("categories").select("id").ilike("name", cat["name"]).execute()
        if not res.data:
            supabase.table("categories").insert(cat).execute()
            print(f"Added: {cat['name']}")
        else:
            print(f"Exists: {cat['name']}")
    print("Seeding complete.")

if __name__ == "__main__":
    seed_categories()
