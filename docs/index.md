---
layout: default
title: Tiation CMS
---

# Tiation CMS

*Enterprise-grade headless CMS for industry-specific content management*

![CMS Screenshot](./images/cms-screenshot.jpg)

## Features

- **Headless Architecture**: Decouple content management from presentation
- **Industry-Specific**: Tailored for specific vertical requirements
- **Enterprise-Grade**: Built for scale with security and performance in mind
- **API-First**: RESTful API for seamless integration
- **User-Friendly**: Intuitive admin interface for content management
- **Extensible**: Modular architecture for custom functionality

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │   Content API   │    │   Frontend App  │
│   (React/Vue)   │◄──►│   (Node.js)     │◄──►│   (Any Tech)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Database     │
                    │  (PostgreSQL)   │
                    └─────────────────┘
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tiation-cms.git
   cd tiation-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run db:init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
