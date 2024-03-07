---
"scizor": minor
---

No more need for `await` when creating routers.

This is done by moving the logic for when routers are created to a new `Router` class that is created whenever you run `createRouter` or `router`.
