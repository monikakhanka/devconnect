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

- POST /request/send/:status/:userId { status can be interested or ignored}
- POST /request/review/:status/:requestId {status can be acepted or rejected}

userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - gets you the profile of other users on platform

status: ignore, interested, accepted, rejected
