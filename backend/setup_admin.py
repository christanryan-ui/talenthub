"""
Setup script to create super admin user
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def setup_admin():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({'email': 'contact@bisgensolutions.com'})
    
    if existing_admin:
        print("Super admin already exists!")
        return
    
    # Create super admin
    from models import User, UserRole
    import uuid
    from datetime import datetime
    
    admin_user = User(
        id=str(uuid.uuid4()),
        email='contact@bisgensolutions.com',
        phone=None,
        role=UserRole.ADMIN,
        is_verified=True,
        is_active=True,
        credits_free=0,
        credits_paid=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    await db.users.insert_one(admin_user.dict())
    print("Super admin created successfully!")
    print(f"Email: contact@bisgensolutions.com")
    print("Use magic link to login")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(setup_admin())
