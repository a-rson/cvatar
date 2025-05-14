CVATAR — MVP Status v1.3
Application Goal

CVATAR is an asynchronous recruitment tool where recruiters can chat with an AI bot representing a candidate. The bot responds exclusively based on structured profile data, with customizable communication style and language. The goal is to simulate realistic, on-demand recruitment conversations without requiring the candidate to be live.
MVP Scope (Implemented)
User Accounts & Authorization

    User registration and login (/auth)

    JWT-based authentication

    Password hashing using bcrypt

    Secure endpoints protected by verifyJWT middleware

    Global JWTUserPayload type for consistent request typing

    Role-based access: client, provider, admin

Profile System

    Candidate Profile:

        Personal information, work experience, education

        Tech stack, soft skills, languages, and documents

    Company Profile:

        Company name, description, services, tech stack

        Contact information and logo

    Shared /profile/:id route for unified access to any profile

    Configurable BotPersona per profile (style, language, intro)

Tokens & Access

    Token types:

        One-time or time-limited (UUID-based)

    Tokens stored in Redis with TTL

    Base64 QR code generation for session access

    Token usage logs stored in TokenAccessLog

    /token endpoint for issuing and validating tokens

Bot & Conversation Logic

    AI prompt built from profile data only (no outside context)

    Customizable communication style and language

    Recruiter enters through token or QR link

    Disclaimer shown: "You are chatting with CVATAR on behalf of user X"

    Session ends after one-time token use or time expiry

    Chat messages logged with sender and timestamp in ChatLog

Admin Functionality

    Admin routes (/admin):

        GET /admin/users — list users

        GET /admin/users/:id — fetch specific user

        PUT /admin/users/:id — update user

        DELETE /admin/users/:id — remove user

        GET /admin/logs/token-access — view token access logs

    Protected using requireAdmin middleware

    Deprecated user.ts routes removed

    End-to-end tests for admin flow (admin.flow.test.ts)

Testing

    Flow tests:

        Client (client.flow.test.ts)

        Provider (provider.flow.test.ts)

        Admin (admin.flow.test.ts)

    Docker-based test execution

    Renamed docker-compose.override.yml to avoid auto-usage in normal dev flow

Technical Architecture
Frontend (Planned / Partial)

    React + Vite + TypeScript

    Tailwind CSS and shadcn/ui

    React Router for navigation

    Role-based UI: Candidate, Company, Recruiter

Backend

    Fastify with TypeScript

    REST API endpoints:

        /auth, /candidate-profile, /company-profile

        /profile, /token, /admin

    Zod for input validation

    Prisma ORM for DB access

    PostgreSQL as primary data store

    Redis for token/session handling

    Pino for structured logging

Database Models

    User, Profile, CandidateProfile, CompanyProfile

    WorkExperience, TechStack, Document

    BotPersona, Token, TokenAccessLog, ChatLog

Infrastructure

    Docker Compose setup for:

        Backend, PostgreSQL, Redis

    Config validation via requireEnv helper

    .env for all sensitive config (DB, JWT, Redis, etc.)

    Planned:

        HTTPS support (via Nginx or Caddy)

        CI/CD pipeline integration

Next Steps

    Complete user dashboard and recruiter chat UI

    Integrate AI prompt generation and LLM responses

    Improve data-entry UX and onboarding motivation

    Add multilingual and stylistic personalization

    Implement basic security: rate limiting, CORS
