# Frontend Mentor - Kanban task management web app solution

![Design preview for the Kanban task management web app coding challenge](./preview.jpg)

This is a solution to the [Kanban task management web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

Kanban board management featuring multiple boards, custom columns, and tasks with subtasks. Users can visually organize their work, drag and drop tasks between columns, and toggle between light and dark themes.

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, read, update, and delete boards and tasks
- Receive form validations when trying to create/edit boards and tasks
- Mark subtasks as complete and move tasks between columns
- Hide/show the board sidebar
- Toggle the theme between light/dark modes
- **Bonus**: Allow users to drag and drop tasks to change their status and re-order them in a column
- **Bonus**: Keep track of any changes, even after refreshing the browser (`localStorage` could be used for this if you're not building out a full-stack app)
- **Bonus**: Build this project as a full-stack application

### Screenshot

#### Desktop — Main

| Light mode | Dark mode |
|---|---|
| ![Main light mode](./public/Board-light.png) | ![Main dark mode](./public/Board-dark.png) |

| Sidebar hidden |
|---|
| ![Hidden sidebar](./public/hide-sidebar.png) |

#### Desktop — Tasks & Boards

| Task detail | Task status dropdown |
|---|---|
| ![Task detail](./public/task-detail.png) | ![Task status](./public/task-status.png) |

| Add new task | Edit task | Delete task |
|---|---|---|
| ![Add new task](./public/add-new-task.png) | ![Edit task](./public/edit-task.png) | ![Delete task](./public/delete-task.png) |

| Board options menu | Add new board | Edit board | Delete board |
|---|---|---|---|
| ![Board ellipsis menu](./public/board-ellipsis-menu.png) | ![Add new board](./public/Add-new-board.png) | ![Edit board](./public/edit-board.png) | ![Delete board](./public/delete-board.png) |

#### Form validation

| Task form | Board form |
|---|---|
| ![Form validation task](./public/form-validation-task.png) | ![Form validation board](./public/form-validation-board.png) |

#### Tablet

| Board | Task detail | Task status |
|---|---|---|
| ![Tablet board](./public/tablet-main.png) | ![Tablet task detail](./public/tablet-task-detai.png) | ![Tablet task status](./public/tablet-task-status.png) |

| New task | New board |
|---|---|
| ![Tablet new task](./public/tablet-new-task.png) | ![Tablet new board](./public/tablet-new-board.png) |

#### Mobile

| Board | Navigation menu | Task detail |
|---|---|---|
| ![Mobile board](./public/mobile-board.png) | ![Mobile menu](./public/mobile-menu.png) | ![Mobile task detail](./public/mobile-task-detail.png) |

| Edit task | Task status |
|---|---|
| ![Mobile edit task](./public/mobile-edit-task.png) | ![Mobile task status](./public/mobile-task-status.png) |


### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Kanban Task Management App](https://kanban-task-management-app-n7ya.vercel.app/)

## My process

### Built with

- Mobile-first workflow
- [React](https://react.dev/) - JS library
- [Vite](https://vite.dev/) 
- [Tailwind CSS](https://tailwindcss.com/) 


### What I learned

Working on this project helped me deepen my understanding of several concepts:

- **Drag and drop with live preview** — keeping a local copy of columns during a drag and switching to the global state only after the drag ends, using derived state instead of syncing effects.

- **React useEffect dependencies** — I ran into a bug where an inline `onClose` function was recreated on every render, causing the Modal's cleanup to run on each keystroke and break focus. The fix was storing the callback in a ref and running the effect only on mount.

- **Accessible components** — implementing `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trapping, and ESC key handling properly. Also learned that ESC handlers in nested overlays (menu inside modal) need the capture phase to avoid triggering both at once.

- **Unique identifiers** — switching from `task.title` to `task.id` (UUID) as the identifier for DnD and reducer lookups, so identifiers are decoupled from user-editable data.

- **Tailwind CSS v4** — using `@layer components` for custom classes and `@theme` for design tokens instead of the old `tailwind.config.js` approach.

### Continued development

- **Full-stack version** — move the data layer to a real backend (Node + PostgreSQL or a BaaS like Supabase) so boards are synced across devices and users can have accounts.
- **Animations** — add view transitions when tasks move between columns and when modals open/close.
- **Keyboard drag and drop** — dnd-kit has built-in keyboard support but it needs custom announcements and focus management to be fully accessible.
- **Optimistic updates** — if a backend is added, update the UI immediately and roll back on error instead of waiting for the server response.

### AI Collaboration

I used **Claude Code** (Anthropic) as a collaborative partner throughout the project.

**How I used it:**
- Debugging logic bugs — stale closures, incorrect useEffect dependencies, ref timing issues in the drag & drop hook
- Code reviews — the AI audited the full branch and identified architectural issues like using `task.title` as a DnD identifier instead of a stable UUID
- Accessibility audit — systematic review of ARIA roles, focus management, keyboard navigation, and semantic HTML across all components
- Refactoring — extracting custom hooks (`useBoardDnd`, `useEditableList`), moving from `@layer base` to `@layer components`, simplifying components
- HTML and CSS fixes — catching invalid patterns like headings inside buttons, `cursor-pointer` on text inputs, and missing heading hierarchy

**What worked well:** Using AI as a peer reviewer rather than a code generator. I described the problem or showed the code, we discussed the trade-offs, and I made the final decisions. This kept me in control of the architecture while benefiting from a second pair of eyes.

**What didn't work as well:** Very large refactors done all at once (like the accessibility pass) sometimes broke unrelated things like the responsive layout. Smaller, incremental steps with verification between them worked better.

## Author

- Website - [Laura Elena Mesa](https://portfolio-app-three-red.vercel.app/)
- Frontend Mentor - [@laurymesa01](https://www.frontendmentor.io/profile/laurymesa01)
- LinkedIn - [@lauraelenamesa](https://www.linkedin.com/in/lauraelenamesa/)
