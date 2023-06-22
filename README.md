# Tic Tac Toe

https://glinford.github.io/tictactoe/

## Screenshots

Supports dark and light mode

<p float="left">
  <img src="./screenshots/dark.png" width="25%" />
  <img src="./screenshots/light.png" width="25%" /> 
</p>
<p float="left">
  <img src="./screenshots/play.png" width="25%" />
  <img src="./screenshots/win.png" width="25%" />
</p>

#### Lighthouse Desktop
![Desktop](./screenshots/desktop.png)
#### Lighthouse Mobile
![Mobile](./screenshots/mobile.png)

*almost !*

## Accessibility

Our game is designed to be fully accessible and can be played using keyboard shortcuts and tabs.

## Developer Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Git
- Node.js (version 18 or above)
- npm

### Installation & Setup

1. Clone the repo and navigate into it:
    ```bash
    git clone https://github.com/glinford/tictactoe
    cd tictactoe
    ```

2. Install the project dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

## Testing

### Unit Testing

To run unit tests, use the following command:

```bash
npm run test
```

### Integration Testing

First, install the necessary browsers for Playwright:

```bash
npx playwright install
```

Then, run integration tests with either of the following commands:

```bash
npm run integ
```
or 
```bash
npx playwright test
```

You can use additional Playwright commands for more testing flexibility:

- To start interactive UI mode: `npx playwright test --ui`
- To test on Desktop Chrome only: `npx playwright test --project=chromium`
- To run tests in debug mode: `npx playwright test --debug`

After testing, you can view the last HTML report with the following command:

```bash
npx playwright show-report
```

## Production

To prepare your application for production, use:

```bash
npm run build
```

After building, you can run a sample server on port 9000 with:

```bash
(cd dist && python3 -m http.server 9000)
```

## Future Improvements

With more time, the following features could be added:

- Server-Side Rendering (SSR) for the production server
- The minimax algorithm in Wild and Misere mode (it's probably not too hard to make it work in Misere, but it gets tricky in Wild)
- Polyfills for non-modern browsers support
- Additional unit testing (especially against the AI)
- Additional integ tests (checking cells and that the message is correct)
- The animation on the play button does not work on Firefox (we could find a cross-browser alternative)

## Notes

I stuck to the initial technical design with a Rule Based AI, but during testing I felt that the computer was sometimes too easy to beat. So, I introduced a new level. If you play in standard mode against the computer, it uses a Minimax rule instead of a random rule to optimize the non-winning/non-blocking play. In this hard mode, it's significantly more challenging to win, though not impossible! This is the primary modification and deviation from the original technical design.

*Did you find the easter egg ?*

### Revision 1

My change in approach comes from initially interpreting the requirement "better than a random player" to mean that if I picked a random player from a group of people, the AI would win most of the time (>50%). Based on the feedback received, I now understand that the requirement meant that the AI should be better than a player that plays randomly.

Thanks to this revision, I believe I've now addressed the requirement that the AI should play intentionally. Minimax is used for standard-hardlevel/standard, wild/standard, standard/misere and wild/misere.

To implement minimax in Misere mode (and to avoid playing randomly), we have to invert the score (as we want the best path to a loss in standard mode). If there are multiple moves with the same score, we select a move that does not block the opponent from making a streak (and losing). If there are no such moves, we simply pick the last move submitted with the best minimax score.

For the Wild mode, the logic was pretty much the same, with the exception that I had to collect all the best moves rather than simply taking the best score returned from minimax, as multiple moves can have equal scores. From this list of moves, I had to select the move that does not grant victory to the opponent, unless forced to do so by the opponent. In Wild/Misere mode, we increase the minimax score for moves that offer a streak (meaning the opponent will lose if there are no other options).

These new changes have been validated with additional unit tests. I've also refactored few things and slightly cleaned up the code to avoid duplications.

#### Given more time I would:
- investigate if it's worth memoizing minimaxAI method since the recursion is costly (especially at the beginning of the game) and since it's a pure function, could potentially benefit from it (already added a shortcut for when the grid is empty)
- expend the suite of unit tests

#### What I would change about my approach?
- start with laying down unit tests of core features (do real TDD)
- investigate other algorithms (other than the widely popular minimax) such as Alpha-Beta Pruning or Monte Carlo Tree Search (MCTS), while it may be overkill for tic tac toe standard modes they may (or may not) offer an easier way to also support Wild/Misere
- clarify requirements upfront