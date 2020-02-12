## Lista de comandos Docker

### DATABASES

---

#### POSTGRES

``` docker
docker run \
    --name postgres \
    -e POSTGRES_USER=roberto \
    -e POSTGRES_PASSWORD=minhasenhasecreta \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d postgres
```

``` docker
docker run \
    --name adminer \
    -p 8000:8080 \
    --link postgres:postgres \
    -d adminer
```

---

#### MONGODB

``` docker
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
    -d mongo:4
```

``` docker
docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d mongoclient/mongoclient
```

``` docker
docker exec -it mongodb \
    mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('heroes').createUser({user: 'roberto', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'heroes'}]})"
 ```

---
