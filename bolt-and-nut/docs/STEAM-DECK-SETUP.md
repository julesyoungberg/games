# Bolt & Nut: installing on the Steam Deck

Bolt & Nut is a 3D two-player couch co-op. It comes as one Linux app file, **`BoltAndNut-0.1.0.AppImage`** (about 105 MB), added to Steam the same way as Wick & Shade.

## One-time install (about 5 minutes)
1. Hold the power button → **Switch to Desktop**.
2. Download `BoltAndNut-0.1.0.AppImage` from this project's Library (or copy it over on a USB stick).
3. In **Dolphin**, move it into `/home/deck/Games` (next to Wick & Shade is fine).
4. Right-click it → **Properties** → **Permissions** → tick **Is executable** → **OK**.
5. Open **Steam** (desktop) → **Games** → **Add a Non-Steam Game to My Library…** → **Browse…** → `/home/deck/Games`. Set the file type filter to **All Files** if needed, pick the AppImage, **Add Selected Programs**.
6. Optional: right-click the entry → **Properties** → rename it **Bolt & Nut**, and use `icon.png` as its icon.
7. **Return to Gaming Mode** and launch it from your library.

## Controllers
- On **Who is who?**, each person presses **A** on their own controller. First press is **Bolt** (red), second is **Nut** (blue). **X** swaps you.
- One controller only? Press **Y** on it to share it: left stick + LB/LT play Bolt, right stick + RB/RT play Nut.
- Keyboard works too: WASD + Space + E for Bolt, arrows + / + . for Nut.

## Controls
| | Bolt (red) | Nut (blue) |
|---|---|---|
| Move | Left stick / D-pad | Left stick / D-pad |
| Jump | A | A |
| Power | **Hold X**: pull. Reels in Nut, crates, or zips Bolt up to a floating ring. Let go to drop. Face what you want to grab; a red ring shows what you'll get. | **Press X**: push. Launches Bolt (or crates) up and away. On striped iron floors, Nut launches herself. |
| Y | Next narrator line (Margaret waits for you) | Same |
| Start | Menu: hints, back to checkpoint, swap, options | Same |

While Bolt hangs from a ring, **A** hops off it. Stuck? **Start → Ask Margaret for a hint**.

## Graphics (the black-screen fix)
The game starts in **safe mode**: it draws the 3D scene in software, the same approach that fixed Wick & Shade's black screen. It lowers its own resolution a little if it needs to, to stay smooth.

If you want it sharper and smoother, try **Options → Graphics engine → graphics card**. The game restarts and asks *"Can you see this?"*. Press **A** to keep it. If the screen stays black, just wait 15 seconds and it switches back to safe mode by itself.
You can also force a mode in Steam: game **Properties → Launch Options** → `--gpu` or `--software`.

## The browser version
`index.html` is the same game as a single web page (works offline). Open it in Chrome or Firefox on any computer. In a browser the graphics card is used automatically; if the browser has hardware acceleration switched off, the game shows a short note on how to turn it on.

## What's in this version (1.0.0)
New: four shifts (Quarterly Reset, Night Watch, Open Plan Office, and a new finale, Closing Time) and three Overtime puzzles (Staff Limbo, Team Building, Air Mail).

Fixes from playtesting: button presses are never dropped any more (jump, pull and push), holding X keeps trying to pull until something is in range, a push pressed a moment early still fires, and Margaret skips lines about areas you've already left. The exit glows less, levels fade in, and there's a proper ending screen. Saves are now stored by level name, so new shifts never mix up your progress.

## Earlier (0.6.0)
**New look:** a deep factory hall around every level (gears, columns, catwalks, lamps, dust in the air), new fonts, preview pictures and Done/cog badges in the level menus, real textures, metal and paint that catch the light, proper shadows, a soft glow on lights and lasers, and new robot models. On a computer that draws with software (no graphics card), the game keeps the old simple look so it stays smooth. Options, Picture quality: "sharp" always uses the new look, "fast" always uses the simple one.

24 shifts (levels), about 4 hours for two people: Orientation, The Pull of Things, Push Comes to Shove, Iron Will, Logistics, Safety Lasers, Ventilation, Performance Review, Shipping, Switchboard, Lumber Room, Night Shift, Spring Cleaning, Quality Control, Pneumatic Post, Overhead Rail, Slippery Slope, Cling Film, Mixed Signals, Year-End Review, Quarterly Reset, Night Watch, Open Plan Office, Closing Time.

Also **Overtime**: short, harder bonus puzzles on the title screen. They unlock as you finish shifts.

Toys added since 0.1.0: conveyor belts (some flip direction while their plate or switch is on), switches that Nut flips with a push (they stay on until pushed again), wooden crates that magnets can't move (walk into them to shove them), springs that bounce anything that lands on them, pneumatic tubes that shoot robots and crates to the other end, anchor rings that glide along overhead rails, slippery oil floors, and magnet plates on walls that Bolt can cling to. There are 11 Overtime bonus puzzles.

Every shift also hides one **golden cog** off the main path (usually needs a boost, a launch, or Nut's rocket). **Choose a shift** shows which ones you've found. Progress saves automatically. **Choose a shift** and **Overtime** on the title screen let you jump to any level at any time, so a lost save never matters. Every shift has been finished start to end by scripted test robots.
