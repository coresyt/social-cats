# Social Cats - La red social de los gatos
Este proyecto esta hecho para aprender a usar **Next.TS**, **TailwindCSS**, **Json Web Token**, **TypeORM con MySQL** y **Express.JS**

```pwsh
docker network create social-net

docker run -d --name social-mysql --network social-net -e MYSQL_ROOT_PASSWORD=<everything_password> -e MYSQL_DATABASE=social_db -p 3306:3306 mysql:latest
```