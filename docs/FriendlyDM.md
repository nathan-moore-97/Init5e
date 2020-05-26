
# Friendly DM User Guide

Friendly-DM is a discord bot, designed to act both as a D&D Fifth Edition helper bot for things like the Wild Magic surge, madness tables, and dice rolling, as well as an endpoint for players to interact with the Init5e tracker in a limited capacity.

## Initiative Trackerless Features

Friendly-DM can be run independent of the Init5e module on the server with all of the following features:

- `tip` Sends a random 'loading screen tip' to the text channel where it was called NEED IMAGE
- `prefix` Sends the prefix that the bot will respond to, by default `!`. There is currently no way to change this.
- `weather` Returns a weather state based off of the climate of Chult in _Tomb of Annihilation_.  If there is no active weather state on the server, one is randomly generated. 
- `[weather] roll` Generates a new weather state.
- `[weather] ambience` Friendly-DM starts playing weather specific ambience in the server. Currently there on only five unique ambience tracks. NEED THE LIST
- `leave` Friendly DM will leave the voice channel when you get annoyed by the weather ambience. 
- `madness` Generates a madness effect, based on the short term, long term, and indefinite madness tables. (e.g. `!madness [short, long, indefinite]`). Friendly-DM then sends the response in a Direct Message to the user that called the feature. 
- `wildmagic` Generates a Wild Magic surge effect, and then sends the response in a Direct Message to the user that called the feature. 
- `roll` Simple dice roller. Accepts input in  _n_ d _s_ form. (e.g. `!roll 4d6`)

## Initiative Tracker Features

- `ping` Sends a message to the DM's dashboard.
- `init [character] [score]` Updates the characters score on the DM's Dashboard. This is meant primarily for people to update the init with their own initiative rolls.
- `peek` Friendly-DM outputs a peek into the initiative order, showing the Up Now, Up Next and On Deck characters. Up Now is always shown, Up Next and On Deck are shown if the characters in those positions are PC's.
- `chaos` Player shuffles the order. Just to make things spicy.