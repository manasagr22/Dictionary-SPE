const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.js');

const app = express();
app.use(
    cors({
      origin: '*',
    })
)
app.use(express.json());
app.use(bodyParser.json());
app.use('/', authRoutes);

describe('Authentication API Tests', () => {
  it('Send OTP for a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'hoteltablebook@gmail.com',
      otp: '123456'
    };

    const response = await request(app)
      .post('/sendOTP')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  }, 10000);

  it('Sign up a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'hoteltablebook@gmail.com',
      password: 'testPassword'
    };

    const response = await request(app)
      .post('/signUp')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('Authenticate a user', async () => {
    const userData = {
      email: 'hoteltablebook@gmail.com',
      password: 'testPassword'
    };

    const response = await request(app)
      .post('/signIn')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.name).toBe("Test User"); // Assuming the name is returned upon successful login
  });
});

describe('Add Words Tests', () => {
    it('Add Word in Dictionary', async () => {
      const userData = {
        email: 'hoteltablebook@gmail.com',
        word: 'violent',
        meaning: 'using physical strength to hurt or kill somebody'
      };
  
      const response = await request(app)
        .post('/addPage')
        .send(userData);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    }, 10000);
  
    it('Add New Content in Document', async () => {
        const userData = {
            email: 'hoteltablebook@gmail.com',
            word: 'Article 370',
            meaning: 'Supreme Court uphelds the abrogation of Article 370'
        };
  
      const response = await request(app)
        .post('/addDoc')
        .send(userData);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    }, 10000);
  });