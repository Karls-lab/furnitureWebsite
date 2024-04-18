# Deploy with `firebase deploy`
import firebase_admin
from firebase_admin import auth

# Initialize the Firebase Admin SDK
cred = firebase_admin.credentials.Certificate('/home/x1b3d3ad/furniturewebsite-42a50-firebase-adminsdk-90grf-a3d2518150.json')
firebase_admin.initialize_app(cred)

# Retrieve all user records
users = auth.list_users()

# Print user information including custom claims
for user in users.users:
    print(f'User ID: {user.uid}')
    print(f'Email: {user.email}')
    print(f'Custom Claims: {user.custom_claims}')
    if user.custom_claims and 'role' in user.custom_claims:
        print(f'Role: {user.custom_claims["role"]}')
    print()

