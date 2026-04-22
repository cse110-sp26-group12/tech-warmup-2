# Research Overview

This doc summarizes the research the team put into the raw-research folder for Tech Warmup II, and lays out what each of us contributed during the research phase. Per the assignment, we had to do research on both the domain (slot machine apps) and the users, and that is what the raw-research folder collects.

## Summary

### Domain research

Cedric and Nathan looked into what modern slot machines actually are, using the Valley View Casino writeup and the BetMGM blog. The basic picture is that modern machines have 5 or more reels, lots of paylines, a consistent theme throughout (jungle, Star Trek, Pokemon, Vegas, etc.), and features like free spins, multipliers, and progressive jackpots. Both of them also spent some time on freeslots.com as a hands-on reference, since it is close to what we are actually building and it gives a good baseline for SFX, button layout, and animation feel. Nathan also has observations on the freeslots.com UX specifically, things like the count-up animation on wins, the Tropical Safari bonus mode, and the Add Credits button when you run out.

Alex compiled slot machine lingo, theme ideas, goals, and some prompting notes in a shared Google Doc. Three reference images are in the raw-research folder (pokemonslotmachine.jpeg, startrekslotmachine.jpg, vegasvideoslots.jpeg) so there is a visual target when we prompt the AI.

One thing worth noting is that we initially leaned toward a Pokemon theme since our team mascot is Porygon, but Julian checked with the TAs on Apr 20 and they clarified the theme has to be about making fun of AI, so we pivoted to an AI-mockery theme after that.

### User research

The assignment requires at least 2 personas and 5 user stories, and the team has both.

personas.md defines Karen (the high-stakes gambler who is there for the big wins, wants autoplay, live jackpot, and no distractions) and Gary (the for-fun player who wants lights, themes, side-stats, and low-volatility play to make $20 last).

user-stories.md extends this to five total users: Karen, Gary, Strategic Sam (wants spin stops so she can time her rolls), Casual Cathy (wants clear visual and sound feedback), and Picky Pete (wants control over the music, sounds, and visual theme). Picky Pete's story ties directly back to some of the accessibility research in the engineering notes, since his need for a custom visual/audio theme is basically an accessibility feature, which shows up later in Srinivasa's research on prefers-reduced-motion.

### AI inside the product

Some of the research looked at how AI could be used as a feature inside a slot machine, not just as a tool to build one. Yanbai and Zhengyin both have notes on this side. The ideas include personalization based on play style, adaptive difficulty with near-miss design, and predicting whether a user is about to stop playing. Yanbai also raises the ethical concerns around those techniques, which seems important since a slot machine is already a persuasive surface and using AI to make it more so has obvious issues.

These ideas are probably out of scope for the warmup since we are not training a model, but they still inform what we choose to build and not build.

### Engineering foundations

Srinivasa's notes are the most technical and the most build-ready part of the raw-research folder. His main points are: a 300 to 500 millisecond hold before the final reel lands (makes near-misses feel more motivating), staggered reel stops about 150 ms apart going left to right (feels fairer than all three stopping at once), total spin time around 1.5 to 2 seconds, use requestAnimationFrame for the reel loop instead of setInterval since setInterval causes jank, and only animate transform and opacity in hot paths since animating properties like top/left triggers layout recalc. Also, count up on gains only, not losses, since dwelling on a loss breaks flow. Tier the feedback so small wins flash, medium wins get particles, and jackpots get full-screen. And support prefers-reduced-motion, or ship a motion toggle in settings, which also covers Picky Pete's user story.

Varsha's research is more feature-level: auth, age verification, bonus rounds, themed machines, and smooth cross-device performance. She also wrote out code-quality expectations (well-commented, consistent style, minimal div soup, no duplicated code) and found a YouTube tutorial of someone building a slot machine with AI that could be useful as a prompt-strategy reference.

### Testing and process

Julian's research covers the testing and process side. He lays out what a test case should look like (unique ID, description, summary, preconditions, exact steps, expected vs actual output), and says we should cover both normal play and adversarial cases like someone intentionally trying to break the game. He also recommends light/dark mode as an accessibility requirement and pointed the team to the Pokerogue open-source game repo as an example of what a properly developed codebase looks like.

Kyle's research is focused on AI workflow ideas: PRD-driven iteration where each work item is one context window worth of work, fresh context per subagent spawn (since models start forgetting earlier decisions around the 30 to 50k token mark), a verification step before marking an item complete so the agent re-reads what it wrote instead of just trusting its own summary, and a harness/model recommendation (Claude Code with Opus for orchestration and Sonnet for workers). Kyle's file also flags a few risks we could run into (context starvation, the agent committing on our behalf, skipping the log step when hand-editing, and agents claiming items are complete when they aren't actually verified).

## Other references

- The Miro board is linked in miro-link.md, which is where we did some of the early brainstorming.
- Julian shared the Pokerogue repo on GitHub as a structural reference for what a well-developed open-source game codebase looks like.
- Varsha and Zhengyin both found YouTube tutorials of people building slot machine apps with AI.

## Team roster

What each person contributed during the research phase. Research files are in `/plan/raw-research/` unless otherwise noted.

- **Cedric Wells** has been our team lead since Apr 17, and he set up the repo workflow with the research branch. His research file is cedricwells.md, covering slot machine industry conventions (video vs classic, reel and payline norms, how themes are used).

- **Jialin (Julian) Wang** was team lead before Cedric and stepped down on Apr 17. His research file is jialinwang.md, which covers test case structure, light/dark mode accessibility, and the recommendation to include a game design doc. He also shared the Pokerogue repo as a reference.

- **Zhengyin Yang** set up the tech-warmup-2 repo and the research branch, and coordinated where research files go. His research file is zhengyin.md, covering AI personalization, adaptive difficulty, and user behavior prediction.

- **Yanbai (William) Li** wrote Yanbai_Li.md, which covers AI-driven personalization, UX improvements, behavior prediction, and the ethical side of applying those techniques to a gambling interface.

- **Srinivasa Perisetla** wrote srinivasa.md, covering reel spin timing, staggered stops, requestAnimationFrame vs setInterval, the count-up-on-wins asymmetry, and prefers-reduced-motion. This is the most technical file in the folder.

- **Varsha Jawadi** wrote Varsha.md, with a feature list (auth, age verification, bonus rounds, themed machines, smooth cross-device performance), code-quality requirements, and a YouTube tutorial link for AI-assisted slot machine builds.

- **Alexander Twano** contributed his research through a shared Google Doc (linked in alex.md in the raw-research folder), covering slot machine lingo, themes, family-sourced ideas, and prompting strategies.

- **Nathan Scott** wrote nathan.md, covering what makes slot machines popular (from the BetMGM blog) and hands-on freeslots.com observations (count-up animation, Tropical Safari bonus mode, Add Credits UX, SFX patterns).

- **Kyle Kim** wrote kyle.md, a longer file focused on AI workflow ideas: PRD-driven iteration, fresh-context subagents, a verification step before marking items complete, progress-doc structure, and a harness/model recommendation. Also flagged a few AI-specific risks (context starvation, agent commits, hand-edit logging, agents claiming items complete when they aren't verified).

- **Joshua Robles** and **Raiden Louie** do not have research files in the raw-research folder at the time of writing this overview. 