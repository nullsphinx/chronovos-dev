# Chronovos - Interactive Historical Timeline Visualization

Chronovos is a modern web application that provides an interactive visualization of historical events across different regions and time periods. Built with React, TypeScript, and Tailwind CSS, it offers a unique way to explore and understand historical timelines.

## Features

- **Interactive Timeline Grid**: Visualize historical events across different regions with a responsive grid layout
- **Dark Theme**: Modern, eye-friendly dark theme with carefully chosen color schemes
- **Tag-based Filtering**: Filter events by categories and tags using an intuitive menu
- **Hover Details**: View detailed event information by hovering over timeline entries
- **Responsive Design**: Works seamlessly across different screen sizes
- **Region-based Navigation**: Explore events specific to different geographical regions

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Animation**: Framer Motion for smooth transitions and interactions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/moonwalkwoods/chronovos-dev.git
cd chronovos-dev
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # React components
│   ├── TimelineGrid.tsx    # Main timeline visualization
│   ├── TagFilterMenu.tsx   # Tag filtering interface
│   ├── TimelineMinimap.tsx # Timeline overview
│   └── Navbar.tsx          # Navigation component
├── data/              # Data and type definitions
│   ├── events.ts      # Historical event data
│   └── tags.ts        # Tag hierarchy and definitions
├── pages/             # Page components
│   └── RegionPage.tsx # Region-specific view
└── App.tsx            # Main application component
```

## Key Features Implementation

### Timeline Grid
- Implements a responsive grid layout for historical events
- Uses custom color coding for different event types
- Features smooth hover interactions with detailed event information
- Supports both single-region and multi-region views

### Tag Filtering
- Hierarchical tag system for categorizing events
- Search functionality for quick tag filtering
- Visual feedback for selected tags
- Maintains state across region changes

### Dark Theme
- Custom color palette optimized for readability
- Consistent styling across all components
- Smooth transitions and hover states
- Accessible contrast ratios

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
