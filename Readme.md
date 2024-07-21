# Bitespeed Backend Task: Identity Reconciliation

This project implements a backend service for FluxKart.com that handles identity reconciliation for customer contacts. The service identifies and links different orders made with different contact information to the same customer.

## Requirements

- Node.js (v14 or higher)
- PostgreSQL
- npm (v6 or higher)

## project structure

  src/
├── controllers/
│   └── contact_controller.ts
├── models/
│   └── contact.ts
├── routes/
│   └── index.ts
├── services/
│   └── contact_service.ts
├── config/
│   └── database.ts
├── app.ts
└── server.ts
