# Open Court
*Find a court. Join a game. Play more. Search less.*

## Table of Contents
1. [Project Description](#project-description)
2. [The Plan](#the-plan)
3. [Known Issues](#known-issues)
3. [Prerequisites](#prerequisites)
4. [VM Setup](#vm-setup)
5. [Local Setup](#local-setup)
6. [Testing](#testing)

## Project Description
OpenCourt solves the problem of not being able to easily find open play locations for sports like pickleball, basketball, tennis, volleyball, and more.

### Current Features
- Fully Dockerized Stack
    - The entire application (frontend, backend, and database) is containerized with Docker Compose for portability and ease of setup
- Automated Setup Scripts
    - Includes scripts for prepping a new VM and for setting up the application locally or on a VM
- Nginx Reverse Proxy
    - A web container runs Nginx to serve the static React build and act as a reverse proxy for the backend, eliminating CORS issues.
- MySQL database
    - Tables: users, locations, games, and games_users
    - Configured for remote Workbench access on port 3307
    - Runs in its own Docker container
    - Automatically creates tables and seeds data on first launch
- MVC-style API
    - Runs in a Node.js container using PM2 for process management.
    - Basic CRUD functionality (Create/Read) for users, locations, and games.
- React + Vite frontend application 
    - Connects to the proxied /api/ endpoints.
    - Components for Games, Locations, and Users.
    - Simple, responsive UI

## The Plan
- Extend CRUD functionality
    - Update: Change locations, times, players, size of party
    - Delete: Remove events, players
- User profiles, which could include sports they play, rating/level of skill, profile pictures
- Payment links, for court/rental fees, tournament entry fees

### Data Model Planning
**Core Entities**: Events, Users, Location

**Key Relationships**: Users can host Events, Events can have multiples Users, Events have one location, Locations can host multiple events

**CRUD Operations**:
1. Users can create events
2. Users can join events
3. Users can view events and participants
4. Hosts can remove users
5. Hosts can update event details
6. Users can leave events
7. Hosts can delete events

### User Experience

**User Flows**:
A user can either **host** or **participate** in an event. 
- **Hosts**
    - determine the event size, sport, location, and time.
    - can remove players or delete events
- **Participants**
    - can browse and join events.
    - can leave an event anytime.

## Known Issues

There is currently an issue where when an event, location, or user is added to the database, it is not immediately reflected on the website. The user has to refresh the page for the newest addition to display. This is not a Docker Issue and so was not addressed during this Sprint.

## Prerequisites

- Docker Desktop (for Local Development): You must have Docker Desktop installed and running on your local machine to use [setup-local.sh](setup-local.sh)

## VM Setup
1. Open a terminal on your local machine
2. Log into your VM using your IP Address and Password:
    
    ```bash
    ssh root@{vm-ip-address}
    ```
3. Run the following command to update your VM and install Git:

    ```bash
    sudo apt update && sudo apt install git -y && sudo DEBIAN_FRONTEND=noninteractive apt upgrade -yq
    ```
4. Clone the repo:

    ```bash
    git clone https://github.com/kellerflint/OpenCourt.git
    ```

5. CD into the project and make the scripts executable:

    ```bash
    CD OpenCourt/
    chmod +x prepare-vm.sh setup.sh
    ```

6. Run the VM Setup Script:
    - This will install Docker, Compose, Curl, and set the firewall

    ```bash
    sudo ./prepare-vm.sh
    ```

### IMPORTANT: Log out and back in - This is required for your user to be added to the docker group

7. Run the Application Setup Script:
    - This will build your containers, handle .env and nginx.conf configuration, and start your application

    ```bash
    ./setup.sh
    ```

8. Follow Prompts: The script will ask you to enter what passwords you want to use for database access

9. Access Your Application:
    - Website: http://your-vm-ip
    - MySQL Workbench:
        - Host: your-vm-ip
        - Port: 3307
        - Username: app_user
        - Password: The app_user password you chose during setup

## Automated Deployment

OpenCourt uses GitHub Actions for continuous deployment. Whenever code is pushed to the `main` branch, the application automatically deploys to the VM.

### How It Works

The deployment workflow (`.github/workflows/deploy.yml`) performs the following steps:
1. **Checkout Code**: Fetches the latest code from the repository
2. **Set up SSH**: Configures SSH authentication using stored secrets
3. **Deploy to VM**: Connects to the VM and executes deployment commands:
   - Pulls the latest code from the `main` branch
   - Stops running containers
   - Rebuilds and restarts containers with the new code

### Required Secrets

For automated deployment to work, the following GitHub repository secrets must be configured:
- `VM_SSH_KEY`: Your VM's SSH private key (ed25519 format)
- `VM_HOST`: Your VM's IP address or hostname
- `VM_PORT`: SSH port (typically 22)
- `VM_USER`: SSH username for the VM

### Monitoring Deployments

You can monitor deployment status in the "Actions" tab of your GitHub repository. Each push to `main` will trigger a new deployment run.

## Manual Deployment Update

If you need to manually update the application on the VM, you can still use the [update.sh](update.sh) script:

1. SSH into your VM and CD to OpenCourt/
2. Activate and run the script

    ```bash
    chmod +x update.sh
    ./update.sh
    ```

This will pull the latest code and rebuild only the necessary containers. Your database data will be preserved

### IMPORTANT - Deployment scripts do NOT apply database schema changes. To apply changes to tables, you must destroy the database volume and then run docker-compose up -d --build

- Command to destroy database volume

    ```bash
    docker-compose down -v
    ```
### Continuous Integration (CI)

This project uses GitHub Actions to automatically run all tests on every push and pull request.

## CI Workflow

The workflow is located in:

.github/workflows/test.yml

## What CI Runs

- Backend unit tests

- Backend integration tests

- Frontend unit tests (Vitest)

- End-to-end tests

## How It Works

- Checks out the repository

- Sets up Node.js

- Installs backend & frontend dependencies

- Runs all available test scripts

- Fails the workflow if any test fails

## Manual Run

Go to Actions -> CI - Tests -> Run CI on feature/ci-merging -> Re-run all jobs.

## Local Setup
1. Clone the repo:

    ```bash
    git clone https://github.com/kellerflint/OpenCourt.git
    ```
2. Ensure Docker Desktop is running

3. Make script executable and run it:
    - This will build your containers, handle .env and nginx.conf configuration, and start your application

    ```bash
    chmod +x setup-local.sh
    ./setup-local.sh
    ```

4. Follow Prompts: The script will ask you to enter what passwords you want to use for database access

9. Access Your Application:
    - Website: http://localhost
    - MySQL Workbench:
        - Host: localhost
        - Port: 3307
        - Username: app_user
        - Password: The app_user password you set during setup

### Updating Locally

From the root directory, run the following command:

```bash
docker-compose up -d --build
```

This will rebuild the images for the code you changed and restart the containers. Your MySQL database data will be preserved.

If you need to apply changes to the database and reset your data, your must destroy the database volume:

```bash
# This stops and removes containers AND destroys the database volume
docker-compose down -v

# This rebuilds all images and starts fresh containers
docker-compose up -d --build
```

### Restarting Docker

If your application freezes (either on the VM or locally) and there have been no code changes, run the following command to restart Docker:

```bash
docker-compose restart
```

## Testing
OpenCourt includes **unit tests** for both the front and backend, **integration tests** and **end to end tests**.

### Running all Unit & Integration Tests
1. Make sure you followed the steps in [Local Setup](#local-setup) to ensure you have your environment properly set up.
2. Make script executable and run it:
    - This will automatically run all tests and exit any necessary terminals making it fast and easy to quickly run a test.

    ```bash
    chmod +x run-tests.sh
    ./run-tests.sh
    ```

### Running all End to End Tests
A script has been written to help quickly set up a dockerized test environment perfect for end to end testing.

1. Ensure Docker Desktop is running
2. Make script executable and run it:
    - This will automatically run and build all docker containers, handle any database configuration and launch the cypress terminal for you to use.

    ```bash
    chmod +x ./test-scripts/run-e2e-tests.sh
    ./test-scripts/run-e2e-tests.sh
    ```

### Have you already built the test environment and want to just run the end to end tests?
1. Make sure you are in the proper directory for the front-end.
2. Check that the opencourt_test docker container is running.
3. Run the following command in your terminal to run **just** the cypress tests.
```bash
    npm run cypress
```

#### Need to test changes you've made in the code?
```bash
docker-compose -p opencourt_test -f docker-compose.test.yml up -d
```

#### Want to clear the test database to prevent dirty data?
```bash
docker-compose -p opencourt_test down
```

#### Troubleshooting
Here are some common issues you may encounter when running tests:
1. Docker not running
   - Docker **must** be installed and running on your machine for any of these tests to work.
2. template.env or template.nginx.conf not found
   - Make sure these template files exist in the root directory of your project. The E2E and local-setup script depends on it.
