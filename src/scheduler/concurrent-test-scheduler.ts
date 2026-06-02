import type { TestScheduler } from "./test-scheduler"

export function makeConcurrentTestScheduler(): TestScheduler {
  return {
    schedule(definition) {
      return definition.run()
    },
  }
}
