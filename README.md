# Módulo 5 - Bancos de Dados - Nosso projeto Multi-banco de dados

* Trabalhando com o padrão Strategy para Multi DataSources

## Instalando docker para usar o Postgres e MongoDB

---

### POSTGRES

``` shell
docker run \
    --name postgres \
    -e POSTGRES_USER=roberto \
    -e POSTGRES_PASSWORD=minhasenhasecreta \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d postgres
```

``` shell
docker run \
    --name adminer \
    -p 8000:8080 \
    --link postgres:postgres \
    -d adminer
```

``` shell
docker run -it \
 -p 5432:5432 \
 --link postgres:postgres \
 postgres psql -h $HOST -p $PORT -U $USER $DATABASE

```

* Go to `http://localhost:8000/?pgsql=postgres&username=roberto&db=heroes&ns=public` 

---

#### MONGODB

``` shell
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
    -d mongo:4
```

``` shell
docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d mongoclient/mongoclient
```

``` shell
docker exec -it mongodb \
    mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('heroes').createUser({user: 'roberto', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'heroes'}]})"
```

---
