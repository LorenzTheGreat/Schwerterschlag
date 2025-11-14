import React from 'react';

# Schwerterschlag - Modernes Web-Schwertkampfspiel

## Features

### Kern-Gameplay
- **Echtzeit-Schwertkampf** mit Spieler und KI-Gegnern
- **Wellen-System** mit progressiver Schwierigkeit
- **Dual-Eingabe**: Tastatur + Mouse/Touch

### Mobile & Desktop
- **Vollständig responsiv** (320px - 1920px)
- **Touch-Steuerung** für Mobilgeräte
- **Tastatur-Steuerung** (WASD + SPACE + SHIFT)

### Spielmechaniken
- **Angriffssystem** mit Cooldowns
- **Verteidigungsmechanik** (Schaden-Reduktion)
- **Knockback-Physik** realistische Kampfeffekte
- **Enemy-KI** mit Verfolgung und taktischem Verhalten
- **Wellen-Manager** mit progressiver Schwierigkeit

## Projektstruktur

```
src/
├── main.js              # Einstiegspunkt, Phaser Config
├── scenes/
│   └── GameScene.js     # Hauptspielszene
├── entities/
│   ├── Player.js        # Spieler-Charakter
│   └── Enemy.js         # Gegner-KI
├── systems/
│   ├── InputManager.js  # Eingabe-Handling
│   ├── CombatSystem.js  # Kampflogik
│   └── WaveManager.js   # Wellen-Verwaltung
├── ui/
│   └── UIManager.js     # HUD & UI-Elemente
└── utils/               # Hilfsfunktionen (zukünftig)

assets/
├── images/              # Sprites & Grafiken
└── audio/               # Sounds & Musik
```

## Technologie

- **Phaser 3** - Moderne 2D Game Engine
- **Vite** - Blitzschneller Build Tool
- **Responsive Design** - Mobile-First Ansatz
- **GitHub Pages** - Kostenlos gehostet

## Installation & Entwicklung

\`\`\`bash
npm install
npm run dev      # Lokale Entwicklung
npm run build    # Für Produktion bauen
npm run deploy   # Auf GitHub Pages deployen
\`\`\`

## Steuerung

### Desktop
- **WASD** - Bewegung
- **SPACE** - Angriff
- **SHIFT** - Verteidigung

### Mobile
- **Swipen** - Bewegung
- **Tippen** - Angriff

## Erweiterungen (geplant)

- [ ] Sprite-Animationen
- [ ] Sound-Effekte & Musik
- [ ] Verschiedene Waffen
- [ ] Power-ups & Items
- [ ] Leaderboard
- [ ] Weitere Enemy-Typen
- [ ] Boss-Kämpfe
- [ ] Spiel-Settings

## Architektur-Highlights

### Entity-Component Pattern
Jede Entität (Player, Enemy) verwaltet ihre eigenen Stats und State.

### Event-Driven Combat
Attacken werden als Events gefeuert und vom CombatSystem verarbeitet.

### Responsive Skalierung
Automatische Anpassung an verschiedene Bildschirmgrößen.

### Mobile-First Input
Touch-Input wird nahtlos mit Tastatur kombiniert.
