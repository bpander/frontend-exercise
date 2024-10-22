# Givebutter Frontend Take-home

## Overview

Our goal is to fix and enhance a Pokedex application. If you are unfamiliar with the world of Pokemon, here is a brief explanation:

> The Pokedex is an electronic device created and designed to catalog and provide information regarding the various species of Pokemon featured in the Pokemon video game, anime and manga series.
 
[Source](https://pokemon.fandom.com/wiki/Pokedex)
 
Our version of the Pokedex is able to list and search through Pokemon. However, our search is a bit buggy. Additionally, we want to add a feature that shows a selected Pokemon's details like its **type**, **moves**, and **evolution chain**.

Your time is valuable, and we are extremely appreciative of you participating in this assessment. We're looking to gauge your ability to read and edit code, understand instructions, and deliver features, just as you would during your typical day-to-day work. We expect this test to take no more than one to two hours and ask to complete this work within the next two days. Upon submit, we will review and provide feedback to you regardless of our decision to continue the process.

Please update and add code in `App.js` and `index.css` based on the requirements found below. Additionally, we ask you to edit the `readme.md` with answers to a few questions found in the `Follow-up Questions` section also found below.

When you are finished, please upload your completed work to your Github and invite `@gperl27` to view it. **Do not open a PR please.**

## Setup

- This repo was scaffolded using `create-react-app`. As such, this app requires a stable version of `node` to get up and running.
- Clone this repo and run `npm install`.
- To run the app, run `npm start`.
- Please reach out to the Givebutter team if you have any issues with the initial setup or have any problems when running the initial app.

## Requirements

### Search
- Typing in the search input should filter the existing Pokemon list and render only matches found
- Fix any bugs that prevent the search functionality from working correctly
- If there are no results from search, render "No Results Found"
- The search results container should be scrollable
- The UI should match the below mockup

![](mockup0.png)

### Details Card
     
- Clicking "Get Details" for any given Pokemon should render a card that has the Pokemon's `name`, `types`, `moves`, and `evolution chain`
- Use the api functions defined in `api.js` to retrieve this data. Adding new endpoints or editing existing ones are out of scope
- The details card should match the below mockup

![](mockup1.png)

## Follow-up Questions

Please take some time to answer the following questions. Your answers should go directly in this `readme`.

- Given more time, what would you suggest for improving the performance of this app?

I'd implement some caching logic so if you click "Get Details" for a pokemon you've already gotten details for before, it would just load it from the cache rather than making all new api calls.

And the list might benefit from some memoization. In its current form, there's a max of 151 items, which isn't a ton, and it was still snappy on an old laptop so I didn't want to prematurely optimize. But a future version could display a lot more items in which case I might wrap some components in `React.memo`. There are more drastic options too like lazy-loading the items (which you could do either client-side or server-side depending on what the api supports/can handle) or throttling the filter function.


- Is there anything you would consider doing if we were to go live with this app?

I'd use TypeScript instead of vanilla JS. It wouldn't take much effort, and it'd make the code a lot more self-documenting and catch more bugs at compile-time.

I'd also add some more error handling, especially with the detail card. It makes 3 api calls to get the data for that card, and any or all of them could fail. I added _some_ error-handling, but it could definitely be a lot more robust and surface more information to the user.


- What was the most challenging aspect of this work for you (if at all)?

I found it pretty straightforward, but I can think of a couple things.

The mockups made it seem like the content should affect the width of their containers rather than the containers being a fixed/percentage-based width. So I implemented it that way, but it definitely would've been easier just to slap a defined width on the containers. It might be a better user experience too since it'd prevent the layout from shifting as you click through the pokemon. If this were a production project, I'd discuss those options with the designers.

And I was thrown for a loop when I realized the evolution chain ID was different from the species ID. I didn't find a straightforward way to get from a name to its evolution chain though I might've just missed something. I left a comment near where `fetchEvolutionChainById` is used which goes into more detail.
