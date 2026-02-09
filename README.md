# Card Quest - A Web-Based Card Roguelike Game

![Card Quest Banner](https://img.shields.io/badge/Card%20Quest-Roguelike-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)

## 🎮 Play Now

**Live Demo:** [https://johnnyvonh.github.io/cardquest/](https://johnnyvonh.github.io/cardquest/)

## ✨ Overview

Card Quest is a modern, web-based card roguelike game where strategic deck-building meets procedurally generated adventures. Battle through multiple floors, collect powerful cards, upgrade your deck, and face increasingly challenging enemies.

## 🎯 Features

### Core Gameplay
- **Strategic Card Combat**: Energy-based card system with Attack, Defense, and Skill cards
- **Deck Building**: Collect and upgrade cards throughout your run
- **Procedural Generation**: Each run features unique encounters and rewards
- **Progressive Difficulty**: Multiple floors with escalating challenges
- **Boss Encounters**: Face powerful bosses every 3 floors

### Game Mechanics
- **Energy System**: Manage 3 energy points per turn strategically
- **Card Types**:
  - **Attack Cards**: Deal damage to enemies
  - **Defense Cards**: Gain block to reduce incoming damage
  - **Skill Cards**: Special effects and utility
- **Enemy AI**: Varied enemy behaviors with telegraph system
- **Relic System**: Passive bonuses that modify gameplay
- **Card Upgrades**: Enhance cards to increase their power

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI/UX**: Beautiful gradients, animations, and particle effects
- **State Management**: Robust game state handling
- **TypeScript**: Full type safety throughout
- **Modular Architecture**: Easy to extend and modify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JohnnyvonH/cardquest.git
cd cardquest

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

## 📦 Build & Deploy

### Local Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to GitHub Pages

The project is configured with automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Every push to `main` branch triggers deployment
2. **Manual Deployment**: Go to Actions tab → Deploy to GitHub Pages → Run workflow

The site will be live at: `https://johnnyvonh.github.io/cardquest/`

## 🎯 Game Guide

### Starting Your Adventure
1. Choose your starting deck (Warrior, Mage, or Rogue)
2. Navigate through floors fighting enemies
3. Collect cards and relics after victories
4. Upgrade your deck at rest sites
5. Defeat bosses to progress to new acts

### Combat Tips
- **Manage Energy**: Each card costs energy - plan your turns carefully
- **Block is Temporary**: Defense cards provide block that lasts until your next turn
- **Upgrade Wisely**: Upgraded cards are more powerful but choose strategically
- **Enemy Telegraphs**: Pay attention to enemy intentions to plan your defense
- **Synergies Matter**: Build your deck around card combinations

### Card Types Explained
- **Strike**: Basic attack dealing 6 damage
- **Defend**: Basic defense granting 5 block
- **Bash**: Attack that applies Vulnerable debuff
- **Power Strike**: High-cost, high-damage attack
- **Dual Strike**: Hit twice for moderate damage
- **Cleave**: Area attack hitting all enemies
- **Iron Wall**: Massive defensive card
- **Preparation**: Draw extra cards
- **Quick Slash**: Cheap, efficient attack

## 🏗️ Project Structure

```
cardquest/
├── src/
│   ├── components/        # React components
│   │   ├── Game.tsx      # Main game orchestrator
│   │   ├── Card.tsx      # Card display component
│   │   ├── Enemy.tsx     # Enemy display
│   │   ├── Hand.tsx      # Player hand management
│   │   ├── Combat.tsx    # Combat screen
│   │   ├── Map.tsx       # Floor map navigation
│   │   └── Victory.tsx   # Victory screen
│   ├── types/            # TypeScript type definitions
│   │   └── game.ts       # Core game types
│   ├── data/             # Game data and content
│   │   ├── cards.ts      # Card definitions
│   │   ├── enemies.ts    # Enemy definitions
│   │   └── relics.ts     # Relic definitions
│   ├── utils/            # Utility functions
│   │   ├── combat.ts     # Combat logic
│   │   ├── cardEffects.ts # Card effect handlers
│   │   └── generator.ts  # Procedural generation
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Pages deployment
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── README.md            # This file
```

## 🎨 Customization Ideas

### Easy Modifications
1. **Add New Cards**: Define cards in `src/data/cards.ts`
2. **Create Enemies**: Add enemies in `src/data/enemies.ts`
3. **Design Relics**: Implement relics in `src/data/relics.ts`
4. **Adjust Balance**: Modify damage/health values in data files
5. **Change Theme**: Update Tailwind colors in `tailwind.config.js`

### Advanced Features to Add
- **More Card Types**: Implement Power cards with lasting effects
- **Status Effects**: Add poison, strength, weakness, etc.
- **Multiple Characters**: Different starting decks and mechanics
- **Events**: Random encounters with choices
- **Shop System**: Spend gold to buy cards/relics
- **Save System**: Persist game state to localStorage
- **Achievements**: Track player accomplishments
- **Daily Challenges**: Seeded runs with leaderboards
- **Animation System**: Enhanced visual feedback
- **Sound Effects**: Audio for actions and ambiance

## 🔧 Development

### Tech Stack
- **Framework**: React 18 with hooks
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tool**: Vite for fast development
- **Deployment**: GitHub Pages with Actions

### Code Standards
- Functional components with hooks
- Strong typing with TypeScript
- Modular, reusable components
- Clear separation of concerns
- Comprehensive inline documentation

## 📝 License

MIT License - feel free to use this project as a foundation for your own games!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your custom cards/enemies

## 🎮 Gameplay Tips & Strategy

### Deck Building Strategy
- **Keep it Lean**: Smaller decks draw key cards more consistently
- **Balance is Key**: Mix attacks and defense appropriately
- **Synergy Over Power**: Cards that work together beat raw stats
- **Don't Neglect Defense**: Block saves HP for later fights

### Advanced Tactics
- **Front-load Damage**: Kill enemies before they can hurt you
- **Block Efficiency**: Use block cards before enemy attacks
- **Card Draw**: More cards = more options and flexibility
- **Remove Weak Cards**: Basic strikes become less useful later

## 🏆 Achievements Ideas

- **First Victory**: Complete your first run
- **Perfect Fight**: Win a combat without taking damage
- **Minimalist**: Win with a deck of 15 cards or fewer
- **Tank**: Win with 20+ block in a single turn
- **Glass Cannon**: Win without using any defense cards
- **Speed Runner**: Complete a run in under 15 minutes
- **Collector**: Obtain all cards in a single run
- **Boss Slayer**: Defeat all bosses

## 🐛 Known Issues & Future Improvements

### Current Limitations
- No persistent save system (game resets on refresh)
- Limited sound effects and music
- Basic enemy AI patterns
- No multiplayer or online features

### Planned Features
- Character classes with unique mechanics
- More diverse enemy types and behaviors
- Event system with narrative choices
- Shop and merchant system
- Potion and consumable items
- Meta-progression between runs
- Mobile-optimized touch controls

## 📞 Support

For questions, suggestions, or bug reports, please open an issue on GitHub.

---

**Built with ❤️ by Johnny von Holstein**

**Live Game:** [https://johnnyvonh.github.io/cardquest/](https://johnnyvonh.github.io/cardquest/)

Enjoy your adventure through Card Quest! 🎴⚔️