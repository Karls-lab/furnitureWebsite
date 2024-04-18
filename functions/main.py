# Deploy with `firebase deploy`
import firebase_admin
from firebase_admin import auth

# Initialize the Firebase Admin SDK
cred = firebase_admin.credentials.Certificate('/home/x1b3d3ad/furniturewebsite-42a50-firebase-adminsdk-90grf-a3d2518150.json')
firebase_admin.initialize_app(cred)

# Function to update user role
def update_user_role(user_id, role):
    try:
        # Set custom claim for user role
        auth.set_custom_user_claims(user_id, {'role': role})
        print(f"User role updated successfully for user with ID: {user_id}")
    except Exception as e:
        print(f"Error updating user role: {e}")

# Example usage
if __name__ == '__main__':
    user_id = input("Enter the user ID: ")
    role = input("Enter the new role: ")
    update_user_role(user_id, role)

