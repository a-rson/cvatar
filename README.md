# Cvatar

Asynchroniczny chatbot do rozmowy z kandydatem na podstawie jego CV. Projekt MVP pokazujący podejście do budowania prostych narzędzi rekrutacyjnych z użyciem AI.

## Co to robi?

Cvatar pozwala wygenerować link z kodem QR, który rekruter może zeskanować, żeby porozmawiać z Twoim "botem CV". Bot odpowiada tylko na podstawie danych, które mu dostarczysz.

## Stack technologiczny

- **Frontend**: React + Vite + Tailwind + Zustand
- **Backend**: Fastify (Node.js) + TypeScript
- **Baza danych**: PostgreSQL + Prisma
- **AI**: OpenAI API (prompt zbudowany z danych użytkownika)
- **Sesje / tokeny**: Redis
- **Dev Tools**: Docker, Git, CI/CD

## Jak odpalić?

Zakładamy, że masz Node 18+ i Docker.

### Frontend
```bash
cd frontend
npm install
npm run dev

### Frontend
cd backend
npm install
npm run dev

### Docker
docker-compose up --build