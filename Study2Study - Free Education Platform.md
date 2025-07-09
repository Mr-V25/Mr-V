Study2Study - Free Education Platform
Overview
Study2Study is a Flask-based web application that provides free educational courses and resources. The platform offers a comprehensive learning management system with course browsing, lesson viewing, resource downloads, and user progress tracking. The application follows a traditional web architecture with server-side rendering and uses an in-memory data store for simplicity.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Template Engine: Jinja2 templates with Bootstrap-based responsive design
Styling: Bootstrap 5 with dark theme and custom CSS for enhanced user experience
JavaScript: Vanilla JavaScript for interactive features and form enhancements
Icons: Feather Icons for consistent iconography
Responsive Design: Mobile-first approach with Bootstrap grid system
Backend Architecture
Framework: Flask (Python web framework)
Application Structure: Modular design with separate files for routes, models, and data management
Session Management: Flask sessions with configurable secret key
Middleware: ProxyFix for handling proxy headers
Error Handling: Flash messaging system for user feedback
Data Storage Solution
Primary Storage: In-memory data store using Python dictionaries
Data Models: Dataclasses for Course, Lesson, Resource, and UserProgress entities
Data Persistence: Currently uses sample data initialization (no permanent storage)
Future Consideration: Architecture supports easy migration to database systems
Key Components
Models (models.py)
Course: Contains course metadata, lessons, and instructor information
Lesson: Individual lesson content with duration and ordering
Resource: Downloadable materials with file metadata
UserProgress: Tracks user completion status and progress percentages
Data Management (data_store.py)
DataStore Class: Centralized data management with CRUD operations
Sample Data: Pre-populated courses in Mathematics and other subjects
Filtering: Subject and difficulty-based course filtering
Search: Course and content search functionality
Routing (routes.py)
Public Routes: Home, courses, course details, lessons, resources, contact, search
Session Management: User progress tracking with session-based identification
Filter Support: Dynamic filtering for courses and resources
Error Handling: Graceful handling of missing content with user feedback
Frontend Templates
Base Template: Common layout with navigation, search, and footer
Course Views: Comprehensive course listing and detail pages
Lesson Interface: Individual lesson viewing with progress tracking
Resource Library: Downloadable materials with category filtering
Contact Form: User feedback and inquiry system
Data Flow
User Navigation: Users browse courses through filtered listings or search
Course Selection: Detailed course view shows lessons and instructor information
Lesson Access: Individual lessons display content with progress tracking
Progress Tracking: Session-based progress storage for user experience continuity
Resource Access: Downloadable materials organized by category
Search Functionality: Full-text search across courses and content
External Dependencies
Frontend Dependencies
Bootstrap 5: UI framework loaded via CDN with dark theme
Feather Icons: Icon library for consistent visual elements
Custom CSS: Enhanced styling for improved user experience
Backend Dependencies
Flask: Core web framework
Werkzeug: WSGI utilities and middleware support
Python Standard Library: Datetime, typing, logging, and os modules
Development Dependencies
Logging: Built-in Python logging for debugging and monitoring
Environment Variables: Configuration through environment variables
Deployment Strategy
Current Setup
Development Server: Flask development server with debug mode
Host Configuration: Configured for 0.0.0.0:5000 for container compatibility
Environment: Uses environment variables for sensitive configuration
Proxy Support: ProxyFix middleware for deployment behind reverse proxies
Production Considerations
Database Migration: Easy transition from in-memory to persistent storage
Static Assets: Current setup serves static files through Flask
Session Security: Configurable session secret for production deployment
Scalability: Architecture supports horizontal scaling with external data store
Security Features
Session Management: Secure session handling with configurable keys
Input Validation: Form validation and sanitization
Error Handling: Graceful error management without information disclosure
CSRF Protection: Framework support for cross-site request forgery prevention
The application is designed for easy deployment and scaling, with clear separation of concerns and modular architecture that supports future enhancements and database integration.