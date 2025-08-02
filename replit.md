# Overview

This is a real-time chat application built with a modern full-stack architecture. The application features a React frontend with a WhatsApp-inspired design and an Express.js backend with in-memory storage. Users can join chat rooms with a simple username/password authentication system and exchange messages in real-time through polling-based updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for authentication state, TanStack Query for server state management
- **UI Framework**: Radix UI primitives with Tailwind CSS for styling, following the shadcn/ui component system
- **Design System**: WhatsApp-inspired color scheme with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage implementation using Maps for users and messages
- **API Design**: RESTful endpoints for authentication and message operations
- **Real-time Updates**: Polling-based approach (3-5 second intervals) instead of WebSockets

## Authentication & Authorization
- **Simple Password System**: Hardcoded password "456" for all users
- **Username Uniqueness**: Prevents duplicate usernames for online users
- **Session Management**: No persistent sessions - users remain online until page refresh
- **Join/Leave Messages**: System automatically generates join/leave notifications

## Data Models
- **Users**: ID, username, online status, last seen timestamp
- **Messages**: ID, content, sender info, timestamp, message type (message/join/leave)
- **Validation**: Zod schemas for runtime type checking and API validation

## Development Experience
- **Hot Reload**: Vite HMR for instant development feedback
- **Error Handling**: Runtime error overlay in development
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Path Aliases**: Organized imports with @ prefixes for cleaner code structure

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (configured but using in-memory storage)
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect configuration
- **drizzle-zod**: Schema validation integration between Drizzle and Zod

## UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolvers

## Development Tools
- **vite**: Build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Static type checking
- **wouter**: Lightweight routing library

## Utility Libraries
- **zod**: Runtime schema validation
- **date-fns**: Date manipulation utilities
- **clsx & tailwind-merge**: Conditional CSS class handling
- **class-variance-authority**: Component variant management

## Database Configuration
- **PostgreSQL**: Configured with Drizzle but not actively used (in-memory storage preferred)
- **Migration Setup**: Database migration structure in place for future PostgreSQL integration
- **Connection**: Environment variable based database URL configuration