# KAEN • PROPRIETARY SYSTEM SPECIFICATION
## [CONFIDENTIAL] - EXCLUSIVE TO IMAGINATION SOFTWARE

![License](https://img.shields.io/badge/License-Proprietary_Imagination_Software-red?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-RLS_Enforced-black?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-React_19_Concurrent-pink?style=for-the-badge)

Kaen is a high-density, real-time social content aggregator engineered with a **Reactive Monolith Architecture**. This system is architected for low-latency data synchronization, utilizing a **Non-Blocking Concurrent Data Flow** and strictly enforced **Relational Integrity**. 

> **LEGAL NOTICE:** This software and its underlying logic are the exclusive property of **Imagination Software**. Unauthorized replication, reverse-engineering, or distribution of this architectural framework is strictly prohibited.

---

## 1. MISSION-CRITICAL ARCHITECTURE

### A. The discovery Layer (Advanced Search)
Kaen’s search infrastructure is not a basic filter; it is a **Stateless Query Engine** synchronized with the browser's hardware history stack.
* **Vector Querying:** Executes parallel `ILike` pattern matching across indexed GIN (Generalized Inverted Index) columns in PostgreSQL.
* **State Serialization:** Utilizing `useSearchParams` for URL-state hydration, ensuring that complex search results are fully serializable and persistent.
* **Parallel Async Hydration:** Implements `Promise.all()` for simultaneous resolution of `communities` and `posts` tables, effectively halving the latency of the discovery lifecycle.



### B. The Atomic engagement Machine (Voting)
The voting logic is a **Deterministic State Machine** designed to eliminate race conditions and data drift.
* **Upsert Logic Pattern:** Instead of simple integer increments, the system tracks the unique relationship between `user_id` and `post_id`.
* **State Transitions:** - `NULL -> INSERT(1)` 
    - `CURRENT -> DELETE` (Toggle Logic)
    - `CURRENT -> UPDATE(Opposite)` (Polarity Swap)
* **Optimistic UI Layer:** Powered by **TanStack Query v5**, providing 0ms perceived latency by updating the client-side cache before the server-side transaction is finalized.



### C. Recursive Discussion Engine (Comments)
A recursive data structure designed for infinite nesting and high-performance DOM rendering.
* **Adjacency List Model:** Uses a self-referencing `parent_id` foreign key within the `comments` table.
* **Recursive Component Mounting:** The UI dynamically injects instances of itself during the tree-traversal process.
* **Physics-Based Rendering:** Utilizing **Framer Motion** with custom spring constants ($stiffness: 400, damping: 40$) to handle layout projections and prevent Cumulative Layout Shift (CLS).



---

## 2. RELATIONAL DATA SCHEMA

The database is built on **PostgreSQL** with strict foreign key constraints and cascaded deletions.

### Community Entity (`communities`)
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `name` | `text` | UNIQUE, NOT NULL, INDEXED |
| `description` | `text` | NULLABLE |
| `creator_id` | `uuid` | REFERENCES auth.users(id) |

### Post Entity (`posts`)
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | PRIMARY KEY |
| `title` | `text` | NOT NULL, GIN INDEXED |
| `content` | `text` | NOT NULL |
| `community_id` | `uuid` | REFERENCES communities(id) ON DELETE CASCADE |
| `user_id` | `uuid` | REFERENCES auth.users(id) |

### Engagement Vector (`votes`)
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `post_id` | `uuid` | COMPOSITE PRIMARY KEY |
| `user_id` | `uuid` | COMPOSITE PRIMARY KEY |
| `vote_type` | `smallint` | CHECK (vote_type IN (-1, 1)) |



---

## 3. SECURITY & PERFORMANCE PROTOCOLS

### Row Level Security (RLS)
Security is architected at the **kernel level** of the database.
```sql
-- Enforcing Data Ownership
CREATE POLICY "Mutation Ownership" ON public.posts
FOR ALL USING (auth.uid() = user_id);

-- Enforcing Global Read Access
CREATE POLICY "Network Visibility" ON public.communities
FOR SELECT USING (true);

Design Engineering
Surface Aesthetics: Pure Black (#000000) OLED-optimized background with a 3% white alpha-layer glassmorphism.

Hardware Acceleration: All animations are offloaded to the GPU via will-change transforms to maintain a consistent 60FPS refresh rate.

4. PROPRIETARY TECH STACK
Core: React 19 (Concurrent Mode)

Server State: TanStack Query (v5)

Backend: Supabase / PostgreSQL

Motion: Framer Motion (Spring Physics)

Auth: JWT / GoTrue Identity Provider

```
© 2025 Imagination Software. All Rights Reserved. Proprietary and Confidential.

