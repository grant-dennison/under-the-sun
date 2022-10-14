import type { TestScheduler } from "./test-scheduler";

export function makeParallelTestScheduler(): TestScheduler {
  return {
    schedule(definition) {
      return definition.run()
    },
  };
}
