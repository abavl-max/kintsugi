# Kintsugi

A creative sandbox for designers to apply controlled digital imperfections, transforming pristine designs into unique, authentic works of art.

[cloudflarebutton]

## About The Project

Kintsugi is a web-based creative sandbox that empowers designers to intentionally introduce and control digital errors, glitches, and imperfections. In an era dominated by flawless, AI-generated content, Kintsugi provides a canvas for exploring the 'aesthetic of error,' allowing for the creation of visually distinct and authentically human designs.

The application features a real-time preview workspace where users can upload their own images or use pre-built UI templates. A comprehensive control panel offers a library of glitch effects—visual, textual, and behavioral—each with adjustable parameters for intensity and style. Designers can layer effects, save their unique combinations as presets, and instantly toggle between the original and modified versions.

Kintsugi is built on the principle of creative discipline, ensuring that even as designers explore chaos, essential usability is preserved and every effect is reversible, giving them ultimate control over the final artistic expression.

### Key Features

*   **Real-Time Glitch Engine:** Instantly see the effects of your changes on the preview canvas.
*   **Comprehensive Control Panel:** Fine-tune effects with intuitive sliders and switches.
*   **Diverse Effect Library:** Experiment with a wide range of visual, textual, and behavioral imperfections.
*   **Layered Effects:** Combine multiple glitches to create unique, complex aesthetics.
*   **Preset System:** Save and load your favorite effect combinations for reuse.
*   **Client-Side Processing:** Fast, private, and efficient, with all manipulations happening in your browser.
*   **Image Upload & Templates:** Start with your own images or use built-in templates.
*   **High-Quality Export:** Save your final creations as high-resolution PNG or JPEG files.

### Built With

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [shadcn/ui](https://ui.shadcn.com/)
*   [Zustand](https://github.com/pmndrs/zustand)
*   [Framer Motion](https://www.framer.com/motion/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Lucide React](https://lucide.dev/)
*   [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

This project uses [Bun](https://bun.sh/) as the package manager and runtime. Please install it before proceeding.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your_username/kintsugi.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd kintsugi
    ```
3.  Install dependencies:
    ```sh
    bun install
    ```

### Running the Application

To start the development server, run the following command:

```sh
bun run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1.  Open the application in your browser.
2.  You will be prompted to upload an image. Select an image file from your computer.
3.  The image will appear in the right-hand **Preview** panel.
4.  Use the **Control Panel** on the left to apply effects.
5.  Expand an effect category (e.g., 'Pixelate') to reveal its parameters.
6.  Adjust the sliders and toggles to manipulate the image in real-time.
7.  Layer multiple effects to achieve your desired look.
8.  Use the 'Export' button to download your final artwork.

## Development

The project is structured as a standard Vite + React application.

*   `src/pages/HomePage.tsx`: This is the main entry point for the Sandbox View, containing the layout and core components.
*   `src/components/`: Contains reusable React components, including the control panel and preview canvas. UI components are sourced from `shadcn/ui`.
*   `src/stores/`: Zustand stores for managing application state, such as effect parameters and the current image.
*   `worker/`: Contains the Cloudflare Worker code used for serving the production build.

## Deployment

This application is designed for easy deployment to [Cloudflare Pages](https://pages.cloudflare.com/).

You can deploy directly by clicking the button below:

[cloudflarebutton]

### Manual Deployment with Wrangler

1.  **Build the project:**
    ```sh
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    This command will build and deploy your application. You will be prompted to log in to your Cloudflare account if you haven't already.
    ```sh
    bun run deploy
    ```
    Follow the prompts from the Wrangler CLI to complete the deployment. Your site will be live at the URL provided upon completion.