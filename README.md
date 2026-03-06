# brAInstormer - AI-Powered Creative Suite

A powerful, modern creative suite powered by AI, featuring text generation, image editing, video editing, audio production, 3D modeling, and more.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Quick Start](#quick-start)
  - [API Keys Setup](#api-keys-setup)
  - [Workspace Overview](#workspace-overview)
  - [Tools and Features](#tools-and-features)
- [Components](#components)
- [AI Models](#ai-models)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🤖 Multi-modal AI generation (text, images, video, audio, 3D)
- 🎨 Professional-grade image editor
- 🎬 Video editing and composition
- 🎵 Digital audio workstation
- 🎮 3D modeling and visualization
- 📝 Document editing and collaboration
- 📊 Spreadsheet and data analysis
- 📈 Chart creation and visualization
- 💻 Code editing with AI assistance
- 📁 File management system
- 📋 Project board for task management
- 📅 Calendar integration

## Requirements

- Node.js 18.0.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- API keys for AI services:
  - OpenAI
  - Stability AI
  - Anthropic
  - Meta AI
  - Luma AI
  - Replicate

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brainstormer.git
cd brainstormer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_key
VITE_STABILITY_API_KEY=your_stability_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_META_API_KEY=your_meta_key
VITE_LUMA_API_KEY=your_luma_key
VITE_REPLICATE_API_KEY=your_replicate_key
```

4. Start the development server:
```bash
npm run dev
```

## Usage

### Quick Start

1. Launch the application
2. Configure your API keys in Settings
3. Select your desired creative tool from the sidebar
4. Start creating with AI assistance

### API Keys Setup

1. Click the Settings icon in the sidebar
2. Enter your API keys for each service
3. Keys are stored locally in your browser
4. No keys are transmitted to external servers

### Workspace Overview

- **Left Sidebar**: Main navigation and tool selection
- **Chat Panel**: AI assistant for text generation and help
- **Tool Area**: Main workspace for the selected tool
- **Properties Panel**: Context-sensitive controls and settings

### Tools and Features

#### Text Generation
- Multiple AI models support
- Context-aware responses
- Code generation
- Creative writing assistance

#### Image Editor
- Layer-based editing
- AI image generation
- Professional tools (brush, selection, etc.)
- Filters and adjustments
- Export in multiple formats

#### Video Editor
- Timeline-based editing
- AI video generation
- Effects and transitions
- Multiple format support
- Export options

#### Audio Editor
- Multi-track recording
- AI music generation
- Virtual instruments
- Effects processing
- MIDI support

#### 3D Modeling
- AI model generation
- Basic modeling tools
- Texture and material editing
- Scene composition
- Multiple format export

## Components

The application is built with modular components:

- `Chat`: AI communication interface
- `ImageEditor`: Professional image editing
- `VideoEditor`: Video composition and editing
- `AudioEditor`: Digital audio workstation
- `ThreeDViewer`: 3D model visualization
- `DocumentEditor`: Text document editing
- `SpreadsheetEditor`: Data manipulation
- `ChartEditor`: Data visualization
- `CodeEditor`: Code editing with AI
- `FileManager`: File organization
- `ProjectBoard`: Task management
- `Calendar`: Event scheduling

## AI Models

### Text Models
- GPT-4 Omega (OpenAI)
- Claude Sonnet (Anthropic)
- Llama (Meta)

### Image Models
- DALL·E 3 (OpenAI)
- Stable Diffusion 3 (Stability AI)
- Flux Pro (Flux)

### Video Models
- Luma (Luma AI)
- Stable Video (Stability AI)
- Kling (Kling AI)

### Audio Models
- MusicGen (Meta)
- Stable Audio (Stability AI)

### 3D Models
- Stable Fast 3D (Stability AI)

## Keyboard Shortcuts

### Global
- `Cmd/Ctrl + K`: Command palette
- `Cmd/Ctrl + S`: Save
- `Cmd/Ctrl + /`: Toggle help

### Image Editor
- `V`: Move tool
- `M`: Marquee tool
- `L`: Lasso tool
- `W`: Magic wand
- `B`: Brush tool
- `E`: Eraser tool
- `T`: Text tool
- `C`: Crop tool
- `Z`: Zoom tool

### Video Editor
- `Space`: Play/Pause
- `K`: Split clip
- `Delete`: Remove clip
- `[`: Previous frame
- `]`: Next frame

### Audio Editor
- `Space`: Play/Pause
- `R`: Record
- `M`: Mute track
- `S`: Solo track

## Development

### Project Structure
```
src/
  ├── components/     # React components
  ├── services/      # API and business logic
  ├── hooks/         # Custom React hooks
  ├── types/         # TypeScript definitions
  ├── utils/         # Helper functions
  └── styles/        # CSS and styling
```

### Build
```bash
npm run build
```

### Testing
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details