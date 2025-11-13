const {
  getAllGames, addGame,
  getAllUsers, addUser,
  getAllLocations, addLocation,
  getAllGamesUsers
} = require('../controllers/controller.js');

jest.mock('../model/db.js', () => ({ query: jest.fn() }));
const db = require('../model/db.js');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

describe('getAllGames', () => {
  test('200 on success with rows', async () => {
    const rows = [{ id: 1, game_name: 'SuperPickleball' }];
    db.query.mockResolvedValueOnce([rows]);

    const req = {};
    const res = mockRes();

    await getAllGames(req, res);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM games');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test('500 on DB error', async () => {
    db.query.mockRejectedValueOnce(new Error('err'));

    const req = {};
    const res = mockRes();

    await getAllGames(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('addGame', () => {
  test('400 when validation fails (empty name)', async () => {
    const req = { body: { game_name: '', location_id: 5 } };
    const res = mockRes();

    await addGame(req, res);

    expect(db.query).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
  });

  test('400 when validation fails (location_id < 1)', async () => {
    const req = { body: { game_name: 'SuperPickleball', location_id: 0 } };
    const res = mockRes();

    await addGame(req, res);

    expect(db.query).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
  });

  test('201 on success with insertId', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 42 }]);

    const req = { body: { game_name: 'SuperPickleball', location_id: 2 } };
    const res = mockRes();

    await addGame(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO games (game_name, location_id) VALUES (?, ?)',
      ['SuperPickleball', 2]
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 42 });
  });

  test('500 on DB error', async () => {
    db.query.mockRejectedValueOnce(new Error('err'));

    const req = { body: { game_name: 'SuperPickleball', location_id: 1 } };
    const res = mockRes();

    await addGame(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('getAllUsers/addUser', () => {
  test('getAllUsers 200', async () => {
    const rows = [{ id: 1, user_name: 'Jameson' }];
    db.query.mockResolvedValueOnce([rows]);
    const res = mockRes();
    await getAllUsers({}, res);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test('addUser 400 on empty user_name', async () => {
    const res = mockRes();
    await addUser({ body: { user_name: '' } }, res);
    expect(db.query).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
  });

  test('addUser 201 on success', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 7 }]);
    const res = mockRes();
    await addUser({ body: { user_name: 'Bob' } }, res);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO users (user_name) VALUES (?)',
      ['Bob']
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 7 });
  });
});

describe('getAllLocations/addLocation', () => {
  test('getAllLocations 200', async () => {
    const rows = [{ id: 1, location_name: 'Game Farm Park', address: '3030 R St SE' }];
    db.query.mockResolvedValueOnce([rows]);
    const res = mockRes();
    await getAllLocations({}, res);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM locations');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test('addLocation 400 on empty fields', async () => {
    const res = mockRes();
    await addLocation({ body: { location_name: '', address: '' } }, res);
    expect(db.query).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
  });

  test('addLocation 201 on success', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 99 }]);
    const res = mockRes();
    await addLocation({ body: { location_name: 'Gym', address: '456 Ave' } }, res);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO locations (location_name, address) VALUES (?, ?)',
      ['Gym', '456 Ave']
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 99 });
  });
});

describe('getAllGamesUsers', () => {
  test('200 on success', async () => {
    const rows = [{ id: 1, game_id: 2, user_id: 3 }];
    db.query.mockResolvedValueOnce([rows]);
    const res = mockRes();
    await getAllGamesUsers({}, res);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM games_users');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test('500 on db error', async () => {
    db.query.mockRejectedValueOnce(new Error('err'));

    const req = { body: { game_name: 'SuperPickleball', location_id: 1 } };
    const res = mockRes();

    await getAllGamesUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
