# Brainspace

## Overview

A real-time data processing and visualization system. It consists of a data generator, a server that processes and distributes data, and a client with multiple visualization options.

## Getting Started

To run the entire system locally, simply use Docker Compose:

```bash
docker-compose up --build
```
If you don't have Docker installed, you can install it on Linux using:

```bash
sudo snap install docker
```

The services will be accessible on the following ports:

9000 — Data generator

8000 — Server (API & WebTransport)

3001 — Client (frontend)

### AI Chats
https://chatgpt.com/share/686508f8-e64c-800e-a4a3-7fd40f5ea26e 

https://chatgpt.com/share/686508d3-c054-800e-9e36-45a67db700af

https://claude.ai/share/483dd5e2-b5bd-4fab-b9fd-cf55933df153

https://claude.ai/share/ccc83003-c997-4376-bedc-c7dbe9001c53

https://claude.ai/share/9102c62c-e651-4e92-bec3-e990291b5d35

https://chatgpt.com/share/686508bd-d790-800e-be1e-c930b3285770

https://chatgpt.com/share/6865a9c3-8064-800e-be19-0f853de67f1f

## Project Structure
### Server
The server is built using [Bun](https://bun.sh/) and the [Elysia](https://elysiajs.dev/) framework. It provides the following functionalities:

1. Listens to incoming TCP data, stores messages in SQLite3, and notifies subscribers of new messages in real-time. (Redis or another scalable pub/sub system can be integrated if needed.)

2. Publishes messages to subscribed clients via WebSocket.

3. Supports fetching historical messages from the database based on quantity or date.

Note: Inside the server folder, you will find an example demonstrating WebTransport failure handling.

### Client
The client is built using [pnpm](https://pnpm.io/) and [react](https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=0gcJCfwAo7VqN5tD).

The client showcases multiple types of charts to visualize the incoming data. This variety demonstrates the system’s flexibility and aims to provide different viewing options for end users.

