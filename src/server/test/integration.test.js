const request = require('supertest')
const db = require('../model/db.js')
const app = require('../server.js')
const fs = require('fs')


beforeEach( async () => {
    // initialize db tables
    const initDb = fs.readFileSync('./test/database/initTests.sql', 'utf8');
    await db.exec(initDb);

    // seed db
    const seedDb = fs.readFileSync('./test/database/seedTests.sql', 'utf8');
    await db.exec(seedDb);
    
})

afterEach( async () => {
    await db.restart()
})


describe('Get All Users', () => {

    test('responds with db error', async () => {
        db.end();
        const res = await request(app)
            .get('/api/users')

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual({ error: 'Internal server error' })
    })


    test('get all users with ids', async () => {
        const res = await request(app)
            .get('/api/users')

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([
            { user_id: 1, user_name: 'Augy' },
            { user_id: 2, user_name: 'Rebecca' },
            { user_id: 3, user_name: 'Kim' },
            { user_id: 4, user_name: 'Maddie' },
            { user_id: 5, user_name: 'Jameson' }
        ])
    })

});


describe('Post User', () => {

    test('post one user', async () => {
        const post = await request(app)
            .post('/api/users').send({ user_name: "Waldo" });

            expect(post.statusCode).toEqual(201);
            expect(post.body).toEqual({ id: 6});

        const get = await request(app)
            .get('/api/users');

            expect(get.statusCode).toEqual(200)
            expect(get.body).toEqual([
                { user_id: 1, user_name: 'Augy' },
                { user_id: 2, user_name: 'Rebecca' },
                { user_id: 3, user_name: 'Kim' },
                { user_id: 4, user_name: 'Maddie' },
                { user_id: 5, user_name: 'Jameson' },
                { user_id: 6, user_name: 'Waldo' }
            ])
    })

    test('post many users', async () => {
        let post = await request(app)
            .post('/api/users').send({ user_name: "Waldo" });

            expect(post.statusCode).toEqual(201);
            expect(post.body).toEqual({ id: 6});

        post = await request(app)
            .post('/api/users').send({ user_name: "Mary" });

            expect(post.statusCode).toEqual(201);
            expect(post.body).toEqual({ id: 7});

        post = await request(app)
            .post('/api/users').send({ user_name: "Fred" });

            expect(post.statusCode).toEqual(201);
            expect(post.body).toEqual({ id: 8});

        post = await request(app)
            .post('/api/users').send({ user_name: "Barry" });

            expect(post.statusCode).toEqual(201);
            expect(post.body).toEqual({ id: 9});

        const get = await request(app)
            .get('/api/users');

            expect(get.statusCode).toEqual(200)
            expect(get.body).toEqual([
                { user_id: 1, user_name: 'Augy' },
                { user_id: 2, user_name: 'Rebecca' },
                { user_id: 3, user_name: 'Kim' },
                { user_id: 4, user_name: 'Maddie' },
                { user_id: 5, user_name: 'Jameson' },
                { user_id: 6, user_name: 'Waldo' },
                { user_id: 7, user_name: 'Mary' },
                { user_id: 8, user_name: 'Fred' },
                { user_id: 9, user_name: 'Barry' }
            ])
    })

    test('invalid empty user', async () => {
        const post = await request(app)
            .post('/api/users').send({ user_name: "" });

            expect(post.statusCode).toEqual(400);
            expect(post.body).toEqual({ error: 'Invalid input'});

        const get = await request(app)
            .get('/api/users');

            expect(get.statusCode).toEqual(200)
            expect(get.body).toEqual([
                { user_id: 1, user_name: 'Augy' },
                { user_id: 2, user_name: 'Rebecca' },
                { user_id: 3, user_name: 'Kim' },
                { user_id: 4, user_name: 'Maddie' },
                { user_id: 5, user_name: 'Jameson' }
            ])
    })
})

describe('Get All Games', () => {
    test('get all games', async () => {

        db.exec("INSERT INTO games (game_name, location_id) VALUES ('pick up sticks', 2);")

        const res = await request(app)
            .get('/api/games');

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual([
                {game_id: 1, game_name: "Pickle at the Farm", location_id: 1},
                {game_id: 2, game_name: "pick up sticks", location_id: 2}
            ])
    })
})