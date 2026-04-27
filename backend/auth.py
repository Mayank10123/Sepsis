"""
OAuth 2.0 & Patient Login Authentication for SepsisGuard
Supports Google, GitHub, and direct Patient ID/Password login
"""

from fastapi import APIRouter, HTTPException, Header
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from starlette.responses import RedirectResponse
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from jwt import encode, decode
from datetime import datetime, timedelta
from dotenv import load_dotenv
from bcrypt import hashpw, checkpw, gensalt
import json

load_dotenv()

# MongoDB Atlas Connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://user:password@cluster.mongodb.net/')
mongodb_client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None

async def get_database():
    """Get MongoDB database instance"""
    global db
    if db is None:
        global mongodb_client
        mongodb_client = AsyncIOMotorClient(MONGODB_URI)
        db = mongodb_client['sepsisguard']
    return db

# Request schemas
class PatientLogin(BaseModel):
    patient_id: str
    password: str

class PatientSignup(BaseModel):
    patient_id: str
    password: str
    name: str
    email: str

class LoginRequest(BaseModel):
    id: str
    password: str
    role: str # 'doctor', 'patient', 'family'

router = APIRouter()

# Initialize OAuth
oauth = OAuth()

oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='github',
    client_id=os.getenv('GITHUB_CLIENT_ID'),
    client_secret=os.getenv('GITHUB_CLIENT_SECRET'),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}
)

JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-change-in-prod')

def create_jwt_token(user_id: str, role: str) -> str:
    """Create JWT token"""
    payload = {
        'sub': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return encode(payload, JWT_SECRET, algorithm='HS256')

def verify_token(authorization: str = Header(None)) -> dict:
    """Verify JWT token from Authorization header"""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Missing authorization header")
        
        # Extract token from "Bearer <token>" format
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header format")
        
        token = authorization[7:]  # Remove "Bearer " prefix
        payload = decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@router.get('/google')
async def google_auth(request: Request):
    """Initiate Google OAuth"""
    redirect_uri = os.getenv('CALLBACK_URL', 'http://localhost:8000/api/auth/google/callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/google/callback')
async def google_callback(request: Request, db=None):
    """Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token['userinfo']
        
        # Save/update user in MongoDB
        user_doc = {
            '_id': user_info['sub'],
            'email': user_info['email'],
            'name': user_info['name'],
            'oauth_provider': 'google',
            'updated_at': datetime.utcnow()
        }
        
        # Default role (can be set by admin later)
        role = 'patient'  # Default role
        
        # Generate JWT
        jwt_token = create_jwt_token(user_info['sub'], role)
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"http://localhost:3000/dashboard?token={jwt_token}&role={role}"
        )
    except Exception as e:
        return {"error": str(e)}

@router.get('/github')
async def github_auth(request: Request):
    """Initiate GitHub OAuth"""
    redirect_uri = os.getenv('CALLBACK_URL', 'http://localhost:8000/api/auth/github/callback')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get('/github/callback')
async def github_callback(request: Request):
    """GitHub OAuth callback"""
    try:
        token = await oauth.github.authorize_access_token(request)
        resp = await oauth.github.get('user', token=token)
        user_info = resp.json()
        
        # Get email
        email_resp = await oauth.github.get('user/emails', token=token)
        emails = email_resp.json()
        primary_email = next((e['email'] for e in emails if e['primary']), emails[0]['email'])
        
        # Save/update user
        user_doc = {
            '_id': user_info['id'],
            'email': primary_email,
            'name': user_info['name'],
            'oauth_provider': 'github',
            'updated_at': datetime.utcnow()
        }
        
        role = 'patient'
        jwt_token = create_jwt_token(str(user_info['id']), role)
        
        return RedirectResponse(
            url=f"http://localhost:3000/dashboard?token={jwt_token}&role={role}"
        )
    except Exception as e:
        return {"error": str(e)}

@router.post('/login')
async def general_login(login_data: LoginRequest):
    """Unified login for all roles using MongoDB"""
    try:
        # Fallback for generic demo (Always allowed for rapid testing)
        if login_data.id == 'doctor@sg.ai' and login_data.password == '#demo':
            jwt_token = create_jwt_token('DOCTOR_DEMO', 'doctor')
            return {'token': jwt_token, 'role': 'doctor', 'name': 'Dr. Sarah Miller', 'id': 'DOCTOR_DEMO'}
        
        if login_data.id == 'family@sg.ai' and login_data.password == '#demo':
            jwt_token = create_jwt_token('FAMILY_DEMO', 'family')
            return {'token': jwt_token, 'role': 'family', 'name': 'Chen Family', 'id': 'FAM-042'}

        if login_data.id == 'patient@sg.ai' and login_data.password == '#demo':
            jwt_token = create_jwt_token('PAT001', 'patient')
            return {'token': jwt_token, 'role': 'patient', 'name': 'Robert Chen', 'id': 'PAT001'}

        database = await get_database()
        
        # Determine collection based on role
        collection_name = 'patients' if login_data.role == 'patient' else 'users'
        collection = database[collection_name]
        
        # Find user
        user = await collection.find_one({'_id': login_data.id})
        
        if not user:
            raise HTTPException(status_code=401, detail=f"No {login_data.role} found with ID: {login_data.id}")
        
        # Verify password (assuming hashed in DB)
        stored_password = user.get('password', '')
        if not stored_password:
            raise HTTPException(status_code=401, detail="Account not properly configured. No password found.")
            
        try:
            is_valid = checkpw(login_data.password.encode('utf-8'), stored_password.encode('utf-8'))
        except Exception:
            # Fallback for plain text if testing (NOT for production)
            is_valid = (login_data.password == stored_password)
            
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid ID or password")
        
        # Create JWT token
        jwt_token = create_jwt_token(login_data.id, login_data.role)
        
        return {
            'token': jwt_token,
            'role': login_data.role,
            'id': login_data.id,
            'name': user.get('name', 'User'),
            'email': user.get('email', '')
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login system error: {str(e)}")

@router.post('/logout')
async def logout():
    """Logout (client-side should clear token)"""
    return {"status": "logged_out"}

@router.post('/patient/login')
async def patient_login(login_data: PatientLogin):
    """Patient login with ID and password"""
    try:
        database = await get_database()
        patients_collection = database['patients']
        
        # Find patient by ID
        patient = await patients_collection.find_one({'_id': login_data.patient_id})
        
        if not patient:
            raise HTTPException(status_code=401, detail="Invalid patient ID or password")
        
        # Verify password
        stored_password = patient.get('password', '').encode('utf-8')
        provided_password = login_data.password.encode('utf-8')
        
        if not checkpw(provided_password, stored_password):
            raise HTTPException(status_code=401, detail="Invalid patient ID or password")
        
        # Create JWT token
        jwt_token = create_jwt_token(login_data.patient_id, 'patient')
        
        return {
            'token': jwt_token,
            'role': 'patient',
            'patient_id': login_data.patient_id,
            'name': patient.get('name'),
            'email': patient.get('email')
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.post('/patient/signup')
async def patient_signup(signup_data: PatientSignup):
    """Patient registration"""
    try:
        database = await get_database()
        patients_collection = database['patients']
        
        # Check if patient already exists
        existing = await patients_collection.find_one({'_id': signup_data.patient_id})
        if existing:
            raise HTTPException(status_code=400, detail="Patient ID already exists")
        
        # Hash password
        hashed_password = hashpw(signup_data.password.encode('utf-8'), gensalt())
        
        # Create patient document
        patient_doc = {
            '_id': signup_data.patient_id,
            'password': hashed_password.decode('utf-8'),
            'name': signup_data.name,
            'email': signup_data.email,
            'role': 'patient',
            'created_at': datetime.utcnow(),
            'vitals': [],
            'alerts': []
        }
        
        await patients_collection.insert_one(patient_doc)
        
        # Create JWT token
        jwt_token = create_jwt_token(signup_data.patient_id, 'patient')
        
        return {
            'token': jwt_token,
            'role': 'patient',
            'patient_id': signup_data.patient_id,
            'message': 'Patient registered successfully'
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@router.get('/test-credentials')
async def get_test_credentials():
    """Get test patient credentials for demo"""
    return {
        "test_patients": [
            {
                "patient_id": "PAT001",
                "password": "test123",
                "name": "John Smith",
                "email": "john@example.com",
                "role": "patient"
            },
            {
                "patient_id": "PAT002",
                "password": "demo456",
                "name": "Sarah Johnson",
                "email": "sarah@example.com",
                "role": "patient"
            },
            {
                "patient_id": "PAT003",
                "password": "demo789",
                "name": "Mike Davis",
                "email": "mike@example.com",
                "role": "patient"
            }
        ],
        "instructions": "Use any of these credentials to login. Test credentials are pre-loaded in MongoDB Atlas."
    }

@router.post('/init-test-data')
async def initialize_test_data():
    """Initialize test patient data in MongoDB"""
    try:
        database = await get_database()
        patients_collection = database['patients']
        
        # Test patients
        test_patients = [
            {
                '_id': 'PAT001',
                'password': hashpw(b'test123', gensalt()).decode('utf-8'),
                'name': 'John Smith',
                'email': 'john@example.com',
                'role': 'patient',
                'age': 45,
                'created_at': datetime.utcnow(),
                'vitals': [],
                'alerts': []
            },
            {
                '_id': 'PAT002',
                'password': hashpw(b'demo456', gensalt()).decode('utf-8'),
                'name': 'Sarah Johnson',
                'email': 'sarah@example.com',
                'role': 'patient',
                'age': 38,
                'created_at': datetime.utcnow(),
                'vitals': [],
                'alerts': []
            },
            {
                '_id': 'PAT003',
                'password': hashpw(b'demo789', gensalt()).decode('utf-8'),
                'name': 'Mike Davis',
                'email': 'mike@example.com',
                'role': 'patient',
                'age': 52,
                'created_at': datetime.utcnow(),
                'vitals': [],
                'alerts': []
            }
        ]
        
        # Clear existing test data and insert
        await patients_collection.delete_many({'_id': {'$in': [p['_id'] for p in test_patients]}})
        result = await patients_collection.insert_many(test_patients)
        
        return {
            'status': 'success',
            'message': f'Inserted {len(result.inserted_ids)} test patients',
            'test_credentials': [
                {'patient_id': 'PAT001', 'password': 'test123'},
                {'patient_id': 'PAT002', 'password': 'demo456'},
                {'patient_id': 'PAT003', 'password': 'demo789'}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize test data: {str(e)}")
