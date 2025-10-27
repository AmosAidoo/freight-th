# Freight Shipment Footprint
A simple app that takes a CSV containing freight shipments and processes them through the provided API.

## Screenshot
![Results Dashboard](/public/screenshot.png "Results Dashboard")

## Technologies
- TypeScript
- Next.js
- Tailwind CSS
- Papa Parse
- shadcn/ui
- @tanstack/react-table

## Features
- CSV Upload with manual remap of columns.
- Ability to do inline edits on errored cells.
- Table view of CO2 emissions with summary breakdowns.
- Export of results.

## Running the project
### Environmental Variables
```
CLIMATIQ_API_KEY=
```

## Running
You should have Node.js v20.9 or above. 
After cloning the project, and entering the directory, just run:
```bash
npm install
npm run dev
```
This should install the dependencies and start a development server.

### Tests
Run `npm run test` to run the included tests.

## Decisions
- For the scope of the project, I kept the main app page simple. Everything is on a single route with different components being rendered conditionally. The components being rendered in the manner are:
	- `CsvUpload`: The first component rendered for uploading the CSV file.
	- `DataOnboardingStep`: The second component rendered after the CSV file has been rendered successfully.
	- `NavBar`, `ValidationSummary`, `ProcessingSummary` and `DataTable`: These together form the Results Dashboard.
- I kept the main Page component very lean by moving shipment processing and statistics logics into custom hooks and creating resuable components inside `/components`. Utility functions for csv parsing, validation and exports are inside the `/lib` directory. It makes it easier to test such functionalities in isolation and resuse them across the entire project.
- The freight API call is done inside Route Handler, which is completely server side. It keeps things clean and something like the API key used in the project will never have to be exposed to the client.
- I used Papa Parse because CSV parsing is complex and it makes sense to use an already existing robust solution given the time.
- I wrote a simple validator without relying on an external library like `zod` because the schema involved here is very simple and a handwritten validator works fine here. As such I did write tests for the validator.
- I used `@tanstack/react-table` to render the results on the Results Dashboard. It makes adding features like sorting, filtering, etc very seamless avoiding repetitive and error prone methods.