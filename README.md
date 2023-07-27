
# Scrum Health Checker

The Scrum Health Checker is a user-friendly utility designed to assess and improve Scrum practices. It enables development teams to conduct periodic health checks, evaluating nine key topics such as Sprint Planning, Daily Scrum, Product Backlog, and more.

The team determine if the ten statements per topic are true based on their experiences. The results are visually represented using radar charts, highlighting strengths and areas for improvement. By facilitating self-assessment and fostering continuous learning, this tool empowers teams to thrive in their agile journey.
## Run Locally

Clone the project

```bash
  git clone https://github.com/asherawelan/scrum-health-checker.git
```

Go to the project directory

```bash
  cd scrum-health-checker
```

Bring up the Docker container

```bash
  docker-compose up
```

Open the UI in a browser

http://localhost:8000

## Features

- Add a team name and date for customized chart
- Download answers as JSON
- Upload JSON and restore answers
- Download SVG image of rendered chart


## Tech Stack

jQuery, Bootstrap, Chart.js
