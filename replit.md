# VoiceKeeper - AI Voice Preservation Platform

## Overview

VoiceKeeper is a full-stack web application that allows users to preserve and interact with the voices of their loved ones using AI technology. The platform enables users to upload audio recordings, train personalized voice models, and have meaningful conversations through AI-powered chat with text-to-speech capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript running on Vite
- **Routing**: Wouter for client-side routing
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured error handling
- **Middleware**: Request logging, JSON parsing, authentication middleware

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit OIDC authentication
- **Sessions**: PostgreSQL-based session storage with connect-pg-simple
- **Security**: HTTP-only cookies, CSRF protection, secure session management
- **User Management**: Automatic user creation/updates from OIDC claims

### File Upload System
- **Storage**: Local file system with multer middleware
- **Validation**: Audio file type checking, size limits (50MB)
- **Processing**: Audio quality assessment and metadata extraction
- **Security**: Authenticated uploads only, file type restrictions

### AI Integration
- **Chat AI**: OpenAI GPT-4o for conversation generation
- **Personality**: Customizable AI personality based on user-defined traits, memories, and preferences
- **Context**: Dynamic system prompts incorporating loved one's characteristics
- **TTS**: Mock text-to-speech service (ready for ElevenLabs/PlayHT integration)

### Voice Processing
- **Training Data**: Audio file management with quality scoring
- **Voice Models**: User-specific voice model tracking and status
- **Audio Playback**: Client-side audio controls with progress tracking

## Data Flow

### Authentication Flow
1. User initiates login via `/api/login`
2. Redirects to Replit OIDC provider
3. Callback processes tokens and creates/updates user
4. Session stored in PostgreSQL
5. Client receives authenticated session

### Upload Flow
1. Client uploads audio file via multipart form
2. Server validates file type and size
3. File saved to local storage with unique filename
4. Database record created with metadata
5. Optional voice model training status update

### Chat Flow
1. User sends message through chat interface
2. Server retrieves personality configuration
3. AI generates response using OpenAI API
4. Response saved to database as message
5. Optional TTS generation for audio response
6. Client receives message with audio URL

### Memory Capsule Flow
1. Chat conversations automatically saved
2. Memory capsules created from significant conversations
3. Categorization by content and metadata
4. Retrieval for replay and reminiscence

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **express**: Web server framework
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Accessible UI components
- **tailwindcss**: Utility-first CSS framework

### Authentication
- **openid-client**: OIDC authentication with Replit
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### File Processing
- **multer**: File upload handling
- **@types/multer**: TypeScript definitions

### AI Services
- **openai**: OpenAI API client for chat generation
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit integration

## Deployment Strategy

### Development Environment
- **Build**: Vite for frontend bundling
- **Server**: tsx for TypeScript execution
- **Hot Reload**: Vite HMR for frontend, nodemon-like reload for backend
- **Error Handling**: Runtime error overlay in development

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Serving**: Express serves built frontend files
- **Process**: Single Node.js process serving both API and static files

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Sessions**: `SESSION_SECRET` for session encryption
- **Auth**: `REPL_ID`, `ISSUER_URL` for OIDC configuration
- **AI**: `OPENAI_API_KEY` for OpenAI API access
- **Domains**: `REPLIT_DOMAINS` for CORS and security

### Scaling Considerations
- **Database**: Neon serverless PostgreSQL auto-scales
- **File Storage**: Local storage suitable for development (consider cloud storage for production)
- **Sessions**: PostgreSQL-based sessions support horizontal scaling
- **AI Services**: External APIs handle scaling automatically