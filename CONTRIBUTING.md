# Contributing to RoboTrack

Thank you for your interest in contributing to **RoboTrack** — the intelligent robotics mission control and fleet management platform.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors.

## Development Workflow

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/robotrack/robotrack.git
   cd robotrack
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`. Both Vite frontend and `/api/*` backend middleware are active simultaneously.

4. **Verify TypeScript & Linting**:
   ```bash
   npm run lint
   ```

## Pull Request Guidelines

- Branch naming: `feat/mission-dispatch-queue` or `fix/telemetry-packet-loss`.
- Include tests or validation runs for API endpoints in `server/routes.ts`.
- Maintain zero-broken-image and anti-slop visual discipline in frontend components.
- Ensure all telemetry simulation routines remain bounded and explicitly disclaimed.
