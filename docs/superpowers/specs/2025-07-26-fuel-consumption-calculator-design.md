# Fuel Consumption Calculator Design

## Overview

Add a new calculator page that computes fuel consumption and optionally trip cost.

## Inputs

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| Distance | Yes | empty | Trip distance in km |
| Consumption | Yes | 7.0 | Vehicle rate in L/100km |
| Gas price | No | empty | Price per liter (generic, no currency symbol) |

## Calculations

```
liters = (distance / 100) * consumption
cost   = liters * gasPrice   (only computed when gasPrice is provided)
```

## Layout

Two-column at lg breakpoint:

**Left column** — Inputs:
- Distance (km) input
- Consumption (L/100km) input
- Gas price (per liter) input, optional
- Indigo result box showing liters consumed (always when inputs valid)
- If gas price is provided, also show total cost in the result box
- Amber warning when required fields are missing/invalid

**Right column** — SVG visualization:
- Simple fuel gauge style visual

## Route & Navigation

- Path: `/fuel-consumption`
- Nav icon: ⛽
- Dashboard card between Rule of Three and "coming soon" placeholder

## Design Tokens

All styling follows existing calculator patterns (cards, inputs, result/warning boxes identical to other pages).
