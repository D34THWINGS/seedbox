import { GQLResolvers } from '../../schemaTypes'

export const userQueriesResolvers: GQLResolvers['Query'] = {
  me: (_, __, { auth }) => auth.user,
}
