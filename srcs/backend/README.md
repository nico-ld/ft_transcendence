# Backend

## Run the app

From `srcs/backend`:

```sh
docker compose -f srcs/docker-compose.yml up -d backend
or
docker compose up -d backend
```

## Convention

### Database

For the database always use `snake_case`.

Example:

| What | Example |
|---|---|
| Tables | `users`, `employee_creds`, `user_id` |
| Columns | `first_name`, `last_name`, `email`, `password_hash`... |
| Postgres enum type | `user_role`, with values such as `admin`, `lead_dev`, `dev`. |

Do not use a custom sequence, such as:

```python
USER_ID_SEQ = Sequence('UserID', start=1)
```

Instead, do:

```python
id: Mapped[int] = mapped_column(primary_key=True)
```

This makes postgres create the col as `SERIAL`, which gives it the same auto incrementing id (and fixes other potential issues.)

### Python

Always use PEP8 convention, exemples:

| What | Case | Example |
|---|---|---|
| Classes | `PascalCase` | `User`, `EmployeeCreds`, `Role` |
| Funcs and methods | `snake_case` | `get_user`, `add_user`... |
| Enum members | `UPPER_CASE` | `Role.ADMIN = "admin"` |
| Pydantic schemas | Name them by purpose | |

### API

For the JSON, use `camelCase`, ex for keys:

```json
{"firstName": "", "createdAt": ""}
```

You can use the `snake_case` internally but you need to set `alias_generator=to_camel` on Pydantic base model.

Use plural routes: `/users`, `/users/{user_id}`, and `/auth/`.
