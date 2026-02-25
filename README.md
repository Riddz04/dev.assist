# Dev.Assist - Resource Curator for Developers

A modern web application that helps developers discover, organize, and curate the best resources from across the web, tailored to their specific project needs.

## 🚀 Features

- **🔍 Smart Resource Discovery**: Find curated developer resources, tutorials, and tools
- **📁 Project Management**: Create and organize projects with specific requirements
- **🎯 Personalized Recommendations**: Get resources matched to your tech stack and needs
- **🔐 Secure Authentication**: Email, Google, and GitHub OAuth support
- **📱 Responsive Design**: Beautiful mobile-first interface
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

### Backend & Services
- **Firebase** - Authentication and real-time database
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Motion** - Smooth animations and transitions

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Header, Footer, Layout components
│   ├── projects/       # Project-specific components
│   └── ui/            # Base UI components (Radix-based)
├── contexts/           # React Context providers
├── pages/             # Route components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Main dashboard
│   └── projects/      # Project management pages
├── services/          # Business logic layer
│   ├── authService.ts # Firebase auth handling
│   └── projectService.ts # Project CRUD operations
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── config/            # Configuration files
```

## 🏗️ Architecture

**Client-Side SPA with Service Layer Architecture**

The application follows a clean separation of concerns:

1. **UI Layer** (Components/Pages) - Handle display and user interactions
2. **Context Layer** (React Context) - Manage global state (authentication)
3. **Service Layer** (Services) - Business logic and API calls
4. **Data Layer** (Firebase) - Persistent storage and authentication

```
Components → Context → Services → Firebase
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Riddz04/dev.assist.git
   cd dev.assist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your Firebase credentials in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email, Google, GitHub providers)
3. Set up Firestore Database
4. Copy your Firebase configuration to `.env`

### Build Configuration

The project uses Vite for optimal development experience:

- **Hot Module Replacement** for instant updates
- **TypeScript support** out of the box
- **Path aliases** (`@/` maps to `src/`)
- **Environment variables** with `VITE_` prefix

## 🎨 UI Components

The application uses a combination of:

- **TailwindCSS** for styling and layout
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent icons
- **Motion** for smooth animations

### Component Structure

```typescript
// Example component structure
interface ComponentProps {
  // Type-safe props
}

const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Component logic
  
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};
```

## 🔐 Authentication

The app supports multiple authentication methods:

- **Email/Password** - Traditional authentication
- **Google OAuth** - One-click Google login
- **GitHub OAuth** - Developer-friendly GitHub login

### Authentication Flow

1. User initiates login
2. `authService` handles Firebase authentication
3. `AuthContext` updates global state
4. Protected routes become accessible
5. User data persisted in Firebase

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  features: Feature[];
  userId?: string;
}
```

### Resource
```typescript
interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  status: ResourceStatus;
  description?: string;
}
```

## 🌟 Key Features Explained

### Resource Curation
- **Smart Filtering**: Resources categorized by type (documentation, tutorials, repositories, templates)
- **Status Tracking**: Mark resources as unread, read, used, or broken
- **Community-Driven**: Best resources rated and reviewed by developers

### Project Management
- **Feature-Based Organization**: Group resources by project features
- **Quick Access**: Dashboard shows all projects and their status
- **Collaborative**: Share projects with team members

### Search & Discovery
- **Intelligent Search**: Find resources across all projects
- **Tag-Based Filtering**: Filter by technology, difficulty, or type
- **Personalized Recommendations**: Get suggestions based on your project needs

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - **Vercel**: `npx vercel`
   - **Netlify**: Drag and drop the `dist` folder
   - **Firebase Hosting**: `firebase deploy`

### Environment Variables

Ensure all production environment variables are set:
- Firebase configuration
- API keys (if using external services)
- Analytics tracking codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic HTML elements
- Write component documentation
- Test on multiple screen sizes
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Vercel** - For the Vite build tool
- **TailwindCSS** - For the utility-first CSS framework
- **Firebase** - For the backend services
- **Radix UI** - For accessible component primitives

## 📞 Support

If you have any questions or need support:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/Riddz04/dev.assist/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Riddz04/dev.assist/discussions)

---

**Built with ❤️ for developers by developers**
