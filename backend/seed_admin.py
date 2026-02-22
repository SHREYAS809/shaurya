import os
import random
import string
from supabase_client import supabase
from dotenv import load_dotenv

load_dotenv()

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

def seed_admin():
    admin_email = "admin@shaurya.com"
    # In a real scenario, you'd want to set a secure password
    admin_password = "AdminPassword123!" 
    
    print(f"Attempting to create admin user: {admin_email}")
    
    try:
        # Check if user already exists (indirectly via create_user which will fail if exists)
        response = supabase.auth.admin.create_user({
            "email": admin_email,
            "password": admin_password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": "System Administrator",
                "phone": "0000000000",
                "role": "admin"
            }
        })
        print(f"Successfully created admin user!")
        print(f"Settings: Email: {admin_email}, Password: {admin_password}")
        return True
    except Exception as e:
        if "already exists" in str(e).lower() or "already registered" in str(e).lower():
            print(f"Admin user {admin_email} already exists.")
            return True
        else:
            print(f"Error creating admin user: {e}")
            return False

if __name__ == "__main__":
    seed_admin()
