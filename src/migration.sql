CREATE TABLE IF NOT EXISTS migration
(
    meta_key   VARCHAR(100) PRIMARY KEY,
    meta_value VARCHAR(255) DEFAULT NULL
);

INSERT INTO migration (meta_key, meta_value)
VALUES ('version', '000.000.000')
ON CONFLICT
    (meta_key)
    DO NOTHING;

-----------------------------------------------------------------------------------------------------------------------

DO
$$
    DECLARE
        version        VARCHAR(20) := (SELECT meta_value
                                       FROM migration
                                       WHERE meta_key = 'version');
        DECLARE v1_0_0 VARCHAR(20) := '001.000.000';
        DECLARE v1_0_1 VARCHAR(20) := '001.000.001';
    BEGIN

        -- v1.0.0
        IF version < v1_0_0 THEN
            if not exists(select 1 from pg_type where typname = 'user_status') then
                create type user_status as enum ('active', 'blocked');
            end if;

            if not exists(select 1 from pg_type where typname = 'user_registered_by') then
                create type user_registered_by as enum ('email', 'google');
            end if;

            create table users
            (
                "userId"         serial                       not null,
                name             varchar                      not null,
                email            varchar                      not null,
                "sanitizedEmail" varchar                      not null,
                password         varchar,
                status           user_status default 'active' not null,
                "registeredBy"   user_registered_by           not null,
                "registeredAt"   timestamp   default now()    not null,
                "updatedAt"      timestamp   default now()    not null
            );

            create unique index users_sanitizedEmail_uindex
                on users ("sanitizedEmail");

            create index users_userId_index
                on users ("userId");

            alter table users
                add constraint users_pk
                    primary key ("userId");

            UPDATE migration
            SET meta_value = v1_0_0
            WHERE meta_key = 'version';
        END IF;

        -- v1.0.1
        IF version < v1_0_1 THEN
            ALTER TABLE users ADD "emailVerified" boolean DEFAULT false;

            UPDATE migration
            SET meta_value = v1_0_1
            WHERE meta_key = 'version';
        END IF;

    END
$$;

