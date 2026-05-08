# Beaver's System Adaptation for BRP (Basic Role Playing)

This module provides the system-specific implementation for Chaosium's Basic Role Playing (BRP) system in Foundry VTT, allowing other modules (like beavers-crafting) that use [beavers-system-interface](https://github.com/AngryBeaver/beavers-system-interface) to work seamlessly with BRP.

## Installation
1. Install via Foundry's module browser (search for bsa-brp) or manually add the manifest URL.
2. Requires [beavers-system-interface](https://foundryvtt.com/packages/beavers-system-interface) and the [BRP system](https://foundryvtt.com/packages/brp).

## Features
- Skill rolls via actor's skill items (d100 based)
- Characteristic rolls (STR, CON, etc.)
- Wealth as currency
- Tab support for actor sheets
- Config for skills, abilities, currencies, loot items

## Notes
- BRP is in active development (beta); this adapter is designed to work with current versions.
- Skill rolls fallback to d100 if no native roll method found on item.
- For best results, ensure BRP system is loaded before this adapter.

## License
MIT (same as parent project)