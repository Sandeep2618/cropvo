# Crovo Backend

Minimal Express backend for the Crovo project.

Getting started

1. Change directory and install dependencies:

```bash
cd crovo-backend
npm install
```

2. Start in development (requires `nodemon`):

```bash
npm run dev
```

3. Or start normally:

```bash
npm start
```

Server listens on `PORT` (default 5000). Create a `.env` from `.env.example` to override.

## MongoDB Atlas setup

1. Go to https://www.mongodb.com/atlas and sign up or log in.
2. Create a new project.
3. Create a free cluster.
4. In the cluster page, click "Connect".
5. Add your current IP address to the network access list.
6. Create a database user and password.
7. Choose "Connect your application" and copy the connection string.
8. Replace the placeholder in `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/crovo?retryWrites=true&w=majority
```

9. Restart the backend:

```bash
npm run dev
```

10. Verify it:

- Open http://localhost:5000/
- Open http://localhost:5000/users

If no users exist yet, the `/users` route returns an empty array.
