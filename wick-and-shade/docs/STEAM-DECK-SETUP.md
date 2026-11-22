# Wick & Shade: installing on the Steam Deck

Wick & Shade comes as one Linux app file: **`WickAndShade.AppImage`** (about 100 MB). You add it to Steam like any other non-Steam game. After that it shows up in your library and launches fullscreen from Gaming Mode with no browser involved.

## One-time install (about 5 minutes)
1. Hold the power button → **Switch to Desktop**.
2. Get the AppImage onto the Deck. Easiest is to open this project's Library in the Deck's browser and download it. A USB stick works too.
3. In **Dolphin** (the file manager), make a folder `/home/deck/Games` and move `WickAndShade.AppImage` into it.
4. Right-click the file → **Properties** → **Permissions** → tick **Is executable** → **OK**.
   (Double-click it now if you want a quick test. It opens fullscreen. Choose **Quit** on the title screen to close it.)
5. Open **Steam** (desktop) → **Games** menu → **Add a Non-Steam Game to My Library…** → **Browse…** → go to `/home/deck/Games`. Change the file type filter to **All Files** if the AppImage isn't listed. Select it → **Add Selected Programs**.
6. Optional: right-click the new entry → **Properties** → rename it **Wick & Shade**. You can set `icon.png` as the icon there.
7. Go back to **Gaming Mode** (the "Return to Gaming Mode" icon on the desktop).

## Controllers
- Pair your Bluetooth controllers once in Gaming Mode: **Settings → Bluetooth** → put each controller in pairing mode → select it. Xbox, PlayStation and Switch Pro controllers all work.
- Launch the game. On the **Who is who?** screen, each person presses **A** (Cross on PlayStation) on their own controller. The first press becomes **Wick**, the second becomes **Shade**. Each controller only ever moves its own character.
- Any mix works: two Bluetooth controllers with the Deck set aside or docked, or one person on the Deck's built-in controls and the other on a Bluetooth controller.
- **Only one controller?** Press **Y** on it at the join screen to split it: left stick + LB/LT play Wick, right stick + RB/RT play Shade.
- If a controller does nothing: press any button on it once (it may have gone to sleep), and check that the game's **Controller settings** in Steam use the **Gamepad** layout. That's Steam's default for non-Steam games.
- **Pause menu → Swap Wick and Shade** switches characters without rejoining.
- Button names on screen follow the controller you last pressed: letters for Xbox pads and the Deck, Cross/Circle/Square/Triangle for PlayStation, and the Nintendo letters for a Switch Pro controller. (When Steam Input is on, every controller looks like an Xbox pad to the game, so you'll see letters.)

## Controls
| | Wick | Shade |
|---|---|---|
| Move | Left stick / D-pad | Left stick / D-pad |
| Jump | A | A |
| X (or B) | Lantern: set down (standing still), throw (while moving), pick up | Wave |
| Up (hold) | Raise the lantern | — |
| Y | Next narrator line (instructions wait for you; quick remarks fade on their own, and lines you have already moved past are skipped) | Next narrator line |
| Start | Pause menu | Pause menu |

Progress saves automatically, and **Continue** picks up where you left off. **Chapter Select** on the title screen lets you jump to any chapter at any time, and for the long chapters, to any room inside them, with a little map of each room and a gold check on everything you have finished. A lost save never costs you anything. **Options** (title screen or pause menu) sets music and sound volume, whether the narrator waits for Y or moves on by itself, the game speed (normal, 85% or 70%, handy while someone is still getting the hang of jumping), and controller rumble (a short buzz when you fall or hit a drum). Phones can join as controllers too: open the address shown on the join screen and type the code (Y on a phone does nothing on the join screen, since a phone can't be split in half). **Challenges** are all open from the start too, and each one remembers your best time. The pause menu has a **Field guide**: a short note on every kind of block, glass and gadget you have met so far. To quit: **Quit** on the title screen, or the Steam button → **Exit game**.

## Updating from an older version
Download the new `WickAndShade.AppImage` and replace the old file in `/home/deck/Games` (same name, so the Steam shortcut keeps working). If your shortcut still points at an older file with a version number in its name, open the game's **Properties** in Steam and change **Target** to `WickAndShade.AppImage`. Your saved progress carries over, and Continue takes you to the first new chapter.

## The rules of the world
- Shade stands on the purple shadows the lantern casts from black ink blocks. If a shadow swallows Shade, Shade floats up through it.
- Gold **sunglass** is solid only inside the lantern's light. Purple **duskglass** is solid only outside it.
- Teal plates open teal doors and make teal bridges appear while something stands on them (the lantern counts). Pink plates do the same for pink doors and bridges.
- Ink **crates** can be pushed by either of you. They hold plates down, make good steps, stack on top of each other, and cast shadows like the ink blocks. The lantern can ride on top of one. A crate that falls out of the level comes back where it started.
- Small **hooks** hang in the air in some rooms. Wick can stand under one and press the lantern button to hang the light there, and press it again under the hook to take it back.
- **Curtains**: Shade slips through purple ink curtains and Wick can't; Wick walks through gold glow curtains and Shade can't. Light shines through both.
- Little **sun-eyes** sit on some walls. While the lantern's light reaches one (and no ink block or crate is in the way), it works like a plate held down. Hide the light behind something and it lets go.
- **Drums** throw whoever lands on them high into the air. Hold down to stand on one without bouncing. A dropped or thrown lantern bounces off drums too.
- **Conveyor belts** carry whatever stands on them: you, crates, the lantern.
- **Ink wells** are for Shade only: stand on one and press down to come up out of its partner. Wells pair up from left to right (the first with the second, the third with the fourth).
- **Mirror balls** light up when the lantern can see them and shine too, a bit less far. They can open sun-eyes, hold up gold glass, melt dark glass and wipe out shadows. Hide one from the lantern (behind a crate or an ink block) to switch it off.
- **Lifts** rise while anything stands on them (either of you, a crate, or the lantern on its own) and sink back down when they are empty, or while you hold down on one. A lift won't come down on top of anyone.
- **Candles** light up when the lantern touches them and stay lit for the rest of the room: a small light of their own. Careful: a lit candle can wash out a shadow Shade needs.
- **Steam vents** are iron grates that blow straight up: step on one and you rise to the top of the steam and bob there (jump off the top, or hold down to sink). Set the lantern down on one and it floats up and stays there, lighting whatever it can reach. A crate sitting on a grate shuts the steam off.
- Both of you have to be in the door to finish a chapter.

36 chapters, plus one you have to find. Chapters 11 to 35 (The Stockroom, The Gallery, Backstage, The Observatory, The Music Room, The Print Shop, The Lighthouse, The Clocktower, The Greenhouse, The Fairground, The Rooftops, The Night Market, The Department Store, The Train Station, The Library, The Chandlery, The Picture House, The Laundry, The Bakery, The Post Office, The Ice Rink, The Telephone Exchange, The Toy Shop, The Ballroom, The Aquarium) are long ones with three to five rooms in a row; the game shows which room you're in. Separate from the story there are 34 **Challenges**: short, tough rooms with no story. More long chapters and challenges are coming in later versions. If you get stuck, **Ask for a hint** in the pause menu makes the narrator give the next hint for that room straight away, and **Restart room** (or **Restart chapter**) is there too.

## Other files
- `index.html` is the same game as a single web page, for playing on any computer in a browser.
- `source/` holds the files used to build the AppImage (Electron 33).

## If the screen stays black
Since version 1.0.2 the game draws without the graphics hardware by default, which avoids the black screen seen in Desktop Mode, and still runs at 60 fps. To try the graphics hardware anyway, add `--gpu` to the game's Launch Options in Steam.
