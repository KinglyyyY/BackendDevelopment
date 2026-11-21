# PBL Assignment

## Project repository

[BackendDevelopment-PBL](https://github.com/KinglyyyY/BackendDevelopment-PBL)

## Summary

This PBL activity takes the existing Express, EJS, and MongoDB TODO app from [`LAB/Exam01B`](https://github.com/KinglyyyY/BackendDevelopment/tree/main/LAB/Exam01B) and prepares it for containerized delivery:

1. The app runs in a Docker image built from the included `Dockerfile`.
2. `docker-compose.yml` starts the app with MongoDB, a persistent database volume, and service health checks.
3. `automationTesting.py` checks the health, task-list, add-task, and delete-task routes, including invalid requests.
4. The `pbl-ci.yml` GitHub Actions workflow starts the Compose stack, runs the route checks, and then builds and publishes a Docker Hub image after successful pushes or manual runs on `main`.
5. This file links the PBL repository from the main Backend Development repository as requested.

The route checks passed locally and in [GitHub Actions run 45555449242](https://github.com/KinglyyyY/BackendDevelopment-PBL/actions/runs/45555449242). The PBL repo workflow needs the `DOCKERUSERNAME` and `DOCKERTOKEN` GitHub Actions secrets to publish its image to Docker Hub. The CI run passed the tests and skipped image publishing because those secrets are not configured yet.

## Run locally

```bash
docker compose up --build
python3 automationTesting.py
```
