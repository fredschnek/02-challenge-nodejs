import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId
    const oneWeek = 1000 * 60 * 60 * 24 * 7

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: oneWeek,
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(400).send({
        error: 'User already exists',
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const users = await knex('users').select('id', 'name', 'email')
    return reply.send({ users })
  })
}
