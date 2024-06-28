import { app } from '../src/app'
import { execSync } from 'child_process'
import request from 'supertest'
import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: false,
        date: new Date().toISOString(),
      })
      .expect(201)
  })

  it('should be able to list all meals from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie') || []
    const dayAfter = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: false,
        date: new Date().toISOString(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Veggie Soup',
        description: 'Delicious Veggie Soup',
        isOnDiet: true,
        date: dayAfter,
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    expect(mealsResponse.body.meals).toHaveLength(2)

    expect(mealsResponse.body.meals[0].name).toBe('Veggie Soup')
    expect(mealsResponse.body.meals[1].name).toBe('Pizza')
  })

  it('should be able to display a single meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(200)

    console.log(mealResponse.body.meal)

    expect(mealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        is_on_diet: 0,
        date: expect.any(Number),
      }),
    })
  })

  it('should be able to update a meal from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(204)
  })

  it('should be able to delete a meal from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(204)
  })

  it('should be able to get metrics for a specific user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Pizza',
        description: 'Pepperoni Pizza',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Veggie Soup',
        description: 'Delicious Veggie Soup',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Burger',
        description: 'Delicious Burger',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Salad',
        description: 'Delicious Salad',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Grilled Chicken Salad',
        description: 'Delicious Grilled Chicken Salad',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookie)
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMeals: 5,
      totalMealsOnDiet: 3,
      totalMealsOffDiet: 2,
      bestOnDietStreak: 2,
    })
  })
})
