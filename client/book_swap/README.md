# BookSwap React Frontend

## Installation & Setup

1. Navigate to the client directory:
```bash
cd client/book_swap
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Backend Configuration

Make sure your backend server is running on `http://localhost:5000` or update the API_BASE_URL in `src/services/api.js` if your backend runs on a different port.

## Features Implemented

### Authentication
- ✅ User Login
- ✅ User Registration with avatar upload
- ✅ JWT token management
- ✅ Protected routes

### Book Management
- ✅ View all books (Dashboard)
- ✅ View my books
- ✅ Add new book with image upload
- ✅ Delete books (owner only)
- ✅ Book condition indicators

### Request System
- ✅ Request books from other users
- ✅ View my requests
- ✅ View received requests
- ✅ Accept/decline requests
- ✅ Cancel pending requests

### UI/UX
- ✅ Responsive design
- ✅ Clean, modern interface
- ✅ Navigation header
- ✅ Status indicators
- ✅ Loading states
- ✅ Error handling

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Navigation header
│   └── Header.css      # Header styles
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # All books view
│   ├── MyBooks.jsx     # User's books
│   ├── AddBook.jsx     # Add new book form
│   ├── MyRequests.jsx  # User's requests
│   ├── ReceivedRequests.jsx # Requests for user's books
│   ├── Auth.css        # Login/Register styles
│   ├── Dashboard.css   # Dashboard styles
│   ├── AddBook.css     # Add book form styles
│   └── Requests.css    # Request pages styles
├── context/            # React contexts
│   └── AuthContext.jsx # Authentication context
├── services/           # API services
│   └── api.js          # API endpoints
├── App.jsx             # Main app component
├── App.css             # Global app styles
├── index.css           # Global CSS reset
└── main.jsx            # App entry point
```

## API Integration

The frontend connects to the NestJS backend with the following endpoints:

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `GET /api/books/my-books` - Get user's books
- `DELETE /api/books/:id` - Delete book
- `POST /api/books/:id/request` - Request a book
- `GET /api/books/my-requests` - Get user's requests
- `GET /api/books/requests-received` - Get received requests
- `PUT /api/books/requests/:requestId/:action` - Accept/decline request
- `DELETE /api/books/requests/:requestId` - Cancel request

## Environment Variables

No environment variables are required for the frontend. The API base URL is set to `http://localhost:5000/api` by default.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
