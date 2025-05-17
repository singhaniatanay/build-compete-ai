## `masterplan.md`

### 📌 App Overview

**Name (TBD):** AI Challenge Arena (placeholder)

**Goal:** Create a web-based platform where AI practitioners solve real-world challenges from companies by submitting functional MVPs, which are scored by automated LLMs and human judges.

**Outcome:** Surface top AI talent based on real-world problem-solving skills, and provide companies with direct access to ranked candidates for hiring/freelance roles.

---

### 🎯 Target Audience

- **AI Builders (Candidates):**
    - Solo developers, aspiring or mid-level AI engineers, bootcamp grads, or non-traditional applicants looking to prove real-world competency.
- **Hiring Partners (Companies):**
    - Startups or mid-sized companies seeking pre-vetted, motivated AI talent through practical evaluations.

---

### 🧩 Core Features

### Candidate-Facing

- OAuth-based sign-in via GitHub
- Challenge discovery & participation
- Submission pipeline:
    - GitHub repo link
    - 2-min demo video (mp4)
    - Presentation deck (PDF/pptx, max 5MB)
- Real-time leaderboard (40% LLM score based)
- Badging system (Top 10%, Sponsor Favorite, etc.)
- Candidate dashboard with:
    - Challenge participation status
    - Rank and badge collection
    - Submission history and performance trend

### Company-Facing

- Company dashboard with:
    - Active and past challenge management
    - Submission insights (scores, timestamps)
    - Access to candidate packets (repo, deck, video)
- Challenge creation with multi-problem support
- Invite external human judges by email/user ID

### Common

- Notification system (submission received, score posted, badge awarded)
- Hybrid leaderboard (real-time event + season-based career score)

---

### 🧱 High-Level Technical Stack (Suggested)

| Layer | Suggested Tools | Rationale |
| --- | --- | --- |
| Frontend | React + Tailwind or Next.js | Flexible, performant, modern developer stack |
| Backend/API | Node.js or Django (REST or GraphQL) | Mature ecosystem, good for rapid development |
| Auth | GitHub OAuth | Frictionless dev login, ties into repo access |
| Database | PostgreSQL or Firebase (for fast MVP) | Structured data, relational queries |
| Storage | AWS S3 or Cloudinary (video/deck storage) | Secure media handling, scalable storage |
| Sandbox Execution | Dockerized sandbox with CPU/mem limits (e.g., Firecracker, CodeSandbox, or custom) | Ensures safe, isolated code execution |
| LLM Integration | OpenAI or Anthropic API | Automate qualitative scoring & feedback |

### 📊 Conceptual Data Model

```
User
 ├─ id
 ├─ name, bio, github_url, portfolio_link, resume
 └─ role [candidate | company | judge]

Challenge
 ├─ id, title, description, sponsor_id, start_date, end_date
 ├─ dataset_links[], rubric

ProblemStatement
 ├─ id, challenge_id, title, prompt

Submission
 ├─ id, user_id, challenge_id
 ├─ repo_link, demo_video_url, deck_url
 ├─ llm_score, human_score, final_score

Badge
 ├─ id, user_id, badge_type [top10, sponsor_pick, etc.]

LeaderboardEntry
 ├─ challenge_id, user_id, rank, score

```

### 🎨 User Interface Design Principles

- **Clean and modern**: Inspired by Notion, Superhuman, Linear
- **Minimal friction**: Fast login, clean forms, intuitive submission
- **Insightful dashboards**: Visual trend lines, badges, and clear rank
- **Mobile-friendly web app**: Responsive layout, no native apps

---

### 🔒 Security Considerations

- Isolated sandbox for code execution
- CPU, memory, and time-bound limits for submissions
- File size limits on uploads (5MB deck, 2min mp4)
- Rate-limiting and audit logs for admin operations
- Scoped GitHub login (read-only repo access, optional)

---

### 🚀 Development Phases

**Phase 1 – MVP (3–4 months)**

- Candidate login, challenge participation, basic scoring
- Company dashboard and challenge posting
- Manual or basic automated scoring pipeline

**Phase 2 – Automation (Month 5–6)**

- LLM scoring integration
- Sandbox code execution
- Badge system + leaderboard

**Phase 3 – Engagement & Scale (Month 7+)**

- Notification system
- Human judge workflow
- Scalable infrastructure tuning
- Growth dashboard for companies

---

### ⚠️ Potential Challenges & Solutions

| Challenge | Solution |
| --- | --- |
| Safe execution of untrusted code | Docker/firecracker-based sandbox with strict isolation and quotas |
| Fair, interpretable scoring | Combine rubric-based LLM scoring + transparent human feedback |
| Early engagement | Start with a curated set of AI builders and company partners |
| Video/deck storage | Use third-party services (S3, Cloudinary) with signed URLs |