# Midnight Run rider art

The title screen uses the background-only artwork from the design conversation. UI text and buttons are separate page elements.

## Current rider

`public/assets/ian-rear-patches.png` was edited with the built-in imagegen tool using the original rear-view sprite and Ian’s supplied vest photograph as references. The original `ian-rear.png` remains available. At startup, the selected source is cropped to its alpha bounds and sampled smoothly into a 224 × 320 texture. The player’s displayed height is 88 logical pixels. Rivals receive color variants. No API calls or keys are needed at runtime.

Prompt: Keep the rear camera angle, full black touring motorcycle silhouette, upright pose, both hands on handlebars, exposed arms, saddlebags, chrome pipes, red lamps and transparent background. Match the reference vest: golden yellow upper rocker reading TOP HATTERS in black, central white skull with striped tall black top hat and wide gray feathered wings edged in yellow, small MC patch, and lower yellow rocker reading CALIFORNIA. Brown swept-back hair with shaved sides. Refine chunky pixel art into clean illustrated arcade-game artwork with smoother contours and leather/chrome highlights. No background, ground, UI, extra figures or watermark.

## Rendering

The camera renders at 960 × 540 while preserving the established 480 × 270 logical composition. Linear filtering and a higher-detail rider texture avoid blocky nearest-neighbor enlargement. Scenery, cars, road markings, pickups and combat effects are drawn locally in code.

A future animation sheet can add dedicated lean, punch/kick/club, recovery and knockdown frames while retaining the current origin and world-size calibration.
