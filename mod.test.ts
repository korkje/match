import { assertEquals } from "@std/assert";
import match from "./mod.ts";

Deno.test("Simple", () => {
    const value = "hello" as string;

    const result = match(value)
        .on("hello", "a")
        .on("world", "b")
        .result();

    assertEquals(result, "a");
});

Deno.test("Advanced", () => {
    const value = "hello" as string;

    const result = match(value)
        .on(v => v === "hello", () => "a")
        .on(v => v === "world", () => "b")
        .result();

    assertEquals(result, "a");
});

Deno.test("Default value", () => {
    const value = "hello" as string;

    const result = match(value)
        .on("world", "b")
        .default("a")
        .result();

    assertEquals(result, "a");
});
