# line-realtime-chat-web
Line OA Real-time Chat Front-end (Web)
## Requirements
- Node.js 18 or higher
- Docker (optional)
## Quick Start
- Install Project
``` bash
$ npm install
```
- Start Project
1. Locally
   - Run project
``` bash
$ npm run start
```
  - Test
    - You already run back-end on locally ([line-realtime-chat-api](https://github.com/Much-Arisz/line-realtime-chat-api))
    - Test user type "Admin" => http://localhost:3000/admin/login
    - Test user type "User"
       - Add Line OA => ID: @838qvqkc or QRCODE
       - ![image](https://github.com/Much-Arisz/line-realtime-chat-web/assets/56961503/3407b73b-247b-4472-b0f3-49936801da0b)
       - If you want to register or login, you have to copy & paste URL on locally website, then change URL from https://drum-star-stud.ngrok-free.app to http://localhost:3000
2. Docker
- ฺBuild DockerFile
``` bash
$ docker-compose build
```
- Run project
``` bash
$ docker-compose up -d
```
  - Test
    - You already run back-end on Docker ([line-realtime-chat-web](https://github.com/Much-Arisz/line-realtime-chat-api))
    - Test user type "Admin" => http://localhost:3000/admin/login or http://drum-star-stud.ngrok-free.app/admin/login
    - Test user type "User"
       - Add Line OA => ID: @838qvqkc or QRCODE
       - ![image](https://github.com/Much-Arisz/line-realtime-chat-web/assets/56961503/3407b73b-247b-4472-b0f3-49936801da0b)


