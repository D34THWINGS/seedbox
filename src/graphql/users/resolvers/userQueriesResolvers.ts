import { RootResolverObject } from '../../graphqlTypes'
import { GQLQuery } from '../../schemaTypes'
import { serialize } from '../../../helpers/serialization'

export const userQueriesResolvers: RootResolverObject<
  unknown,
  Pick<GQLQuery, 'me'>
> = {
  me: (_, __, context) => serialize(context.auth.user),
}
