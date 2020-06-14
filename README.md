# video-server-challenge
Backend server challenge

# Prerequisite
1. Docker-compose

# Running the application
1. cd video-server-challenge
2. Run npm install
3. Create .env and add `APP_HOST=<IP OF YOUR DOCKER MACHINE>` `DB_URI=<DB URI>`
4. Run docker-compose up

# Running end to end test
1. Run docker-compose up
2. Open another terminal and run npm run e2e-test

# Running unit test
1. Run npm run unit-test
