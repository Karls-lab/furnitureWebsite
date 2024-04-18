The file structure and architecture of a React project with Firebase can vary depending on various factors such as the project's complexity, scalability requirements, and personal/team preferences. However, there are some common patterns and best practices followed by many developers:

    Client-side Code (React):
        src/: This folder typically contains all the client-side code, including React components, pages, styles, and utilities.
        index.tsx: The entry point of your React application, where you render the root component (usually App) and initialize any global dependencies like Firebase.
        firebase.ts: A separate file where you initialize Firebase and export its functionalities (e.g., authentication, database) to be used throughout your client-side code.
        components/: Directory for reusable React components.
        pages/: Directory for page components used in routing.
        utils/: Directory for utility functions and helpers.

    Server-side Code (Firebase Functions):
        functions/: This folder contains server-side code written for Firebase Cloud Functions.
        src/: Similar to the client-side src/, this folder typically contains TypeScript code for Firebase Functions.
        index.ts: Entry point for Firebase Functions.
        services/: Directory for Firebase-related services (e.g., Firestore service) used in Cloud Functions.

    Shared Code:
        common/: Directory for shared code between the client and server, such as types/interfaces, constants, and utilities.

    Configuration and Environment:
        .env: File containing environment variables, including Firebase configuration values.
        .firebaserc: Firebase configuration file used by Firebase CLI.
        firebase.json: Firebase hosting and deployment configuration file.

Here's a simplified example of what your project structure might look like
project-root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── firebase.ts
│   │   └── index.tsx
│   ├── .env
│   └── package.json
├── server/
│   ├── functions/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── services/
│   │   └── package.json
│   ├── .env
│   └── firebase.json
├── .firebaserc
└── firebase.json


Orders:
    Orders is a collection in firebase firestore that stores user's orders 
    Editors can view all orders, they are sorted by status
    Status: Pending, Building, Done



TODO:

Create custom claims to my user object that google creates for me 
    - Editors should see orders and update their statuses. 
    - Make a page that displays an item, and allows customized options? 
    - Separate user and editor components
    - Add a shopping cart Item next to Login
    - Create a utility function that caches data for one day