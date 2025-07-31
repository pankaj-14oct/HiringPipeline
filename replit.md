# HireFlow - Applicant Tracking System

## Overview

HireFlow is a full-stack applicant tracking system (ATS) built with a modern tech stack. The application provides comprehensive hiring management capabilities including job postings, candidate management, interview scheduling, assessments, and offer letter generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL sessions
- **API Design**: RESTful endpoints with JSON responses

### Project Structure
- **Monorepo**: Single repository with shared code
- **Client**: React frontend in `/client` directory
- **Server**: Express backend in `/server` directory
- **Shared**: Common schemas and types in `/shared` directory

## Key Components

### Database Schema
The application uses a comprehensive schema with the following entities:
- **Users**: HR personnel, recruiters, interviewers, and candidates
- **Jobs**: Job postings with descriptions, requirements, and status
- **Candidates**: Applicant profiles with skills, experience, and documents
- **Applications**: Links candidates to jobs with status tracking
- **Interview Panels**: Groups of interviewers for specific jobs
- **Interviews**: Scheduled interview sessions with feedback
- **Assessments**: Technical or skills-based evaluations
- **Assessment Submissions**: Candidate responses to assessments
- **Offer Letters**: Job offers with terms and status tracking

### Frontend Components
- **Layout**: Sidebar navigation with header component
- **Pages**: Dashboard, Jobs, Candidates, Interviews, Assessments, Panels, Offers, Candidate Portal
- **Modals**: Form dialogs for creating jobs, candidates, interviews, assessments, and offers
- **UI Components**: Comprehensive shadcn/ui component library
- **Charts**: Custom stats cards and pipeline visualization

### Backend Services
- **Storage Layer**: Abstracted database operations with TypeScript interfaces
- **Route Handlers**: RESTful API endpoints for all entities
- **Middleware**: Request logging, error handling, and development tools
- **Database Connection**: Neon serverless PostgreSQL with connection pooling

## Data Flow

### Client-Server Communication
1. **Frontend**: React components use TanStack Query for data fetching
2. **API Layer**: Express routes handle HTTP requests with validation
3. **Storage**: Drizzle ORM manages database operations
4. **Database**: PostgreSQL stores all application data

### State Management
- **Server State**: TanStack Query handles caching, loading states, and mutations
- **Form State**: React Hook Form manages form data and validation
- **UI State**: Local React state for modals, search filters, and selections

### Authentication Flow
The application is prepared for authentication with user roles (HR, recruiter, interviewer, candidate) but currently uses placeholder user IDs for development.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Router (Wouter), React Hook Form
- **Styling**: Tailwind CSS, Radix UI primitives, Lucide React icons
- **Backend**: Express.js, Drizzle ORM, Neon Database driver
- **Validation**: Zod for schema validation
- **Development**: Vite, TypeScript, ESBuild

### UI Component Library
- **shadcn/ui**: Complete component system with Radix UI primitives
- **Design System**: Consistent theming with CSS variables
- **Accessibility**: Built-in ARIA support through Radix components

### Database Integration
- **Neon Serverless**: PostgreSQL database with WebSocket support
- **Drizzle Kit**: Database migrations and schema management
- **Connection Pooling**: Efficient database connections

## Deployment Strategy

### Development Setup
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution in development
- **Database**: Drizzle migrations with push commands

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild creates bundled Node.js application
- **Database**: Production PostgreSQL via Neon serverless
- **Static Serving**: Express serves built frontend assets

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Build Output**: Separate client and server build artifacts
- **Asset Handling**: Vite handles asset optimization and bundling

The application follows modern web development practices with type safety, component reusability, and scalable architecture patterns.

## Recent Changes (July 31, 2025)

### Enhanced Candidate Profile Management
- **Dynamic Skills Management**: Skills can now be added dynamically by typing and pressing comma or enter
- **Skill Tags**: Skills display as removable badges with delete functionality
- **Resume Upload**: Added file upload capability for PDF, DOC, DOCX, and TXT files
- **Dual Resume Input**: Support for both file upload and manual text entry
- **Improved UX**: Enhanced visual feedback and form validation
- **TypeScript Fixes**: Resolved all form validation errors across modal components

### View Functionality Enhancements
- **Assessment Details**: Added comprehensive assessment view modal with question display
- **Offer Letter Preview**: Added detailed offer view modal with timeline and preview
- **User Interface**: Enhanced modal layouts with scroll areas and better organization

### Advanced Assessment System Implementation
- **Question Bank**: Created comprehensive question bank with 36 technical questions across 7 categories (HTML, CSS, JavaScript, React, Node.js, TypeScript, Database)
- **Enhanced Assessment Modal**: Built advanced assessment creation interface with category selection, difficulty levels, randomization options, and real-time question preview
- **Candidate Assessment Interface**: Developed full-screen assessment taking experience with timer, question navigation, flagging, and auto-grading
- **API Integration**: Added complete question bank API with filtering, bulk import, and assessment generation endpoints
- **Auto-Grading**: Implemented instant scoring with category-wise breakdown and performance analytics
- **Proctoring Features**: Added full-screen mode, tab switching detection, and time-based auto-submission

### Migration to Replit Environment (July 31, 2025)
- **Database Setup**: Successfully configured PostgreSQL database with all required environment variables
- **Dependencies**: Installed and verified all required packages including tsx, Node.js dependencies
- **Schema Migration**: Applied database schema with all tables and relationships using Drizzle ORM
- **Sample Data Import**: Populated database with comprehensive test data including:
  - 4 users (HR, recruiter, interviewer, candidate roles)
  - 5 job postings across different departments and experience levels
  - 6 candidate profiles with varied backgrounds and skills
  - 6 job applications in different stages of the hiring pipeline
  - 4 interview panels and scheduled interviews
  - 4 assessments with different types and configurations
  - 3 assessment submissions with scores and feedback
  - 3 offer letters in various states (draft, sent, accepted)
  - 36 technical questions across 7 categories for the question bank
- **Application Status**: Server running successfully on port 5000 with full functionality
- **Security**: Implemented proper client/server separation and robust security practices

### Enhanced Candidate Job Application System (July 31, 2025)
- **Job Discovery**: Candidates can browse and search through available job postings with filtering capabilities
- **Application Modal**: Rich application dialog showing job details, requirements, salary, and candidate profile
- **Application Tracking**: Prevents duplicate applications and shows application status on job cards
- **Status Management**: Real-time updates of application status with proper visual indicators
- **Candidate Portal Integration**: Seamless integration between job browsing, application submission, and tracking
- **Technical Implementation**: 
  - Enhanced candidate portal with job search and filtering
  - Application submission mutation with error handling
  - Real-time UI updates using TanStack Query
  - Proper TypeScript type safety throughout the flow
  - Toast notifications for user feedback