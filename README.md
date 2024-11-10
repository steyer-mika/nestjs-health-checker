# Health Checker Application

This NestJS application tracks the health of other applications by regularly pinging their health check endpoints. If any health check fails, an email notification is sent via Mailjet. The application also includes a simple frontend, accessible from the root (`/`) route, built with Handlebars (HBS), where you can manage the services to be monitored. The application uses a local JSON file (`db.json`) as a database to store the monitored services.

## Requirements

- Node.js v20.17.0 or higher
- PNPM v8.15.1 or higher

## Getting Started

1. **Clone the Repository**
  `git clone https://github.com/steyer-mika/nestjs-health-checker`
  `cd nestjs-health-checker`

2. **Install Dependencies**
  Use PNPM to install the dependencies:
  `pnpm install`

3. **Configure**
  Clone a `.env.*` file and set the missing variables

4. **Run the Application**
  `pnpm start:dev`
  The application will be accessible at `http://localhost:4200`.

## Usage
* Frontend: Access the frontend at http://localhost:4200 to manage the services to be monitored. You can add, remove, or edit the services in the list.

* Database: The application uses a db.json file located in the /database directory to store service information.