# Doshomik Bytes — Project Context

Social learning platform for Machine Learning, modern AI, and Research — Bangla + English. "Turn scrolling into learning." Anyone can consume or create educational content (not just the team). All content/courses are free in v1.

**Content ladder:** ML Fundamentals → Deep Learning → Neural Networks → Transformers → Generative AI → LLMs → AI Agents → Emerging Research.

**Team:** 2 part-time developers, AI-assisted (Cursor + Claude Code), working around full-time day jobs (evenings + weekends). Not a solo/full-time team — pace and scope decisions should account for this.

**Client:** technical background, owns the Hostinger VPS already in use. Gave a 16-week (~4 month) development plan; Google Play review may extend past that.

## Platform & Tech Stack
- Android first (React Native + Expo, TypeScript); architecture designed to support iOS later on the same backend
- Backend: Node.js, self-hosted on the client's Hostinger VPS (not a managed BaaS)
- Database: PostgreSQL
- Background jobs / caching: Redis
- Video processing: FFmpeg
- Media storage: on the VPS
- HTTPS/routing: Caddy · Deployment: Docker Compose · Admin dashboard: React (web, separate from the mobile app)
- Version control: GitHub

## Navigation — 5 tabs (final, locked)
1. **Home** — mixed feed: Reels (full-bleed vertical video), image/carousel posts, and notes/articles. Top toggle: **For You / Following**.
2. **Explore** — search + topic chips (the content ladder above) + segmented control **Trending / Research / Creators**. Research lives here, not as its own tab (Paper Byte cards: Problem → Key Idea → Takeaway → link to original paper).
3. **Create** (center, elevated **+** button, opens a bottom sheet, not a screen) — Reel / Photo-Carousel / Note-Article / Course / Research Summary, each its own publish flow.
4. **Learn** — courses + structured lessons + progress. Practice (MCQ quizzes) is folded in here, not a separate tab: a quick-access "Practice" card plus a quiz attached to each lesson.
5. **Profile** — own or others' creator profile (Posts / Courses / Research tabs), Saved, Learning Progress, Following, Settings (language, account, notifications, privacy, report, block, delete account, logout).

Full screen-by-screen component detail: see `Doshomik_Bytes_Screen_Design_Spec.md`.

## MVP Feature Set (per client's doc)
Educational Reels (likes/comments/share), image/carousel posts, notes/articles (markdown, code, equations), creator profiles + followers, free courses (lessons + exercises), quizzes/exercises, research paper summaries, social actions (follow/comment/bookmark/share), learning progress tracking, search/topic filtering/trending/personalized feed, bilingual content (Bangla/English), basic admin moderation (reports, blocking, account deletion).

## Explicitly Out of Scope for v1
AI-powered recommendations or paper explanations, in-app code execution/coding challenges, XP/streaks/leaderboards/gamification, livestreaming, creator monetization, collaborative groups, iOS build, web app.

## Timeline
16 weeks (~4 months) per client's plan: wk1-2 setup/UI/i18n/DB, wk3-4 auth/profiles, wk5-6 social feed, wk7-8 Reels, wk9-10 courses/quizzes, wk11-12 research/discovery, wk13-14 admin/moderation/closed testing, wk15-16 bug fixes/perf/store submission. Play Store review can extend beyond week 16.

Google Play note: new **personal** developer accounts require a 14-day/12-tester closed test before production access; **organization** accounts (needs a D-U-N-S number) are exempt — worth settling with the client early since D-U-N-S can take up to 30 days.

## Open Questions (unresolved, confirm with client before building)
1. Pre-publish content moderation, or publish-immediately with post-review?
2. Are course lessons locked in sequence, or freely browsable?
3. Is direct messaging in scope for v1?
4. Does the language preference setting filter *content shown*, or only the UI chrome?
5. Video length limits / allowed media types — not yet finalized.
