Kean App

## 1. Core Platform Purpose

The project is a decentralized-style social content aggregator. It facilitates real-time user interaction through a structured hierarchy consisting of Users, Communities, Posts, and a dual-state Voting System. The architecture prioritizes data integrity and low-latency UI updates using a "Cache-First" strategy.

## 2. System Architecture & Features

### A. Community & Post Governance

The platform implements a relational mapping between communities and content.

- **Community Schema:** Entities contain metadata including unique identifiers, descriptions, and ownership IDs.
- **Post Lifecycle:** Post creation involves a multi-step mutation. When a post is "executed," the system captures the markdown/text content, user metadata, and a reference to the host community.
- **Image Integration:** Assets are handled via external URL referencing or Supabase Storage buckets, injected into the DOM with lazy-loading and Framer Motion layout transitions to prevent Layout Shift (CLS).

### B. Reactive Voting Engine (Likes/Dislikes)

The voting system is implemented as a non-destructive state machine:

- **State Logic:** The `LikeButton` component utilizes an "Upsert" (Update/Insert) pattern.
- **Atomic Operations:** - If `state == null` -> `INSERT` row with `vote: 1` or `-1`.
  - If `state == current` -> `DELETE` row (toggling off).
  - If `state != current` -> `UPDATE` row value.
- **TanStack Integration:** It uses `useMutation` with `onSuccess` invalidation. This triggers a background re-fetch for all `PostItem` components sharing the same `postId` query key, ensuring global consistency across the list and detail views.

### C. Commenting & Threading

The commenting engine is built on a recursive relational structure within the database.

- **Data Fetching:** Comments are fetched via a filtered query where `post_id` matches the current route parameter.
- **Real-time Interaction:** The UI uses `AnimatePresence` to handle the mounting/unmounting of comment threads, providing visual feedback during the injection of new data strings into the PostgreSQL table.

### D. User Authentication & Authorization

The security layer is enforced at the database level using Row Level Security (RLS).

- **Identity Provider:** Supabase Auth manages JWT (JSON Web Tokens).
- **Ownership Validation:**
  ```sql
  -- Example Logic
  CREATE POLICY "Delete Ownership" ON posts
  FOR DELETE USING (auth.uid() = user_id);
  ```
- **Session Persistence:** A custom `AuthContext` provider utilizes the `onAuthStateChange` listener to synchronize the local React state with the global Supabase session, managing protected routes and administrative UI toggles.

## 3. Advanced Technical Implementations

### Dynamic UI Composition

The `PostItem` component is a high-order-like component that adapts its CSS Grid/Flexbox properties based on a `variant` prop (`list` | `grid`).

- **Responsive Breakpoints:** The layout utilizes Tailwind’s prefix system (`md:`, `lg:`) to restructure the DOM tree on the fly, shifting from a horizontal list-item layout to a vertical card layout without re-mounting logic.

### Server-State Management

The application implements an advanced caching layer:

- **Stale-While-Revalidate (SWR):** Using TanStack Query, the application serves stale data from the cache immediately while fetching fresh data in the background.
- **Polling:** Critical data points, such as the `votes` array, implement a `refetchInterval` (e.g., 5000ms) to simulate real-time updates in the absence of WebSockets.

### Motion Physics

Unlike standard CSS transitions, the project utilizes spring-based physics for UI interactions.

- **Spring Physics:** Constants are set to `stiffness: 400` and `damping: 40`. This creates a tactile, weight-based feel for modal popups (like the Delete Confirmation) and card expansions, improving the perceived performance and high-end feel of the application.

## 4. Security Infrastructure

- **Input Sanitization:** Content is sanitized before being rendered to prevent Cross-Site Scripting (XSS).
- **RLS Access Control:** Tables are locked by default. Explicit policies are defined for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, ensuring that users can only manipulate their own content while retaining public read access for the community at large.
