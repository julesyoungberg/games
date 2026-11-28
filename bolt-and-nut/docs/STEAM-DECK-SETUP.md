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

## What's in this version (1.17.0)
New Overtime puzzle Punch Clock (after Shift 32): a lift that only rises on the clock with a laser at the top, an airlock whose gate and bridge take turns, and a crane ring that glides over the last gap on the clock. Rings can now be wired to a clock, plate or switch. 39 in all.

## 1.16.0
A new kind of machine, the factory clock: anything wired to it comes and goes on the beat, and its face shows when. New Overtime puzzle Clockwork (after Fire Drill): hop across four bridges on two clocks that take turns, then ride a fan whose laser and gate run off the same clock. 38 in all.

## 1.15.0
A new Overtime puzzle, Moving Target (after Fire Drill): ride a shuttle through a laser that blinks out of step with it, then catch a ring that slides back and forth over a gap. 37 in all.

## 1.14.0
A new shift before the finale: Fire Drill (a plate-powered fan lift, blinking alarm lasers, and a crate that tries to evacuate itself). 33 shifts in all.

## 1.13.0
Two more Overtime puzzles: Airlock (only one door may be open at a time) and Severance Package (one crate, two jobs; unlocks after the finale). 36 in all.

## 1.12.0
Two more Overtime puzzles: Elevator Pitch (a lift that only carries whoever didn't call it) and Reverse Psychology (a door that opens when the switch is off). 34 in all.

## 1.11.0
Two more Overtime puzzles: Escalation (launch Bolt mid-bounce off a spring) and Sliding Scale (throw a crate down an oiled chute). 32 in all. Control hints and the level banner now hide behind the pause and shift-complete cards.

## 1.10.0
Two more Overtime puzzles: Lost Property (fetch a crate off a shelf too tall to reach) and Trust Exercise (a pneumatic tube and a leap of faith). 30 in all. Bright tiled floors are toned down so lit rooms and the exit no longer look washed out.

## 1.9.0
Two more Overtime puzzles: Job Share (a gentle one that opens after the first shift) and Upward Mobility. 28 in all. When Bolt's pull finds nothing in range, a small spark shows the press registered.

## 1.8.2
Jumps are a little more forgiving: a jump pressed just before landing, or just after running off an edge, still counts. Pressure plates look like painted metal with grooves that light up when pressed.

## 1.8.1
A controller that drops out and reconnects (Bluetooth sleep) is found again automatically, even if it comes back under a new number. On setups that show one controller twice, one press can no longer join both robots. The exit pad is a deeper green with glowing rings.

## 1.8.0
Three more Overtime puzzles: Glass Ceiling (after shift 5), Hot Air (after shift 9) and Exit Interview (after shift 30). 26 in all.

## 1.7.0
Three more Overtime puzzles for the late shifts: Org Chart, Carry Over and Sleigh Ride (23 in all). Two skips are closed: Nut can't launch Bolt while standing on him, and a robot that jumps off a belt keeps moving with it, so fast belts can't be hopped up.

## 1.6.0
Four more shifts before the finale: Interdepartmental, Outlook Unsettled, Last Posting Date and Staff Reunion. 32 shifts in all. Wall signs use the game's font, and picking up a golden cog shows how many you have.

## 1.5.0
Four new shifts late in the year, before the finale: Stocktake, Clearing the Air, Topping Out and Clearance. 28 shifts in all. The music now changes key and pace from area to area, and lasers light the floor around them.

## 1.4.0
Three more Overtime puzzles: Blue Sky Thinking (after shift 8), Hat Trick (after shift 20) and Final Exam, the hardest puzzle in the game, which opens once you finish the year. The Overtime list is now in the order the puzzles open. The title screen names the shift you'll continue, and each level opens with a short camera glide.

## 1.3.0
Three friendlier Overtime puzzles that open early in the year: Corporate Ladder (after shift 2), Office Olympics (after shift 6) and Remote Working (after shift 10).

## 1.2.0
Three new Overtime puzzles: Climate Control, Rush Hour and Parcel Force. Best times for every level, and the finish screen shows whether you found the golden cog. Bolt's pull beam glows and lights the floor, Nut's push flashes blue, and the camera looks ahead of where you're heading.

## 1.1.0
Phone controllers work here too (open couch-coop-games.vercel.app/pad on a phone and type the code from the join screen). Footsteps, a factory soundscape and heavier landings. The robots squash harder on big drops and lean when they start and stop. The pause menu now shows each player's buttons for the device they're holding. A colour grade and deeper haze give the picture more depth, and bright floors glare less.

## 1.0.0
New: four shifts (Quarterly Reset, Night Watch, Stocktake, Clearing the Air, Topping Out, Clearance, Interdepartmental, Outlook Unsettled, Last Posting Date, Staff Reunion, Open Plan Office, and a new finale, Closing Time) and three Overtime puzzles (Staff Limbo, Team Building, Air Mail).

Fixes from playtesting: button presses are never dropped any more (jump, pull and push), holding X keeps trying to pull until something is in range, a push pressed a moment early still fires, and Margaret skips lines about areas you've already left. The exit glows less, levels fade in, and there's a proper ending screen. Saves are now stored by level name, so new shifts never mix up your progress.

## Earlier (0.6.0)
**New look:** a deep factory hall around every level (gears, columns, catwalks, lamps, dust in the air), new fonts, preview pictures and Done/cog badges in the level menus, real textures, metal and paint that catch the light, proper shadows, a soft glow on lights and lasers, and new robot models. On a computer that draws with software (no graphics card), the game keeps the old simple look so it stays smooth. Options, Picture quality: "sharp" always uses the new look, "fast" always uses the simple one.

33 shifts (levels): Orientation, The Pull of Things, Push Comes to Shove, Iron Will, Logistics, Safety Lasers, Ventilation, Performance Review, Shipping, Switchboard, Lumber Room, Night Shift, Spring Cleaning, Quality Control, Pneumatic Post, Overhead Rail, Slippery Slope, Cling Film, Mixed Signals, Year-End Review, Quarterly Reset, Night Watch, Stocktake, Clearing the Air, Topping Out, Clearance, Interdepartmental, Outlook Unsettled, Last Posting Date, Staff Reunion, Fire Drill, Open Plan Office, Closing Time.

Also **Overtime**: short, harder bonus puzzles on the title screen. They unlock as you finish shifts.

Toys added since 0.1.0: conveyor belts (some flip direction while their plate or switch is on), switches that Nut flips with a push (they stay on until pushed again), wooden crates that magnets can't move (walk into them to shove them), springs that bounce anything that lands on them, pneumatic tubes that shoot robots and crates to the other end, anchor rings that glide along overhead rails, slippery oil floors, magnet plates on walls that Bolt can cling to, and factory clocks that switch bridges, fans, lasers and gates on and off on the beat (the coloured part of the face is the on part). There are 39 Overtime bonus puzzles.

Every shift also hides one **golden cog** off the main path (usually needs a boost, a launch, or Nut's rocket). **Choose a shift** shows which ones you've found. Progress saves automatically. **Choose a shift** and **Overtime** on the title screen let you jump to any level at any time, so a lost save never matters. Every shift has been finished start to end by scripted test robots.
