---
"@forthtilliath/ts-kit": minor
"@forthtilliath/expo-config-plugins": minor
---

ts-kit: new `pickRandom(array, random?)`, one element picked at random (`undefined` for an empty array). expo-config-plugins: new `withKotlinJvmTarget` plugin, forcing every Kotlin compile task to the Java code's JVM target (`jvmTarget`, 17 by default) so a module like expo-dynamic-app-icon no longer fails the build with "Inconsistent JVM-target compatibility".
