
## Project info

**URL**: https://lovable.dev/projects/3c0ccb73-bd0a-4a1a-8a38-b43612b72ad4

## About This Project

This is a quotes collection application focused on journalism and media-related quotes. It features:

- A curated collection of historical and contemporary quotes about journalism, media, and truth
- Detailed source attribution and citation formats
- Export capabilities in multiple formats
- Interactive UI for exploring and sharing quotes



Search
⌘
K

Coding Plan
Toggle theme


Share

CGX
Get Started
Overview
Report Issue
11 min
Level: Beginner
Sim is an open-source AI workflow automation platform that enables developers to build and deploy AI agent workflows visually. It combines a powerful visual canvas, real-time collaboration, and extensive tool integrations to streamline the creation of sophisticated AI-powered applications.

Sim Logo

What Sim Offers
Sim provides three core capabilities that transform how developers work with AI: visual workflow construction, AI-powered Copilot assistance, and intelligent knowledge management. You can design complex agent workflows by dragging and connecting blocks on an interactive canvas, then execute them instantly. The platform integrates with over 100 tools and services, from databases and APIs to popular SaaS platforms, making it easy to build production-ready AI workflows.

The visual workflow builder uses ReactFlow to create an intuitive drag-and-drop interface where you can connect agents, tools, and control flow blocks. Each block represents a specific action or capability—LLM calls, API requests, database queries, or custom functions. Simply connect blocks with edges to define execution order and data flow.

Workflow Builder Demo

Sim's Copilot feature elevates this experience further by allowing you to generate workflow components using natural language. Describe what you want to build, and Copilot creates the appropriate nodes and connections. It can also help debug errors, suggest optimizations, and iterate on your workflow designs—all through conversational interaction.

Copilot Demo

For organizations with proprietary data, Sim's knowledge base capabilities enable you to upload documents to a vector database and let agents answer questions grounded in your specific content. This retrieval-augmented generation (RAG) approach ensures AI responses are accurate, relevant, and tied to your organization's knowledge sources.

Knowledge Uploads and Retrieval Demo

Sources: README.md, apps/sim/package.json

Architecture Overview
Sim is built as a monorepo using Turborepo, organizing code into reusable packages and applications. This architecture enables efficient development, consistent dependencies, and modular component sharing across the platform.


















The executor engine forms the heart of Sim's workflow execution system. It implements a directed acyclic graph (DAG) architecture that processes blocks in the correct order based on their dependencies and connections. The executor handles complex control flow patterns including loops, parallel branches, and conditional routing while maintaining state across execution contexts apps/sim/executor/types.ts.

The blocks registry contains over 100 pre-built blocks organized into categories: triggers (manual, scheduled, webhook-based), tools (integrations with external services), control flow (conditionals, loops, routers), and AI agents. Each block is a self-contained component with defined inputs, outputs, and execution logic apps/sim/blocks/registry.ts.

Real-time collaboration is powered by Socket.IO, which enables multiple users to edit the same workflow simultaneously. Changes propagate instantly through websockets, with conflict resolution ensuring data consistency across connected clients apps/sim/socket/index.ts.

Background job management via Trigger.dev handles scheduled executions, webhook processing, and knowledge base indexing tasks, ensuring long-running operations don't block the main application flow.

Sources: turbo.json, package.json

Project Structure
The repository follows a clear separation of concerns with distinct directories for applications, packages, and infrastructure configuration:

sim/
├── apps/
│   ├── sim/              │   │   ├── executor/     # DAG-based workflow execution engine
│   │   ├── blocks/       # Block registry and implementations
│   │   ├── socket/       # Real-time collaboration server
│   │   ├── providers/    # LLM provider integrations
│   │   ├── tools/        # External service integrations (100+)
│   │   ├── triggers/     # Background job triggers
│   │   └── background/   # Background job processors
│   ├── docs/             # Documentation website (Fumadocs)
│   └── cli/              # NPM CLI tool for easy deployment
├── packages/
│   ├── db/               # Database schema and migrations
│   ├── ts-sdk/           # TypeScript SDK for workflow execution
│   ├── python-sdk/       # Python SDK for workflow execution
│   ├── logger/           # Shared logging utilities
│   └── testing/          # Shared testing utilities
├── docker/               # Dockerfiles for app, database, realtime
├── helm/                 # Kubernetes charts for deployment
├── scripts/              # Build and utility scripts
└── docker-compose.*.yml  # Various deployment configurations
This modular structure allows teams to work on different components independently while maintaining clear interfaces between them. The packages can be consumed by external applications, while the apps directory contains the full-featured Sim platform.

Sources: README.md

Tech Stack
Sim leverages modern technologies optimized for performance, developer experience, and scalability:

Component	Technology	Purpose
Framework	Next.js 16 (App Router)	React-based web application framework
Runtime	Bun 1.3+	Fast JavaScript runtime and package manager
Language	TypeScript 5.7+	Type-safe development
Database	PostgreSQL + Drizzle ORM	Relational data storage with migrations
Vector Extension	pgvector	Vector embeddings for semantic search
Authentication	Better Auth	Session-based auth with OAuth providers
UI Library	Shadcn + Tailwind CSS	Accessible component library
State Management	Zustand	Client-side state management
Flow Editor	ReactFlow 11	Visual workflow canvas
Real-time	Socket.IO 4	WebSocket-based collaboration
Background Jobs	Trigger.dev 4	Scheduled and triggered jobs
Code Execution	E2B + isolated-vm	Secure sandboxed code execution
Monorepo	Turborepo	Build system and cache management
Documentation	Fumadocs	MDX-based documentation framework
Telemetry	OpenTelemetry	Distributed tracing and monitoring
Testing	Vitest	Fast unit testing framework
The platform supports multiple LLM providers through a unified abstraction layer, including OpenAI, Anthropic, Google, Azure, Groq, and local models via Ollama or vLLM. This provider-agnostic design allows you to switch models or use multiple providers within the same workflow without changing your integration code.

Sources: README.md, apps/sim/package.json

Deployment Options
Sim offers flexible deployment strategies to suit different use cases, from quick prototyping to production-scale deployments:

Cloud-Hosted (sim.ai)
The fastest way to get started is the managed service at sim.ai. No infrastructure setup required—simply sign up and start building workflows. This option includes managed databases, automatic scaling, and priority support.

Self-Hosted via NPM
For quick local development, Sim provides an NPM package that orchestrates all required services using Docker:

npx simstudio
This command pulls and configures PostgreSQL (with pgvector), the Sim application, and all dependencies automatically. Customization options include port selection (-p) and skipping image pulls (--no-pull).

Self-Hosted via Docker Compose
Production deployments use Docker Compose with multiple configuration profiles:

Standard: Full production setup with optimized services
Local Development: Development-friendly configuration
Ollama: Integration with local LLM models (no external APIs)
GPU Support: Hardware-accelerated model inference
Each deployment runs the Next.js application, Socket.IO server, and PostgreSQL database as separate containers, with proper networking and volume management for persistence.

Self-Hosted Manual Setup
For maximum control, Sim can be deployed manually:

Clone repository and install dependencies with Bun
Set up PostgreSQL 12+ with pgvector extension
Configure environment variables (DATABASE_URL, auth secrets)
Run database migrations using Drizzle Kit
Start both the Next.js app (bun run dev) and Socket.IO server (bun run dev:sockets)
This approach is ideal for custom infrastructure requirements, CI/CD integration, or development environments.

Kubernetes Deployment
For enterprise scale, Helm charts provide Kubernetes deployment with support for horizontal scaling, rolling updates, and cluster-wide configuration. The Helm chart (helm/sim) includes configurable resource limits, ingress settings, and multi-architecture support.

All self-hosted deployments require the pgvector PostgreSQL extension for AI embeddings and knowledge base features. When using Docker, ensure you use the pgvector/pgvector image rather than standard PostgreSQL.

Sources: README.md, README.md

Key Features
Visual Workflow Canvas
Build complex AI workflows without writing code. The ReactFlow-powered canvas provides intuitive drag-and-drop functionality, keyboard shortcuts, and real-time preview. Workflows are saved as JSON configurations that can be version controlled, exported, and shared across teams.

AI-Powered Copilot
Describe what you want to build in natural language, and Copilot generates the appropriate workflow structure. It can create new blocks, fix errors, suggest optimizations, and explain complex patterns. Copilot is a Sim-managed service—generate an API key from sim.ai to use it in self-hosted deployments.

Extensive Tool Integrations
Over 100 pre-built integrations cover popular services:

Databases: PostgreSQL, MySQL, MongoDB, Neo4j, Redis, Snowflake
Cloud Services: AWS S3, SQS, DynamoDB, RDS, Azure Blob, Google Cloud
Productivity: Notion, Slack, Google Workspace (Docs, Sheets, Calendar), Microsoft 365
Communication: Email (Gmail, Outlook), SMS (Twilio), Chat (Discord, Telegram, WhatsApp)
E-commerce: Shopify, Stripe
Data & Analytics: Airtable, HubSpot, Salesforce, PostHog, Datadog
AI/ML: OpenAI, Anthropic, Hugging Face, Pinecone, Qdrant
Each integration handles authentication, rate limiting, and error recovery automatically.

Workflow Control Flow
Implement sophisticated logic with built-in control blocks:

Conditions: Branch execution based on expression evaluation
Loops: For-each iteration, while loops, do-while loops with configurable limits
Parallel: Execute multiple branches concurrently and aggregate results
Routers: Dynamic routing based on conditional logic
The executor engine handles complex nested patterns, including loops within parallel branches and parallel execution within loop iterations.

Knowledge Base & Vector Search
Upload documents (PDF, DOCX, TXT, MD, code files) and Sim automatically chunks, embeds, and indexes them using pgvector. The knowledge base block allows agents to retrieve relevant context based on semantic similarity, enabling accurate, domain-aware responses.

Real-time Collaboration
Multiple users can edit workflows simultaneously with live cursor tracking and conflict resolution. WebSocket-based architecture ensures instant updates across all connected clients, making team workflow building seamless.

Background Automation
Schedule workflows to run on specific intervals (cron expressions), trigger them via webhooks, or respond to external events from supported services (GitHub commits, Stripe events, Slack messages, etc.). Background jobs run independently of user sessions with retry logic and error notification.

SDKs for Programmatic Access
Integrate Sim into your applications using TypeScript or Python SDKs:

TypeScript SDK:

import { SimStudioClient } from 'simstudio-ts-sdk';
 
const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY
});
 
const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello!' }
});
Python SDK:

from simstudio import SimStudioClient
 
client = SimStudioClient(api_key="your-api-key")
result = client.execute_workflow(
    "workflow-id",
    input_data={"message": "Hello!"}
)
Both SDKs support synchronous and asynchronous execution, status checking, and workflow validation.

Sources: packages/ts-sdk/README.md, packages/python-sdk/README.md, apps/sim/blocks/registry.ts

Getting Started Guide
Your journey with Sim begins with choosing the right deployment method. For beginners exploring the platform, we recommend starting with the NPM package for instant setup or the cloud-hosted version at sim.ai for the fastest onboarding.

For local development, the simplest approach is:

npx simstudio
This command downloads and configures all required Docker containers, then launches Sim at http://localhost:3000. You'll be prompted to create an account and workspace.

Once you're running Sim, the typical workflow is:

Create a workspace to organize your workflows and resources
Configure providers (OpenAI, Anthropic, etc.) with API keys
Build your first workflow by adding triggers, blocks, and connections
Test interactively using the workflow debugger
Deploy to make workflows available for execution via API, SDKs, or triggers
Start with the Quick Start guide for step-by-step instructions on your first workflow deployment.

Next Steps
Now that you understand what Sim offers and how it's architected, here's the recommended learning path:

Quick Start - Deploy Sim and build your first workflow in 5 minutes
Choose your deployment path:
Cloud-Hosted Setup - Use sim.ai for zero-setup deployment
Self-Hosted with NPM - Quick local development
Docker Compose Deployment - Production-ready container setup
Explore the architecture:
Workflow Execution Engine with DAG - Understand how workflows run
Visual Canvas with ReactFlow - Learn the UI framework
Real-Time Collaboration with Socket.IO - See how teams work together
Deep dive into specific features:
Tool System Architecture - How integrations work
Provider Registry and Abstractions - LLM integration patterns
TypeScript SDK Usage - Programmatic workflow execution
Quick Start