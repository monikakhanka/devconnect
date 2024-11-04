# API

authRouter

- POST /auth/signup
- POST /auth/login
- POST /auth/logout

profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter

- POST /request/send/:status/:userId { for both interested and ignored request}
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter

- GET /user/connections
- GET /user/requests - received
- GET /user/feed - gets you the profile of other users on platform

status: ignore, interested, accepted, rejected
