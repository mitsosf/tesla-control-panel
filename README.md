# Tesla Control Panel

A personal project from 2022 for remotely controlling a Tesla vehicle via the web. It combines a Laravel backend with a React front‑end and a lightweight Python service that communicates with Tesla’s legacy API.

## 🚗 Live Demo

Explore the interface: [https://tesla-demo.frangiadakis.com](https://tesla-demo.frangiadakis.com)

Click the **Demo Login** button to sign in as an admin using a mock service. It’s safe to explore—no real car is affected.

---

## 🎯 Purpose

I built this to grant limited, temporary access to my Model 3—like unlocking doors or preconditioning the cabin—without giving away full control. The focus was on practicality and mobile usability, not fancy visuals.

---

## 🔧 Features

- Google & Facebook OAuth via Laravel Socialite
- Wake, lock/unlock, remote start, and media control
- Full climate control: set temperature, heated seats, etc.
- Role-based access control + admin panel
- Emergency override endpoints (lock/unlock)
- Mock Tesla service for safe development/testing

> The Python service uses [TeslaPy](https://github.com/tdorssers/TeslaPy), which relied on the now-deprecated legacy API. Controlling the vehicle via this API is no longer supported.

---

## 🛠 Running Locally

The repo includes three components:

- `app/` – Laravel backend with embedded React UI
- `tesla-service/` – FastAPI backend that interfaces with Tesla
- `mock-tesla-service/` – Mock backend for development/testing

To run:

1. Copy `.env.example` to `.env` inside `app/`
2. Adjust environment variables as needed
3. Use Docker Compose in each folder to spin up the services

Because Tesla has deprecated the legacy API, only the mock service is functional now.

---

## 📚 About the Project

This was a fun experiment born from curiosity and practicality. While Tesla’s legacy API is outdated, the architecture demonstrates:

- A clean microservice bridge between a vehicle API and web dashboard
- Separation between real and mock services
- Fast iteration using Laravel, React, and FastAPI

**Note:** This project uses the **unofficial legacy Tesla API**, which no longer works. Tesla now offers the official [Fleet API](https://developer.tesla.com/docs/fleet-api), which should be used for all new apps. This repo remains as a demo and portfolio reference.