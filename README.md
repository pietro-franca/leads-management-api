# Lead Management API

## Overview
This is a **RESTful API** for managing **leads, groups, and campaigns**, built with:
- **TypeScript**
- **Express** (server)
- **PostgreSQL** (database)
- **Prisma** (ORM)

The API follows **SOLID principles**, ensuring low coupling, high cohesion, and clear separation of concerns across controllers, services, and repositories.

## Features
- **Leads**
  - Create, update, delete, list all, and find by ID
  - Automatically created with status `New` unless specified otherwise
- **Groups**
  - Create, update, delete, list all, and find by ID
  - Add or remove leads from groups
- **Campaigns**
  - Create, update, delete, list all, and find by ID
  - Add or remove leads from campaigns
  - Update lead campaign status
- **Filtering & Pagination**
  - Filter by `name` or `status`
  - Sort by attributes (`name`, `status`, `createdAt`) in ascending or descending order
  - Paginate results with `page` and `pageSize` parameters


## Business Rules
- A **lead** must be created with status `New`, unless explicitly defined otherwise.
- A lead with status `New` must first be updated to `Contacted` before receiving any other status.
- A lead can only be set to `Archived` if its last update was at least **6 months ago**.


## Architecture
The project is organized into:
- **Controllers** → Handle HTTP requests and responses.
- **Services** → Contain business logic and interact with repositories.
- **Repositories/Models** → Handle data persistence with Prisma.

This architecture ensures:
- Clear separation of concerns
- Maintainability
- Scalability
- Testability


## Endpoints (examples)

### Leads
- `GET /leads` → Get all leads  
- `GET /leads/:id` → Get lead by ID  
- `POST /leads` → Create a new lead  
- `PUT /leads/:id` → Update a lead  
- `DELETE /leads/:id` → Delete a lead  

#### Filtering & Pagination (Leads)
`GET /leads?name=John&status=Contacted&sortBy=name&orderBy=asc&page=2&pageSize=5`

| Parameter   | Type     | Description |
|-------------|----------|-------------|
| `name`      | string   | Filter leads by name (case insensitive) |
| `status`    | string   | Filter by status (`New`, `Contacted`, `Archived`, etc.) |
| `sortBy`    | string   | Field to sort by (`name`, `status`, `createdAt`) |
| `orderBy`   | string   | Sort order (`asc` or `desc`) |
| `page`      | number   | Page number (default: `1`) |
| `pageSize`  | number   | Number of items per page (default: `10`) |

**Response Example:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "status": "Contacted",
      "createdAt": "2025-08-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 2,
    "pageSize": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

### Groups 
- `POST /groups/:groupId/leads` → Add a lead to a group 
- `DELETE /groups/:groupId/leads/:leadId` → Remove a lead from a group 

### Campaigns
- `POST /campaigns/:campaignId/leads` → Add a lead to a campaign 
- `PUT /campaigns/:campaignId/leads/:leadId` → Update a lead's campaign status
- `DELETE /campaigns/:campaignId/leads/:leadId` → Remove a lead from a campaign 


## Installation & Setup

1. Clone repository
```bash
git clone https://github.com/pietro-franca/leads-management-api.git 
```
2. Install dependencies
```bash
npm install
```
3. Setup environment variables
```bash
cp .env.example .env
```

4. Run migrations
```bash
npx prisma migrate dev
```

5. Start development server
```bash
npm run dev
```