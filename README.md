<div align="center">

<img src="public/logo.png" alt="LiteDash" width="80" />

# LiteDash

**A modern, premium admin dashboard for [LiteLLM](https://github.com/BerriAI/litellm)**

Manage your LLM proxy — models, users, API keys, MCP servers, guardrails, usage analytics — all from a beautiful, glassmorphic UI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://hub.docker.com/r/aaemon/litedash)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dashboard** | Overview with budget, spend, remaining budget, and active API keys |
| **Model Management** | Add, view, and delete LLM models with pricing (currency-converted) |
| **User Management** | Create users with budgets, manage API keys, role-based access |
| **MCP Servers** | Full CRUD with all LiteLLM options — SSE, StdIO, OAuth, semantic filter, network settings |
| **Agents** | Configure agents with model params, tool bindings, guardrails, MCP servers |
| **Guardrails** | View configured content safety guardrails |
| **Usage Analytics** | Spend tracking, daily charts, token breakdown, model usage |
| **Request Logs** | Paginated logs with model/status filters |
| **API Docs** | Built-in API documentation with code examples |
| **Settings** | Custom branding, currency conversion (20+ currencies with live sync), API endpoint |
| **Multi-Currency** | Display costs in USD, BDT, INR, EUR, GBP, JPY, and 15+ more currencies |

## 📸 Screenshots

> Add screenshots here after deployment

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18+ (for local dev)
- [Docker](https://docker.com) (for containerized deployment)
- A running [LiteLLM](https://github.com/BerriAI/litellm) proxy instance

### Option 1: Docker (Recommended)

```bash
# Pull and run
docker run -d \
  --name litedash \
  -p 3000:3000 \
  -e LITELLM_URL=http://your-litellm-server:4000 \
  -e LITELLM_MASTER_KEY=your-master-key \
  -e LITELLM_UI_USERNAME=admin \
  -e LITELLM_UI_PASSWORD=your-password \
  -v ./config:/app/config \
  aaemon/litedash:latest
```

Then open [http://localhost:3000](http://localhost:3000)

### Option 2: Docker Compose

```bash
# Clone the repo
git clone https://github.com/aaemon/LiteDash.git
cd LiteDash

# Copy and edit environment
cp .env.example .env
# Edit .env with your LiteLLM URL and credentials

# Run
docker compose up -d
```

### Option 3: Local Development

```bash
# Clone
git clone https://github.com/aaemon/LiteDash.git
cd LiteDash

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `LITELLM_URL` | LiteLLM proxy URL | `http://localhost:4000` |
| `LITELLM_MASTER_KEY` | LiteLLM master key for admin API access | _(required)_ |
| `LITELLM_UI_USERNAME` | Admin login username | `admin` |
| `LITELLM_UI_PASSWORD` | Admin login password | _(required)_ |
| `NODE_ENV` | Node environment | `development` |

### Volume Mounts (Docker)

| Path | Description |
|---|---|
| `/app/config` | Persistent settings (branding, currency, API endpoint) |

### Portal Settings

Settings are managed through the admin UI at **Settings** page:

- **Branding** — App name, logo URL
- **API Endpoint** — Public-facing LiteLLM URL for documentation
- **Currency** — Display currency with 20+ options, live exchange rate sync, editable multiplier

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with glassmorphism design
- **Backend**: LiteLLM API (proxied through Next.js API routes)
- **Auth**: Cookie-based sessions with role-based access control

## 📁 Project Structure

```
LiteDash/
├── config/
│   └── settings.json          # Portal settings (branding, currency)
├── public/
│   └── logo.png               # App logo
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Login page
│   │   ├── api/               # API routes (proxy to LiteLLM)
│   │   ├── dashboard/
│   │   │   ├── admin/         # Admin pages (models, users, MCP, agents, etc.)
│   │   │   ├── docs/          # API documentation
│   │   │   ├── logs/          # Request logs
│   │   │   └── usage/         # Usage analytics
│   │   ├── globals.css        # Design system
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   └── lib/
│       └── litellm.ts         # LiteLLM API client & auth utilities
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── next.config.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LiteLLM](https://github.com/BerriAI/litellm) — The LLM proxy this dashboard is built for
- [Next.js](https://nextjs.org) — React framework

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/aaemon">aaemon</a></sub>
</div>
