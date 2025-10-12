# AI Development Rules

This document outlines the tech stack and rules for developing this application.

## Tech Stack

-   **Framework**: React with TypeScript
-   **Bundler**: Vite
-   **Styling**: Tailwind CSS
-   **UI Components**: Pre-built `shadcn/ui` components are available and should be preferred.
-   **Icons**: `lucide-react` for all icons.
-   **AI**: Google Gemini API via the `@google/genai` package for all generative tasks.

## Library Usage Rules

-   **Components**: All UI should be built with React components using TypeScript. Create new files for each component in `src/components/`.
-   **Styling**: Use Tailwind CSS classes directly for styling. Do not write custom CSS files. When possible, use components from the `shadcn/ui` library.
-   **Icons**: All icons must be imported from the `lucide-react` package.
-   **State Management**: Use React's built-in hooks (`useState`, `useEffect`, etc.) for state management. Avoid adding external state management libraries.
-   **AI Functionality**: All interactions with the Gemini API must be handled through the functions in `src/services/geminiService.ts`.
-   **Routing**: All page-level routing is managed within `src/App.tsx`. New pages should be added there.