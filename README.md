# Conduit Backend CI/CD Pipeline

This repository contains the source code for the backend of our application. The following is an overview of our CI/CD pipeline which automates the process of building, testing, and deploying the application.

![Pipeline Diagram](path_to_your_image)

## Pipeline Steps

1. **Commit to Repository:**
   - Developers push code changes to the Git repository.

2. **Jenkins Server:**
   - The Jenkins server automatically fetches the latest code changes.

3. **Initialization & Unit Tests:**
   - Jenkins runs initialization scripts and unit tests to ensure code quality and functionality.

4. **OWASP Dependency Check:**
   - The code undergoes a security scan for known vulnerabilities in project dependencies using OWASP Dependency Check.

5. **Build Docker Image:**
   - A Docker image of the application is built, ensuring a consistent runtime environment.

6. **Image Scanning:**
   - The Docker image is scanned for vulnerabilities to ensure security compliance.

7. **Push to Dockerhub:**
   - The built Docker image is pushed to Dockerhub, making it available for deployment.

8. **Update Manifest Repository:**
   - The Kubernetes manifest repository is updated with the new Docker image information.

9. **ArgoCD Deployment:**
   - ArgoCD, sitting within the Kubernetes cluster, automatically pulls the changes and deploys the application.

10. **Post Actions:**
    - Notifications are sent via Slack to inform the team of deployment status and other relevant events.

## Getting Started

To start working on the backend repository, clone this repository and follow the steps below:

```bash
git clone https://github.com/sidhu2003/conduit
cd conduit
# Install dependencies and start developing
