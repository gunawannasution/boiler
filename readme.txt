/app
  /actions
    auth.js             # Server Actions: register, forgot password, reset password
  /components
    FormInput.jsx       # Input form reusable
    Button.jsx          # Button reusable
    Layout.jsx          # Layout global
    Header.jsx          # Header reusable
    Footer.jsx          # Footer reusable
    Toast.jsx           # Toast message reusable npm install sonner
  /dashboard
    page.jsx            # User dashboard
  /admin
    page.jsx            # Admin dashboard
  /login
    page.jsx            # Login page
  /register
    page.jsx            # Register page
  /forgot-password
    page.jsx            # Forgot password page
  /reset-password
    page.jsx            # Reset password page
  /layout.jsx           # Global layout wrapper
/api
  /auth
    [...nextauth]/route.js  # Endpoint NextAuth.js (App Router)
/utils
  hash.js               # Hashing password
  auth.js               # Middleware: role & auth check  npm install next-aut bcryptjs
  toast.js              # Toast helper
/prisma
  schema.prisma
.env
package.json
