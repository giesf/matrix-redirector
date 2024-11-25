# matrix-redirector

A simple service to open a direct messaging chat with a given user  on a given homeserver.
Alternative to https://matrix.to/ with a more streamlined user journey.

## How-To Use
This project uses bun instead of nodejs because it is easier to use

Find out more on [bun.sh](https://bun.sh)


To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```


To open a chat with a specific  user go to 
```
http://localhost:3000/?userId=@example_user:chat.example.org&homeserver=chat.example.org
```

optionally you can define an alternative frontend to redirect to by using `&frontend=<url>`

the default frontend is `https://app.element.io/#/room/`


To sign out go to
```
http://localhost:3000/logout
```

optionall you can define a page  to redirect to after logout by using `?redirectTo=<url>`