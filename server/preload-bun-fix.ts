/// <reference types="bun-types" />
// Workaround for Bun <= 1.3.14: v8.startupSnapshot.isBuildingSnapshot throws NotImplementedError
// instead of returning false. Fixed in Bun main via https://github.com/oven-sh/bun/pull/32502
// This preload patches it before bson's static initializer runs.
try {
  const v8 = (process as any).getBuiltinModule?.("v8");
  if (v8?.startupSnapshot) {
    v8.startupSnapshot.isBuildingSnapshot = () => false;
  }
} catch {}
