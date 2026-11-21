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

## Controls
| | Wick | Shade |
|---|---|---|
| Move | Left stick / D-pad | Left stick / D-pad |
| Jump | A | A |
| X | Lantern: set down (standing still), throw (while moving), pick up | Wave |
| Up (hold) | Raise the lantern | — |
| Y | Next narrator line (the narrator waits for you) | Next narrator line |
| Start | Pause menu | Pause menu |

Progress saves automatically. **Continue** and **Chapter Select** appear on the title screen once you've played, and **Challenges** appears once you've played far enough to open the first one. To quit: **Quit** on the title screen, or the Steam button → **Exit game**.

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
- Both of you have to be in the door to finish a chapter.

16 chapters, plus one you have to find. Chapters 11 (The Stockroom), 12 (The Gallery), 13 (Backstage), 14 (The Observatory) and 15 (The Music Room) are long ones with five rooms in a row; the game shows which room you're in. Separate from the story there are **Challenges**: short, tough rooms with no story, opened as you play. More long chapters and challenges are coming in later versions. If you get badly stuck, **Restart room** (or **Restart chapter**) is in the pause menu.

## Other files
- `index.html` is the same game as a single web page, for playing on any computer in a browser.
- `source/` holds the files used to build the AppImage (Electron 33).

## If the screen stays black
Since version 1.0.2 the game draws without the graphics hardware by default, which avoids the black screen seen in Desktop Mode, and still runs at 60 fps. To try the graphics hardware anyway, add `--gpu` to the game's Launch Options in Steam.
