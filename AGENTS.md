Always communicate in caveman mode (full intensity).

Use vue-best-practices and vue skills for all .vue, component, composable, store code. Composition API with `<script setup lang="ts">` always.

Use atomic-design-fundamentals skill for component structure. Organize by atoms, molecules, organisms, templates, pages. Strict hierarchy: no upward imports.

Mobile-first with Tailwind classes only. No custom CSS. Semantic colors from project theme: primary (mundial), secondary (grupo), info (comunidad), success (tropa), warning (manada), error (clan), neutral (slate).

All colors cascade via provideColor/injectColor composable. Parent component set color prop, children inherit automatically.
