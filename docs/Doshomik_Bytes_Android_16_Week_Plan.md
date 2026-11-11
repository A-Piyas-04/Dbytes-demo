# Doshomik Bytes

*Android App Architecture and 16 Week Development Plan*

## 1. Project Overview

**Doshomik Bytes (দশমিক বাইটস)** is a social learning platform focused on Machine Learning, modern Artificial Intelligence, and Research.

The content will cover the progression from foundational machine learning concepts to current AI developments, including:

Machine Learning Fundamentals → Deep Learning → Neural Networks → Transformers → Generative AI → Large Language Models → AI Agents → Emerging AI Research and Applications.

Research will be an important part of the platform, including research methodologies, scientific papers, experiments, research tools, paper summaries, and recent discoveries.

The platform will support **Bangla and English** and allow anyone to learn, teach, share knowledge, and become an educational content creator.

The central concept is to turn everyday social media scrolling into an educational experience.

All learning content, courses, and publishing features will initially be free.

## 2. Main Features

| Feature | Functionality |
| --- | --- |
| Educational Reels | Short videos, vertical scrolling, captions, likes, comments, sharing |
| Images and Carousels | Educational infographics, diagrams, visual tutorials |
| Notes and Articles | User published notes, Markdown, equations, code snippets |
| Creator Profiles | Public profiles, followers, published content, creator recognition |
| Free Courses | Structured lessons combining videos, notes, and exercises |
| Exercises | Quizzes, multiple choice questions, coding concepts, learning challenges |
| Research Content | Paper summaries, methodology explanations, findings, original paper references |
| Social Features | Following, commenting, bookmarking, sharing, discovery |
| Learning Progress | Course completion, quiz results, basic achievements |
| Content Discovery | Search, topic filtering, trending content, personalized feed |

Anyone can create educational content, not only the Doshomik team.

## 3. Android App Structure

The application will contain five main navigation sections.

| Section | Purpose |
| --- | --- |
| Home | Reels, educational posts, For You and Following feeds |
| Explore | Search, topics, creators, research papers, trending content |
| Create | Publish Reels, images, notes, quizzes, courses, and research explanations |
| Learn | Free courses, structured lessons, exercises, learning progress |
| Profile | Creator profiles, followers, publications, bookmarks, settings |

Content can be connected across sections. For example, an educational Reel can link to detailed notes, a related exercise, a full course, or a research paper.

## 4. Technical Architecture

| Component | Technology |
| --- | --- |
| Android application | React Native + Expo |
| Programming language | TypeScript |
| Backend | Node.js |
| Database | PostgreSQL |
| Background jobs | Redis |
| Video processing | FFmpeg |
| Media storage | Existing Hostinger VPS |
| HTTPS and routing | Caddy |
| Deployment | Docker Compose |
| Admin dashboard | React |
| Version control | GitHub |
| Development assistance | Codex / Claude Code |

**Hosting and domain are already available.**

The application will use the existing Hostinger VPS, with dedicated application services, database credentials, media storage, and deployment configuration.

### How the system works

1. The Android app communicates with the Node.js backend using HTTPS.

2. PostgreSQL stores user accounts, creator profiles, posts, courses, quizzes, research references, and interactions.

3. Uploaded videos, images, and files are stored on the VPS.

4. Redis and FFmpeg handle video processing in the background.

5. The backend manages authentication, content, search, learning progress, and permissions.

6. An admin dashboard manages users, reported content, and moderation.

Initial Reels will support videos up to 60 seconds, with controlled upload sizes and optimized playback.

The architecture will support a future iOS application using the same backend.

## 5. Development Timeline

**Total development period: 16 weeks**

| Timeline | Development Focus | Deliverable |
| --- | --- | --- |
| Weeks 1 to 2 | Project setup, UI design system, navigation, Bangla and English support, database architecture | Functional Android interface |
| Weeks 3 to 4 | Authentication, user profiles, creator profiles, followers, account settings | Working account system |
| Weeks 5 to 6 | Notes, image posts, carousels, content publishing, feed, likes, comments, bookmarks | Functional social feed |
| Weeks 7 to 8 | Video uploading, compression, thumbnails, vertical Reel playback, sharing | Educational Reels system |
| Weeks 9 to 10 | Course creation, structured lessons, quizzes, exercises, learning progress | Learning and practice system |
| Weeks 11 to 12 | Research paper summaries, publication references, search, creator discovery, topic filtering | Research and discovery features |
| Weeks 13 to 14 | Admin dashboard, moderation, reporting, blocking, security testing, closed testing | Android beta |
| Weeks 15 to 16 | Bug fixes, performance optimization, Android device testing, Google Play requirements | Production release candidate and store submission |

Google Play approval may extend beyond the development period.

## 6. Development and Testing

Codex and Claude Code will assist with frontend development, backend implementation, database integration, automated testing, and debugging.

Development should proceed feature by feature, with each feature tested before integration.

Testing priorities include:

1. Android performance and smooth Reel scrolling.

2. Bangla and English content rendering.

3. Media uploads and video playback on slower networks.

4. Authentication, permissions, and account security.

5. Creator publishing and content management.

6. Course and quiz functionality.

7. Content reporting, user blocking, and moderation.

8. Backend resource usage and database performance.

The application must include basic administrative controls, account deletion, and appropriate content moderation before public release.

## 7. Features for Later Versions

The initial release will prioritize a reliable learning and creator experience.

Future versions can introduce:

1. AI powered personalized recommendations.

2. AI generated paper explanations and study assistance.

3. Advanced coding challenges with code execution.

4. XP, streaks, competitive leaderboards, and expanded gamification.

5. Livestreaming and interactive classes.

6. Creator monetization.

7. Collaborative learning and research groups.

8. iOS and expanded web applications.

## 8. Expected Outcome

Within 16 weeks, the goal is to deliver a functional Android application where users can:

1. Discover educational content from ML fundamentals through modern AI and research.

2. Watch and publish educational Reels.

3. Share images, study notes, and technical explanations.

4. Follow educators and build creator profiles.

5. Create and access free courses.

6. Practice through quizzes and exercises.

7. Publish and explore research paper summaries.

8. Interact with an educational community in Bangla and English.

**The initial release will establish Doshomik Bytes as a free social learning and educational creator platform, with Android as the first platform and the existing Hostinger infrastructure as its backend.**
