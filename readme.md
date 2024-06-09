# match [![JSR](https://jsr.io/badges/@korkje/match)](https://jsr.io/@korkje/match)

Alternative to the `switch` statement in JS/TS.

```ts
import match from "@korkje/match";

const inRange = (lo: number, hi: number) => (n: number) => n >= min && n < max;

const result = match(Math.random())
    .on(inRange(0, 0.5), "[0, 0.5)")
    .on(inRange(0.5, 1), "[0.5, 1)")
    .default("Throw away your computer")
    .result();

console.log(result); 
```
