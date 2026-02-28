# Maksim Travels - Next.js App

A modern travel booking website built with Next.js, React, and Tailwind CSS.

## Features

- 📱 Responsive design with Tailwind CSS
- ✈️ Multiple service options (International Tickets, Local Tickets, Hotels, Visas, Holiday Packages, Consulting)
- 🗓️ Dynamic form fields based on selected service
- 📞 Direct WhatsApp integration for inquiries
- 🎨 Modern, professional UI

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main homepage
│   └── globals.css      # Global styles
├── package.json         # Dependencies
├── tailwind.config.ts   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
└── next.config.js       # Next.js config
```

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

## License

© 2024 Maksim Travels. All rights reserved.
