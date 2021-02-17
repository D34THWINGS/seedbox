import { User } from '../services/databaseService'
import { Services } from '../services'

export type GraphQLContext = {
  services: Services
  auth: {
    user: User
  }
}

export type Resolver<TSource = unknown, TArgs = unknown, TReturn = unknown> = (
  source: TSource,
  args: TArgs,
  context: GraphQLContext
) => TReturn | Promise<TReturn>

export type ResolverObject<
  TSource = never,
  TSchema extends { [KT in keyof TSource]?: unknown } = TSource
> = {
  __resolveType?: Resolver<TSource>
} & {
  [K in keyof TSchema]?: Resolver<TSource, never, Partial<TSchema[K]>>
}

export type RootResolverObject<
  TSource = never,
  TSchema extends { [KT in keyof TSource]: unknown } = TSource
> = {
  [K in keyof TSchema]: Resolver<TSource, never, Partial<TSchema[K]>>
}
