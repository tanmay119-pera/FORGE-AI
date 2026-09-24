# FORGE — Autonomous Conversational Voice AI Co-Pilot

> Built with **Agora SD-RTN RTC Audio**, **Google Gemini 3.6 Flash Multimodal Reasoner**, and **Model Context Protocol (MCP)** for real-world execution.

[![Creator](https://img.shields.io/badge/Creator-Tanmay_(Adesh_Srivastava)-7c3aed?style=flat-square)](mailto:forge.ai@gmail.com)
[![Email](https://img.shields.io/badge/Contact-forge.ai%40gmail.com-blue?style=flat-square)](mailto:forge.ai@gmail.com)
[![Voice Latency](https://img.shields.io/badge/Voice_Latency-<25ms_SD--RTN-emerald?style=flat-square)](https://www.agora.io/)
[![Intelligence](https://img.shields.io/badge/Reasoner-Gemini_3.6_Flash-blue?style=flat-square)](https://ai.google.dev/)
[![Protocol](https://img.shields.io/badge/Tools-Model_Context_Protocol_(MCP)-violet?style=flat-square)](https://modelcontextprotocol.io/)

---

## ⚡ Overview

**FORGE** is an autonomous conversational Voice AI co-pilot designed for real-world action execution. Rather than simply speaking or generating text, Forge acts in the physical and digital world through standardized **Model Context Protocol (MCP)** tools.

Whether booking a premier cab, tracking live train telemetry, synchronizing executive calendars, or looking up dark-store prices across quick-commerce apps, Forge executes with sub-25ms voice latency powered by Agora's Software Defined Real-time Network (SD-RTN).

---

## 🧠 Two Intelligence Engines: Forge P1 vs Forge P2

Forge offers two selectable model tiers with custom efficiency tuning (**Low**, **Medium**, and **High**):

| Feature | ✦ Forge P1 (`Normal Work`) | 🔥 Forge P2 (`Extreme Work`) |
| :--- | :--- | :--- |
| **Primary Focus** | Everyday assistance, rapid voice queries, instant answers | Multi-step autonomous chains, complex situational planning |
| **Response Latency** | Sub-25ms Agora ultra-low latency voice | Deep cognitive reasoning & cross-service verification |
| **Execution Scope** | Single-step actions (Uber cab, calendar alert, quick price check) | Chained execution (*"Book cab to station + check platform + set reminder"*) |
| **Reasoning Engine** | Gemini 3.6 Flash High-Velocity Stream | Gemini 3.6 Flash Autonomous Multi-Tool Orchestration |
| **Efficiency Modes** | Low (Instant) / Medium (Balanced) / High (Deep) | Low / Medium / High (Maximum verification depth) |

---

## 🛠️ Real-World Autonomous Capabilities (MCP Tools)

Forge connects to real-world services via the **Model Context Protocol**:

1. 🚖 **Autonomous Cab Dispatch (`cab_dispatch`)**
   - Dispatches rides (Uber Premier / Go / Ola).
   - Real-time surge pricing analysis and estimated arrival calculation.
   - Streams live driver coordinates and license plate confirmation.

2. 🚆 **Real-time Rail Intelligence (`transit_tracker`)**
   - Live IRCTC telemetry and GPS tracking (e.g., Vande Bharat Express).
   - Expected arrival times, delay forecasts, and platform gate routing.

3. 📅 **Autonomous Calendar Sync (`calendar_sync`)**
   - Hands-free natural language event scheduling.
   - Computes travel buffers, parses boarding windows, and configures push reminders.

4. 🛍️ **Quick Commerce Price Lookup (`price_lookup`)**
   - Scans nearby dark stores (Blinkit, Zepto, Instamart).
   - Real-time stock verification, unit pricing comparison, and fastest delivery window identification.

---

## 🏗️ Architecture

```
[ User Microphone ]
        │  (Agora SD-RTN <25ms Audio Stream)
        ▼
[ Agora RTC SDK Engine ]
        │  Audio Telemetry & Spectral Volume Analysis
        ▼
[ VoiceAgentOrchestrator ]
        │  Multi-Turn Dialogue State & Intent Classifier
        ├─────────────────────────────────────────────────┐
        ▼                                                 ▼
[ ✦ Forge P1: Rapid Reasoner ]            [ 🔥 Forge P2: Extreme Chainer ]
        │                                                 │
        └─────────────────┬───────────────────────────────┘
                          │ (Structured MCP Tool Calls)
                          ▼
             [ Model Context Protocol (MCP) ]
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  🚖 Uber / Ola    🚆 Rail Tracker   📅 Calendar & Stores
        │                 │                 │
        └─────────────────┴─────────────────┘
                          │
                          ▼
            [ Live Action Cards & Stream ]
```

---

## 🎨 Design & Experience

- **Zero-Box Minimalism**: Pure, open layout on `#000000` (Pure Black) and `#ffffff` (Pure White) with circular ripple view-transitions.
- **3D Gyroscopic Crystal**: 60fps canvas-rendered 3D revolving crystal with true $Z$-depth sorting and soundwave particle reactivity.
- **Typography**: Complete typography implemented with Google's **Montserrat** font family.
- **Dual-State Interface**:
  - *Home View*: Elegant input composer, quick-action chips, model selector, and scrollable capabilities overview.
  - *Active Chat View*: Transitions smoothly into a focused chat box with live MCP tool cards and a `New Chat` reset button.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/tanmay119-pera/FORGE-AI.git
cd FORGE-AI

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 👨‍💻 Creator & Attribution

- **Developer**: **Tanmay (Adesh Srivastava)**
- **Email**: [forge.ai@gmail.com](mailto:forge.ai@gmail.com)
- **Built for**: Agora Voice AI Hackathon
- **Repository**: [https://github.com/tanmay119-pera/FORGE-AI](https://github.com/tanmay119-pera/FORGE-AI)

---

## 📄 License

MIT License © 2026 Tanmay (Adesh Srivastava). All rights reserved.
