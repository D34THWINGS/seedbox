import { User } from '../services/databaseService'

export type GraphQLContext = {
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
  TSource = unknown,
  TSchema extends { [KT in keyof TSource]: unknown } = TSource
> = {
  __resolveType?: Resolver<TSource>
} & {
  [K in keyof TSchema]?: Resolver<TSource, unknown, TSchema[K]>
}

export type RootResolverObject<
  TSource = unknown,
  TSchema extends { [KT in keyof TSource]: unknown } = TSource
> = {
  [K in keyof TSchema]: Resolver<TSource, unknown, TSchema[K]>
}
