export type Awaited<T> = T extends Promise<infer TResult> ? TResult : T
