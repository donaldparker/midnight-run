# Police motion assets

Built-in imagegen tool, using public/assets/police.png as the design reference. Integrated assets: public/assets/police-kick-left-sheet.png and public/assets/police-kick-right-sheet.png. Six sprites per side; animated by src/actors/police/poses.ts.

Prompt set (one request for LEFT and one for RIGHT):

Create a production sprite atlas for Midnight Run. Reference image defines the exact rear-view officer and white police touring motorcycle. Transparent alpha background, no gray panels. SIX separate full officer-and-bike sprites, 3 equal columns by 2 equal rows, read row-major. All rear wheel contact baselines and bike sizes identical. Keep white helmet, tan shirt, brown trousers, black boots, rear red and blue lamps, readable POLICE text. No cropping or touching neighboring sprites. This is a LEFT/RIGHT LEG KICK toward a biker beside the officer: frame 0 both boots on pegs; frame 1 attacking knee lifts outward, other leg on peg; frame 2 attacking knee clearly chambers sideways; frame 3 attacking boot fully extended horizontally toward side target; frame 4 leg retracts; frame 5 boot back on peg. Make leg movement very clear, maintain both hands gripping handlebars. Polished illustrated arcade game art matching reference, not pixel art. Each square cell must contain full sprite including outstretched boot with generous empty space. Other leg stays on bike. No front-facing motorcycle, no captions, no motion blur.

PWA icons are code-native SVG artwork, rasterized with Sharp into 180, 192 and 512px PNGs. The maskable version has a solid black background with its MR/road mark inside the central safe zone.
