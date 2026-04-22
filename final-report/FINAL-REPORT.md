# Final Report: Using AI for Engineering Development

## Introduction
This project was mainly about exploring whether AI can work as a development tool to help build a more complete web application. The project we created was an AI-themed slot machine website with a humorous “AI mockery” style, using vanilla HTML, CSS, JavaScript, and platform APIs. From the beginning, the goal was not just to make a game that technically worked, but to make something that looked more interesting, had a clear theme, and felt enjoyable for different types of users.

In the design process, we used two very different personas as guidance. Karen represented a high-risk player who cared more about high bets, big wins, and jackpots. Gary represented a more casual player who cared more about entertainment, smaller bets, and getting frequent feedback even when not winning much. Based on those personas, we decided to start with a smaller version of the game, with only 3 reels and 1 payline, and then expand it step by step through multiple rounds of prompting and revision.

This report explains the overall development process, the patterns shown in the iteration data, the results of each major stage, and my final understanding of what it means to use AI as a tool for engineering development.

## Project Plan and Development Strategy
From the start, this project was not meant to be completed in one prompt. Instead of asking AI to generate a finished product all at once, the plan was to first create a basic version and then improve it through later prompts. The earliest prompt set a few core requirements: the application had to use standard web technologies, it had to follow an AI mockery theme, it had to reflect the given personas and user stories, and it had to begin with only 1 payline and 3 reels. On top of that, the initial plan also asked AI to follow clean code principles such as meaningful names, small functions, modularity, error handling, and maintainability.

I think this strategy mattered a lot because it kept the project manageable. Instead of making the problem too large at the beginning, it gave AI a task that was clear but still limited enough to produce a workable prototype. After that, if there were bugs, weak UI choices, or missing persona-related features, those issues could be fixed in later iterations instead of forcing the project to restart. In that sense, the project treated AI as a development partner that could be guided over time, not as a one-time answer generator.

## Development Process
The biggest characteristic of this project was how iterative it was. According to the development log, the project went through 23 iterations. During those iterations, AI was used to generate code, fix bugs, improve the interface, refactor logic, and expand the overall game experience.

### Phase 1: Initial Build
The first iteration focused on getting the project started. AI generated the three main files, `app.js`, `index.html`, and `style.css`, and implemented the basic structure of the game. This included features like betting, logs, themes, statistics, and an auto-spin style feature. In other words, the first version successfully created the foundation of the slot machine app.

At the same time, the first version had several obvious problems. There was no way to add more tokens into the game. The auto-optimize feature could keep running even when the player had no tokens left. The user interface did not look very polished. Also, even though the personas and user stories were included in the original prompt, they were not really reflected in the actual gameplay. This phase showed an important reality of AI-based development: AI can produce a working prototype quickly, but that first output is usually still far from matching the full design intention.

### Phase 2: Stability and Code Quality
The second phase was mainly about fixing bugs and cleaning up the code. At this point, the focus was no longer just “make it work,” but “make it work more reliably and make the code easier to understand.” Problems related to token handling and auto-bet behavior were fixed during this stage. The prompt for this phase also clearly asked AI to improve the code through linting, JSDoc comments, documentation, and cleaner structure.

Later on, there was also another iteration that returned to code readability and expandability, asking AI to improve the organization without changing the logic too much. I think this phase is important because it shows that AI is not only useful for creating new features. It can also help with refactoring and cleanup. However, that only works well when the prompt is specific. If the request is too broad, like just saying “make the code cleaner,” the result may look more organized on the surface without actually improving the structure very much.

### Phase 3: Theme and Experience Design
The third phase focused on strengthening the project’s style and overall experience so that it felt like more than just a normal slot machine. This phase added more AI-related symbols, emojis, and logs. It also added animations, sound effects, visual feedback, glowing effects, casino-style buttons, and an animated gradient background. Overall, these iterations were about giving the application more personality and making it more visually appealing.

This was one area where AI seemed especially helpful. A prompt like “make it feel more like a casino while still keeping the AI theme” is pretty abstract, and if I had done that manually from scratch, it probably would have taken more time to experiment with ideas. AI’s advantage here was that it could quickly generate a visible version of that idea, which then made it easier to judge whether the direction worked or needed more changes. So in terms of style, mood, and UX experimentation, AI was clearly useful.

### Phase 4: Persona-Based Expansion
The fourth phase was an important turning point because the project started to move beyond visual changes and began turning the personas into actual gameplay differences. At this point, the game was expanded into three separate modes: ChatGPT, Gemini, and Claude. Each mode was designed around a different difficulty level and user style.

Claude mode was aimed more at Karen’s type of player, with higher volatility, higher stakes, and a jackpot feature. ChatGPT mode was more like Gary’s style, with more frequent wins and a more relaxed experience. Gemini was positioned in the middle as a medium-difficulty option. On top of different payout structures and pacing, each mode also had its own theme, emojis, logs, and overall feeling. This phase showed that the personas were no longer just ideas in the planning document. They were actually turned into mechanics inside the game.

### Phase 5: Advanced Feature Expansion
The fifth phase covered all of the later iterations where the project became much more complex and polished. At this point, the game was no longer a simple slot machine prototype. It was being expanded into a fuller system with more features and more customization. These later iterations added payout information, modal pop-ups, more refined button styling, background and color changes, mode-specific spin speeds, Claude’s jackpot rules, more reels and paylines, a paytable, missions, language settings, sound customization, and more environment controls.

At the same time, this phase also showed one of the biggest weaknesses of AI-assisted development: the more features were added, the easier it became for old bugs to come back. Some layout problems had already been fixed before, but returned after new features were introduced. Issues like neural logs pushing the page downward, buttons getting cut off, and the page no longer fitting on one screen happened more than once. In other words, AI was good at rapidly adding features, but not always good at preserving earlier fixes in a consistent way. That is why many of the later iterations involved both adding new features and re-fixing older problems.

## Data from the Iteration Log
The main data for this project did not come from surveys or experiments. Instead, it came from the development process itself, especially the prompt history recorded across each iteration. For every step, the log described what was requested, what AI produced, what worked, what did not work, and whether any hand-edits were needed. Even though this is not traditional numerical data, it still provides useful evidence for evaluating how AI performed during engineering development.

From those records, I think several clear patterns appeared.

1. Most iterations did lead to some kind of progress. This was especially true when the prompt was very specific. AI often handled focused tasks well, such as fixing one bug, changing a button style, adding a modal, or adjusting the spin speed for just one game mode. This suggests that AI performs more reliably when the scope of the request is narrow and clearly defined.

2. UI and layout problems were the most likely to repeat. Issues like logs expanding the page, elements being cut off, scrolling becoming necessary, or settings not opening correctly as a modal were fixed in one iteration and then reintroduced later after other changes. This suggests that AI had limited consistency when dealing with the project as a whole over time.

3. The quality of the output depended heavily on how specific the prompt was. When the request clearly stated what to change and what not to change, the result was usually better. When the request was more general, such as “make the UI better” or “make the code cleaner,” the results were less predictable. This means that in AI-assisted development, prompt writing becomes part of the engineering process itself.

4. Even though most of the work was generated by AI, hand-edits were still necessary sometimes. For example, there was at least one case where a syntax problem had to be fixed manually by removing a repeated variable declaration. This did not happen often, but it shows that AI-generated code still needs to be reviewed.

5. AI was good at feature expansion, but not as strong at preserving long-term structural consistency. As the project became more complex, it became more common for new functionality to appear alongside old problems returning. This pattern became especially noticeable in the later iterations.

## Results
Overall, the project was successful. By the end of development, the application evolved from a simple three-reel slot machine prototype into a much richer browser game with:

- multiple AI-themed modes,
- differentiated payout structures,
- a jackpot system for Claude,
- expanded reels and paylines,
- mission tracking,
- improved visual feedback and animation,
- modal-based settings and paytables,
- more polished button styling and layout,
- customization options such as language, color, and sound themes.

The final product appears to have met many of the original goals: it was more entertaining, more visually engaging, more personalized to different player types, and more aligned with the AI-mockery concept than the original version.

At the same time, the process also revealed limits. Some features were only “successful enough,” not deeply polished. For example, audio customization mostly changed pitch instead of introducing truly distinct sound themes. Some changes technically worked but still required more UX refinement. In other cases, there were lingering doubts about whether systems such as the jackpot logic were fully correct without additional testing.

## Discussion: What This Project Shows About Engineering With AI
The strongest conclusion from this project is that AI works best as an iterative engineering partner, not as a substitute for engineering judgment.

AI was especially valuable in four ways:

### 1. Fast Prototyping
The AI could quickly generate a working baseline and add new features with very little setup time. This is a major advantage for early-stage experimentation.

### 2. Rapid Iteration
Because prompts were easy to write and revise, the development cycle was fast. Bugs, design ideas, and feature requests could be turned into new code quickly.

### 3. Thematic and UX Brainstorming
The AI was very effective at translating broad creative direction into concrete interface changes, themes, logs, and animations.

### 4. Refactoring Support
When given explicit expectations, the AI could improve naming, documentation, organization, and structure.

However, the project also made the weaknesses of AI-assisted engineering very clear:

### 1. Regression Risk
The AI frequently reintroduced old bugs or broke previous layout fixes when adding unrelated new features. This suggests weak long-term state management and an incomplete understanding of the project’s full architecture.

### 2. Need for Precise Prompting
The quality of the output depended heavily on the specificity of the prompt. Vague requests often produced mixed results, while precise constraints gave much better outcomes.

### 3. Uneven Reliability
Some outputs were excellent, while others only partially matched the request. This means human review is always necessary.

### 4. Testing Still Matters
Even when the generated code looked correct, the process log showed recurring suspicions about hidden bugs, such as jackpot behavior or unintended payout logic. AI can accelerate coding, but it does not remove the need for validation.

In other words, AI helped most when it was treated like a fast, flexible collaborator whose work needed supervision, verification, and direction.

## Lessons Learned
Several practical lessons emerged from the project:

- Start with a small scope and build outward. This made the project manageable and helped isolate issues early.
- Keep prompts specific. The best outputs came from precise instructions with clear constraints.
- Log every iteration. The written process log made it easier to evaluate what changed, what improved, and what problems kept returning.
- Re-test old features after each major change. Many regressions came from later additions rather than original bugs.
- Use AI for both creation and revision. The tool was useful not only for building features, but also for cleaning, restructuring, and documenting code.
- Do not assume “working” means “finished.” A feature may technically function while still being weak from a UX or design standpoint.

## Conclusion
This project demonstrated that engineering with AI can be highly productive, especially for rapid prototyping, iterative feature development, and interface experimentation. The AI significantly accelerated development of the slot machine application and helped transform a simple starting concept into a more complex and engaging final product.

At the same time, the process showed that AI is not a fully reliable autonomous engineer. It can misunderstand intent, reintroduce old bugs, and require repeated correction as complexity increases. The most effective workflow was not “ask once and accept the result,” but rather a cycle of prompting, evaluating, refining, and testing.

Ultimately, the main takeaway is that AI is most powerful when paired with human oversight. It can generate ideas, code, and revisions quickly, but meaningful engineering still depends on a person defining goals, checking results, recognizing tradeoffs, and deciding what quality should look like.

