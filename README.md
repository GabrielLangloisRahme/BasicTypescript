# MaintainX take-home project

## Tech & setup

When you setup this project (see "Get Started" in the next section), we provide you with some modules, tooling, data and an example by default.

### Modules

These are the most important modules that get installed by default:

- TypeScript (https://www.typescriptlang.org/docs/home.html)
- React (https://reactjs.org/docs/getting-started.html)
- React Router (https://reacttraining.com/react-router/web/guides/quick-start)
- Express (https://expressjs.com/en/guide)

### Tooling

The setup comes ready with all the tooling that bundles your assets in the frontend (through Webpack) and compiles your code from TypeScript to JavaScript on the fly in the backend.

### Data structure & data provided

The setup comes with a SQL table structure in place, with the following tables (and some populated data):

- Table with work orders: id, name, status (OPEN, CLOSED)
- Table with users: id, name, email
- Table with work order assignees: id, work_order_id, user_id

The detailed structure (with column types and such) can be found in `db.ts`.

We use in-memory SQLite for the small scope of this project, but we do provide a data.sql if you want to import the same data in a local MySQL database. You would need to rewrite `db.ts` to connect to your local server. (You can install a third-party driver, such as https://github.com/mysqljs/mysql, for this)

### Example

The setup comes with an home page with basic styling and an example frontend page using routing and making a fetch call to the backend.

## What we're asking

- Add a simple console output in the backend such that every HTTP request outputs the following:
  - Date/time (format not important)
  - HTTP method
  - Path requested
  - Status code of response
- Remove the /example page and code associated (including backend)
- Create a new page /workorders where you have a list of work orders, with open work orders shown first:
  - Each list item should have the name and status of the work orders, and a link to a /workorders/:id page with details for that work order
- Work order details page should include:
  - Name of work order
  - Status of work order
  - List of assignee names: when hovering a name, a small tooltip with that user's email address
  - Button to toggle open/close status of that work order
- "Create work order" page accessible from list with route /workorders/new, should include:
  - Form with the following fields:
    - Name of work order
    - List of assignees (can add 0 to n, cannot double-add)
  - Form should be user-friendly and have some basic input validation
- Create a new page /productivity that lists users that aren't assigned to an OPEN work order
- Along the way, create the relevant backend endpoints/interfaces as needed

## Guidelines

- Backend endpoints should leverage "sql" utility to access/modify data. (see example)
- Don't hesitate to refactor/split in files, utilities, etc. In fact, we encourage it.
- Avoid installing/using new third-party modules.
- Comments are encouraged to explain concerns/decisions/etc.
- The CSS/stylings provided are only a base, feel free to add, remove, re-style anything you want. 

## Get started

### Prerequesites

- NodeJS 10.x or newer
- `yarn` (https://yarnpkg.com/lang/en/docs/install/)

### Commands

- Run `yarn install` in the root directory to install the necessary packages
- Run `yarn start` to start the backend server & frontend assets.
  - The backend server will restart automatically when it detects changes.
  - The frontend provider will hot-reload any changes made into the page.
