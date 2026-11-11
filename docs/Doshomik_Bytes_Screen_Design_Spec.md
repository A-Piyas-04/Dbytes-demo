# Doshomik Bytes — Screen & Navigation Design Spec

Based on the client's 16-week plan (Home / Explore / Create / Learn / Profile) and our nav discussion (Reels = Home, Research nested in Explore, Practice folded into Learn).

---

## 0. Global Navigation

**Bottom bar — 5 items, standard layout:**

| Position | Icon/Label | Behavior |
|---|---|---|
| 1 | Home | Default landing tab on app open |
| 2 | Explore | Search + discovery |
| 3 | **+ Create** | Raised/elevated circular button, center, floats above the bar line (like Instagram/TikTok) — opens a bottom sheet, not a screen |
| 4 | Learn | Courses + practice |
| 5 | Profile | Own profile when tapped from nav; shows avatar thumbnail instead of generic icon |

**Top bar (present on Home, Explore, Learn — not a fixed design, but consistent elements):**
- Left: app wordmark/logo (small)
- Right: language toggle chip (`বাং` / `EN`, tap to switch, persists as user preference) + notification bell icon (badge dot when unread activity exists — likes/comments/follows/replies)
- Notification bell opens an **Activity screen** (not a tab, pushed on top): list of "X liked your reel," "Y started following you," "Z commented: ...", tap any → navigates to that content/profile.

---

## 1. Home

**Purpose:** default content feed — reels + image/carousel posts + notes, mixed.

**Top, below the app bar:**
- Segmented toggle: **`For You` | `Following`** — For You = algorithmic/topic-matched mix, Following = only accounts the user follows. Defaults to For You on first open.

**Feed body — vertical scroll, three possible card types render inline:**

1. **Reel card** (full-bleed, TikTok-style)
   - Full-screen vertical video, auto-plays on scroll-into-view, muted-by-default with tap-to-unmute (or respects last mute state)
   - Overlaid, bottom-left: creator avatar (tap → creator profile) + creator name + **Follow** button (if not already following) + caption text (truncated, "more" expand) + topic tag chip (e.g. `#NeuralNetworks`)
   - Overlaid, right-side vertical icon stack: ❤️ Like (count), 💬 Comment (count, opens comment sheet), 🔖 Save, ↗ Share
   - If the reel is tagged to a course/lesson/research paper: a **"Learn more →"** pill sits just above the caption, tapping it deep-links to that Learn course page or Explore→Research paper page

2. **Image/Carousel post card** (Instagram-style, not full-bleed — fits in scrollable card)
   - Header row: creator avatar + name + topic tag + "···" overflow menu (report/not interested/copy link)
   - Media: single image or swipeable carousel (dot indicator below if multiple images)
   - Caption below media (expandable)
   - Action row: Like, Comment, Save, Share (same icon set as reels, horizontal not vertical here)

3. **Note/Article post card**
   - Header row: same as image post
   - Body: title (bold) + plain-text excerpt (2–3 lines, supports inline code formatting and rendered math/equations if present in the excerpt) + **"Read full note →"**
   - Tapping opens a dedicated reader screen: full markdown-rendered note with code blocks, equations, and inline images
   - Same action row at the bottom

**Empty/first-run state:** if Following is empty, show a prompt card: "You're not following anyone yet — explore creators" with a button linking to Explore → Creators segment.

---

## 2. Explore

**Purpose:** search, topic browsing, trending, research, creator discovery.

**Top:** persistent search bar — placeholder text "Search topics, creators, papers..."
- Tapping it (before typing) shows **Recent searches** + **Suggested topics** as chips
- Typing shows live results grouped by type: Creators / Topics / Reels & Posts / Research papers (each group header, max 3 shown + "See all")

**Below the search bar — horizontal scrollable topic chip row** (the content ladder from the client's doc, used as the taxonomy):
`ML Fundamentals` · `Deep Learning` · `Neural Networks` · `Transformers` · `Generative AI` · `LLMs` · `AI Agents` · `Emerging Research`
Tapping a chip filters the grid below to that topic.

**Below that — a segmented control (this is where Research lives, not as a separate tab):**
`Trending` | `Research` | `Creators`

- **Trending segment:** grid (2–3 columns) of thumbnail tiles — reels, image posts, and notes mixed, sorted by recent engagement. Tapping opens that content in-place (reel → full player, post → feed-style card, note → reader).
- **Research segment:** vertical list of **Paper Byte cards**:
  - Title of the paper/summary
  - Source/original publication name + author(s), small text
  - One-line takeaway (the "key idea" field)
  - Tapping opens the **Paper Byte detail screen**: Problem → Key Idea → Takeaway (three labeled sections), an optional diagram/visual if the creator added one, and a **"Read original paper →"** external link button at the bottom.
- **Creators segment:** vertical list of suggested/trending creators — avatar, name, short bio line, follower count, inline **Follow** button (no need to open profile to follow).

---

## 3. Create (center button → bottom sheet, not a screen)

Tapping **+** opens a bottom sheet with 5 options, each routing to its own flow:

1. **Reel** → record (in-app camera) or upload from gallery → trim/preview → add caption + topic tag + language tag (`Bangla` / `English` / `Mixed`) → **Publish**
2. **Photo/Carousel post** → select 1–10 images from gallery → reorder (if multiple) → add caption + topic tag + language tag → **Publish**
3. **Note/Article** → title field + rich text editor (supports headings, code blocks, inline math/equations, inline images) → topic tag + language tag → **Publish**
4. **Course** → title + description + cover image → **Add Lesson** (repeatable: each lesson = title + video or note content + optional attached quiz) → reorder lessons by drag → **Publish Course**
5. **Research Summary** → paper title + original source link + three required fields (Problem / Key Idea / Takeaway) + optional diagram upload → **Publish**

All flows end on a **"Submitted for review"** confirmation if moderation is pre-publish, or go live immediately with a **"Published"** confirmation if post-review moderation is used (this policy choice is listed as still-open in the product doc — confirm with client before building).

---

## 4. Learn

**Purpose:** structured courses + practice, replacing the separate Practice tab.

**Top of tab — two quick-access cards side by side:**
- **"Continue Learning"** — shows the most recent in-progress course with a progress bar (e.g. "Neural Networks Fundamentals — 60% complete"), tapping resumes at the next lesson
- **"Practice"** — quick-access button/card leading to a standalone topic-wise quiz list, for a user who wants to drill MCQs without being inside a specific course

**Below — "Recommended for You"**: horizontal scroll of course cards (title, creator, lesson count, topic tag), matched to the user's interests/past reel engagement

**Below — "All Courses"**: full list/grid, filterable by the same topic chips used in Explore, each card shows title, creator, lesson count, estimated time, and a difficulty tag if the creator set one

**Course detail screen** (tapping any course card):
- Header: cover image, title, creator (tap → creator profile), short description, **Start**/**Continue** button
- Ordered lesson list below: each row = lesson number, title, type icon (video/note/mixed), duration, checkmark if completed, small lock icon if sequential unlocking is enabled (open question — confirm with client whether lessons must be done in order or are freely browsable)

**Lesson viewer screen:**
- Video or note content (same renderer as Home's note reader, reused)
- Bottom: **"Mark as complete"** button, and if this lesson has an attached quiz, a **"Practice this lesson →"** button appears after marking complete

**Practice flow (standalone, from the quick-access card):**
- Topic list (reuses the same topic chips) → tapping one shows available quiz sets for that topic → tapping a quiz set starts the MCQ flow: one question at a time, select an answer, immediate correct/incorrect feedback with a short explanation, **Next** button, ending on a results summary screen (score, review-wrong-answers option)

---

## 5. Profile

**Own profile (when Profile tab tapped):**

**Header:**
- Avatar, display name, short bio
- Follower count / Following count (tappable → list screens)
- **Edit Profile** button
- Row of icon-buttons: Settings (gear icon)

**Tabbed content below header** (horizontal segmented control):
`Posts` | `Courses` | `Research`
- **Posts**: grid of everything this user has published — reels, images, notes, mixed, most recent first
- **Courses**: list of courses this user created (if any) — relevant mainly for creator accounts
- **Research**: list of research summaries this user has published

**Separate menu items (accessed via the gear icon → Settings screen, or a secondary row under the header — pick one, don't duplicate):**
- **Saved/Bookmarks** — everything the user has saved across Home/Explore/Learn, in one list, filterable by content type
- **Learning Progress** — list of all courses started/completed with progress bars, and quiz history with past scores
- **Following** — list of creators the user follows

**Settings screen:**
- Language preference (content language filter — doesn't just change UI language, also filters what content is shown by default)
- Account (email, password change, linked accounts)
- Notifications (toggle categories: likes, comments, follows, course updates)
- Privacy (who can message/comment, if applicable)
- **Report a problem**
- **Block list** (manage blocked users)
- **Delete account** (with confirmation step — required by Google Play policy)
- **Log out**

**Viewing someone else's profile** (tapped from a reel/post/comment, not own tab): same header layout but **Edit Profile** is replaced with **Follow/Following** button and a **Message** button if DMs are in scope (not currently in the feature list — confirm before building); same three-segment tab row (Posts/Courses/Research), no Settings gear shown.

---

## Admin Dashboard (separate React web app — not part of the 5 mobile tabs)

Not a mobile screen, but part of the system per the client's architecture doc. Minimum screens needed before public release:
- **User management** — search users, view account details, suspend/ban
- **Reported content queue** — list of user-reported reels/posts/notes/comments, with approve/remove/warn actions
- **Content moderation log** — audit trail of moderation actions taken
- **Basic stats** — user count, content count, daily active users (even a rough version helps you and the client see real usage once live)

---

## Open questions to settle with the client before building these screens

1. Pre-publish moderation review, or publish-immediately with post-review? (Affects the Create flow's confirmation screen.)
2. Are course lessons locked in sequence, or freely browsable? (Affects the course detail screen's lock icons.)
3. Is direct messaging (DM) in scope at all for v1? (Affects whether "Message" appears on other users' profiles.)
4. Does "content language preference" in Settings filter what's shown, or only translate UI chrome? (Affects Home/Explore/Learn's default filtering behavior.)
