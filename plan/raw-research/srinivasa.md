1. Reel Spin Timing
The math is decided before reels visually stop — animation is pure presentation, but it drives the feel.

300–500 ms hold before final reel lands makes near-misses feel motivating
Stagger reel stops (left → middle → right, ~150 ms apart) — feels fairer than simultaneous stops
Total spin time around 1.5–2 seconds is the sweet spot
Add a turbo/skip button for Karen

2. Win Feedback — Count-Up Principle
at freeslots.com and it holds up: animate gains, not losses.

Win count-ups extend the dopamine window
Losses resolve instantly — dwelling on them breaks flow
Tier the feedback: small win = flash, medium = particles, jackpot = full-screen celebration

3. CSS vs. JS Animation (Engineering)

CSS for simple transitions (button press, win flash, modals) — runs on GPU compositor thread, smoother
requestAnimationFrame for the reel loop — never setInterval, which causes jank
Animate only transform and opacity in hot loops — avoid top/left/width which trigger layout recalc

4. Accessibility

Support prefers-reduced-motion or ship an explicit motion toggle (also covers Picky Pete's story)
Slot machines are among the worst offenders for motion-triggered discomfort — cheap to fix

Key Asks for AI Prompts

requestAnimationFrame + CSS transform for reels (not setInterval)
Staggered reel stops
Count-up on gains only
Tiered win feedback (small / medium / jackpot)
Motion toggle in settings

Sources

On Magazine — The Slow Spin Effect (millisecond timing in slot animations)
MDN — CSS and JavaScript animation performance
web.dev — CSS versus JavaScript animations