# PolyDebug
::: mod

Utility mod to aid in debugging errors for the average user. Current features include:

- Error popup on uncaught exceptions.
- Limited localstorage editor for stored poly mods.
- View console messages ingame

It is recommended you give this mod the maximum possible priority in the loading order.

## Error Popup
The error popup opens only when there is an uncaught exception in PolyTrack. 
What this means for the average user (you, probably) is any error that PolyTrack did not accouunt for and will crash the game.
These errors could be a bug in PolyTrack *or in a mod*. Please don't make Kodub debug mod errors.

By default, the error popup includes a stack trace of the relevant error.
You (the user) simply have to screenshot this and send it to us (modders) on the [modding channel](https://discord.com/channels/1115776502592708720/1188416595119329280), preferrably along with how you created this bug (if you have any clue what you did to cause this).

At the bottom, there is a button to open the localstorage editor.
Its usage is described in the next section

## Local Storage Editor
The Local Storage is where PML stores the data for mod loading.
If there is some sort of bug that refuses to let you access any parts of the game normally (for some reason), then this is your only hope to remove the offending mod.
PolyDebug has a limited Local Storage editor in the sense that it only lets you edit the item that stores the mods (this *may* change in the future, idk).

All the mods are presented as a list, in the order that they are stored, where you can click each item to expand the data of that mod. You can:

- Change the base URL of the mod (you probably don't want to do this).
- Change the version of the mod (probably to an older one that doesn't have the whatever bug that made you come here).
- Change whether the mod loads or not during initialization (this is probably what you want as a quickfix).

Additionally, you can also just remove the mod entirely (with the X at the right), if you really hate it that much.
Beware that this is **not** an undoable action (there is a confirmation dialog to save you).

## Viewing Console Messages
Pressing a certain keybind (default: `C`) brings up a dialog of all the history of the console after PolyDebug was initialized.
Mainly for people who don't know how to bring up the console (please learn how to open up the console, its not hard), but also serves as QOL feature for devs.

If a mod silently dies, it's error message is probably here.
If you're curious about what's happening in the console, that is also probably here.
\<Insert other things that are also probably here\>

:::
