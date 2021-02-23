import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const makeDateScalar = () =>
  new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? null : date
    },
    serialize(value) {
      if (value instanceof Date) {
        return value.toISOString()
      }
      if (typeof value === 'string') {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? null : date.toISOString()
      }
      return null
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
        const date = new Date(ast.value)
        return Number.isNaN(date.getTime()) ? null : date
      }
      return null
    },
  })
