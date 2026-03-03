# Discourse - Real-Time Chat Application

A modern, real-time chatting application built with TypeScript and React. Connect with friends, manage presence status, create and manage private/public group chats with ease.

## Demo

[![Watch the Demo](https://img.youtube.com/vi/ILAn8ZLXPCc/maxresdefault.jpg)](https://www.youtube.com/watch?v=ILAn8ZLXPCc)

*Click the image above to watch a demo of Discourse in action*

---

## Features

🟢 **Presence System**
- Real-time online/offline status for all friends
- Instant presence updates across the app

👥 **Friend Management**
- Add friends and send friend requests
- Accept or decline incoming friend requests
- Maintain a personal friends list

💬 **Group Chats**
- Create private groups for closed-circle conversations
- Create public groups to allow anyone to join
- Real-time message delivery with instant notifications
- Group member management

⚡ **Real-Time Updates**
- Live message synchronization across all clients
- Instant presence updates
- Firebase-powered backend for reliable data sync

🎨 **Modern UI**
- Clean and intuitive interface
- Responsive design with Tailwind CSS
- Smooth user experience with React

---

## Tech Stack

**Frontend:**
- [React](https://react.dev/) 18.2 - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [React Router](https://reactrouter.com/) - Client-side routing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

**Backend:**
- [Firebase](https://firebase.google.com/) - Real-time database, authentication, and hosting
  - Firestore for data storage
  - Firebase Authentication
  - Real-time listeners for live updates

**Developer Tools:**
- TypeScript for type safety
- ESLint for code quality
- PostCSS for CSS processing

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- A Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DharmpreetAtwal/discourse-ts.git
   cd discourse-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Copy your Firebase config
   - Create a `src/config/firebase.ts` file with your Firebase configuration:
     ```typescript
     import { initializeApp } from 'firebase/app';
     import { getFirestore } from 'firebase/firestore';
     import { getAuth } from 'firebase/auth';

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     export const db = getFirestore(app);
     export const auth = getAuth(app);
     ```

### Development

Run the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create an optimized production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality and style:

```bash
npm run lint
```

---

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication UI components
│   ├── friend/            # Friend-related components
│   ├── group/             # Group chat components
│   └── home/              # Home page components
├── hooks/
│   ├── friend/            # Friend-related custom hooks
│   ├── group/             # Group-related custom hooks
│   ├── home/              # Home-related custom hooks
│   └── useEnableOnlinePresence.tsx
├── interfaces/
│   ├── friend/            # Friend type definitions
│   ├── group/             # Group type definitions
│   ├── home/              # Home type definitions
│   └── types.ts           # Shared type definitions
├── config/
│   └── firebase.ts        # Firebase configuration
├── App.tsx                # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

---

## How It Works

### Authentication
- Users sign up and log in through Firebase Authentication
- Authentication state is managed and persisted using cookies

### Presence System
- When a user logs in, their online status is updated in Firestore
- Real-time listeners track when users come online/offline
- Friends can see the live presence status of their contacts

### Messaging
- Messages are stored in Firestore with timestamps
- Real-time listeners ensure new messages appear instantly
- Group messages are organized by group ID

### Group Management
- Users can create new groups and specify visibility (private/public)
- Public groups appear in a directory that anyone can browse and join
- Private groups require an invitation to join

---

## Usage

1. **Sign Up / Log In**
   - Create an account or log in with existing credentials

2. **Add Friends**
   - Send friend requests
   - Accept pending requests

3. **Create a Group**
   - Choose between private (invite-only) or public (open to all)
   - Add initial members
   - Start chatting

4. **Join Public Groups**
   - Browse available public groups on the home page
   - Click to join and start participating

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/DharmpreetAtwal/discourse-ts/issues).

---

## Future Enhancements

- [ ] Message search and filtering
- [ ] Message reactions and emojis
- [ ] Voice and video chat capabilities
- [ ] Message history pagination
- [ ] User blocking functionality
- [ ] Dark mode support
- [ ] Mobile app (React Native)

---

**Made with ❤️ using React, TypeScript, and Firebase**