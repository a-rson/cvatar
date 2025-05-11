CVATAR — MVP: Status v1.2
Application Goal

To provide an asynchronous tool for simulated recruitment conversations with an AI bot representing a candidate. The bot responds solely based on the candidate's submitted data, with customizable communication style.
MVP Scope (Implemented)

1.  Profile System (Candidate & Company)

    Candidate profile form: personal data, experience, skills, education, languages, description, soft skills, documents.

    Company profile form: company name, description, services, tech stack, contact info, logo.

    Shared Profile container linked to CandidateProfile or CompanyProfile.

2.  User Accounts & Authorization

    User registration and login (JWT-based)

    Password hashing with bcrypt

    Secure endpoints using verifyJWT middleware

3.  Tokens & QR Codes

    Token generation:

        One-time or time-limited (UUID)

        Stored in Redis with TTL

    Base64 QR code generation linking to a session

4.  Bot & Communication Style

    BotPersona:

        Communication style (e.g., formal, casual)

        Language (e.g., PL/EN)

        Custom intro prompt

    Chat logic based only on candidate profile data

    Conversation logs (ChatLog): message, sender (bot/recruiter), timestamp

5.  Recruiter Interface (Chat UI)

    Entry via token or QR

    Disclaimer: "You are chatting with CVATAR on behalf of user X"

    Session expires on token use or after a time period

6.  User Dashboard (In Progress)

    Interaction history (who chatted, when, with whom)

    Option to delete profile and data (GDPR compliant)

    Regenerate tokens / QR codes

Technical Architecture
Frontend

    React + Vite + TypeScript

    Tailwind CSS + shadcn/ui (Slate theme)

    React Router for navigation

    Role-based UI (Recruiter, Candidate, Company)

Backend (Fastify + TypeScript)

    REST API endpoints:

        /auth (register, login, me)

        /candidate-profile, /company-profile

        /profile (unified access)

        /token (QR system)

    Zod for input validation

    Prisma ORM + PostgreSQL

    Redis for tokens and session control

    Pino for logging (dev/prod support)

AI (to be integrated)

    Prompts dynamically built from profile data

    Configurable communication style and intro

Database (PostgreSQL)

Core models:

    User, Profile, CandidateProfile, CompanyProfile

    WorkExperience, TechStack, Document

    Token, BotPersona, ChatLog

Infrastructure

    Docker Compose (frontend, backend, PostgreSQL, Redis)

    HTTPS (planned via Nginx or Caddy)

    Environment configs via .env files

    CI/CD (planned)

MVP Limitations

    No file upload support (e.g., PDF CV) in UI

    No recruiter login/dashboard (token is sufficient)

    No job-matching or recommendation features

    No mobile app

    No webhooks or ATS API integrations (yet)

Next Steps

    Finalize user dashboard and chat UI

    Integrate AI prompt generation and OpenAI responses

    Improve UX in data entry forms and onboarding motivation

    Support for multilingual and stylistic personalization

    Add security layers (rate limiting, CORS, etc.)

    Build a simple landing page + onboarding flow

Future Vision

    Feedback loop: most common recruiter questions

    Educate users: “How to program your CVATAR”

    Demo or sandbox mode

    Plugin/API support for ATS platforms
