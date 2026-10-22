# Midnight Run

A playable Phaser 3 motorcycle combat racer for Ian, inspired by 16-bit road racers. Yellow-and-black club colors, an illustrated black touring bike, generated curves and hills, and seven rivals on a new seeded road each run. The title is **Midnight Run**.

## Play locally

Requires Node 22+ and npm.

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open the address printed by Vite. On a phone on the same Wi-Fi, run `npm run dev` and visit the printed Network address. The computer firewall must allow that local connection. Mobile play requires landscape. Browsers that support fullscreen orientation lock request it when riding starts or when Enter Landscape is tapped. Other browsers show a Rotate to Ride screen until the phone is physically sideways. Returning to portrait pauses the ride. Phaser alone sizes and centers the canvas, preserving the complete 16:9 view without CSS cropping or rotation. Touch controls use inline SVG icons with text labels. The PWA includes 192/512 PNG icons, a maskable Android icon, and an explicit 180px Apple touch icon. Add to Home Screen/offline support requires a production build served over HTTPS (or localhost).

```sh
npm test
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1
```

Build output is `dist/`. Production builds precache every emitted file, including generated scripts, for offline play after the first successful online visit. The development server does not register a worker.

## Controls

- Arrows / WASD: throttle, brake and lean. Forward cruise is automatic.
- J: punch. K: kick. L: shillelagh (always available).
- H: chain. Chain pickups give four charges; charges also decay over time.
- Repair kits (black case, yellow cross) on the road restore 30 armor. Every knockdown also restores 6 armor. The mobile CHAIN button attacks with the chain when charges are available; STICK always uses the shillelagh.
- P: pause. R: a new run. Escape: home.
- Phone: hold steer and throttle/brake buttons, tap attacks. Buttons support simultaneous fingers. Pause automatically on losing focus or hiding the page.

Pull alongside a rival and strike. Attacks automatically use the hand or foot on the nearest rival’s side, with steering as a fallback. Hits build a timed combo and score. Knockdowns slow rivals. Rivals strike back; cars cost armor and speed. Rivals spar alongside Ian with animated left/right punches and kicks. Their windups can be dodged or interrupted. At most four enemies are shown at once, including the cop; hidden race competitors cannot attack Ian. Pothole/oil hazards are removed. On the default Casual setting, three punches or two shillelagh/chain strikes defeat a rival. Settings includes a saved Easy–Outlaw difficulty slider: rival durability rises from two to six punches, while attack intervals drop from 3.6 to 1.4 seconds. Higher settings also increase steering aggression and shorten windups. The selection applies on the next ride; police still need five landed hits to arrest Ian. New road gangs replenish combat after passing the race field. A police rider pursues Ian: hold the throttle to escape, or dodge the cop’s six-frame kick. The patrol closes in gradually, commits to its attack lane for a 0.85-second windup, and needs close boot contact to land a hit. Striking the officer interrupts the attack; he takes two more punches than a rival on the same setting (five punches or three cane/chain hits on Casual). The cop must land five unblocked hits during the run to arrest Ian. The first four deal light, nonlethal damage and allow Ian to fight back or escape; the fifth pulls Ian onto the shoulder and shows BUSTED. The HUD tracks police hits out of five. Red/blue lamps flash directly on the patrol bike. Stay on the pavement to keep speed. Wanted stars (0–5) rise with damage dealt to riders and traffic, with extra heat for attacking police. Higher levels shorten pursuit intervals and police kick cooldowns; heat cools after ten quiet seconds outside pursuit, and escaping drops a star. Reach the checkered finish line and FINISH gantry before losing your armor; the results show your actual position among eight riders.

Settings save sound, camera shake and an optional seed. A fixed seed reproduces road geometry, starting field and item placements; leaving it blank creates a new seed for each run. Driving choices change how the race unfolds.

## Structure shared with OB Skate Adventure

This is an independent sibling, following the separation of responsibilities in `/Users/donaldparker/Projects/ob-skate-adventure`; it does not import or modify Leona's project.

- `src/core/`: dependency-free race/combat geometry, projection math and persisted settings.
- `src/levels/`: level definition, seeded generation, curves, elevations and region data.
- `src/riders/`: Ian's data and handling stats, separate from engine behavior.
- `src/actors/rider/`: sprite texture generation and asset integration.
- `src/scenery/`: sky, mountain layers and regional palettes.
- `src/game/`: scene orchestration, input, audio, HUD and configuration.
- `src/game/views/`: road renderer and pooled actor views.
- `src/ui/`: page shell, touch controls, settings/results and offline registration.
- `tests/`: deterministic roads, continuity, combat geometry, race behavior and projection.
- `art/`: art direction and asset provenance.

The road is projected from world-space segments, not a scrolling screenshot. Hills occlude distant segments. Curves accumulate laterally into a ribbon; props and racers share its projection. Simulation and composition use 480 × 270 logical coordinates, rendered at 960 × 540 with smooth filtering. The biker texture retains 224 × 320 pixels of detail, including Ian’s Top Hatters and California patches. Rivals interpolate continuously between projected road segments, match Ian’s size alongside him, crop correctly at hills and fade behind the camera when overtaken.

Each punch, kick, shillelagh swing and overhead chain swing has six separately drawn frames for each side. Contact occurs after the windup. The finish plays a six-pose dismount and cigarette-lighting sequence before results. Fireballs are disabled. Use `?lab` on the development server for visual checks of both sides, traffic, pursuit and the ending.

## Current limits

This is a first playable slice. Attack motion uses illustrated frame sequences; leaning remains procedural. Regions change at checkpoints rather than blending. There is no multiplayer or saved campaign. Responsive desktop browser tests do not replace testing on real Pixel/Android Chrome and iPhone/Safari devices.
