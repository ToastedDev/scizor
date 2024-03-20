---
"scizor": patch
---

Add `GetRouteType` type. This allows you to get the type of what a route's response is.

```ts
// src/api/hello/route.ts
import { Route } from "scizor/hono";

export const GET = (c) => c.json({ hello: "world" });

// src/index.ts
import type { GetRouteType } from "scizor/hono";
import { GET } from "./api/hello/route";

async function callAPI() {
  const res = await fetch("http://localhost:3000/api/hello");
  const data: GetRouteType<typeof GET> = await res.json();
  console.log(data);
  //          ^? { hello: string }
}

callAPI();
```
