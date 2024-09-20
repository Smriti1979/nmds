CREATE DATABASE esankhyiki;

CREATE TABLE product IF NOT EXISTS(
    id varchar(20) NOT NULL,
    title varchar(80) NOT NULL,
    count varchar(80) NOT NULL,
    icon varchar(100000) NOT NULL,
    period varchar(80) NOT NULL,
    tooltip varchar(80) NOT NULL,
    type varchar(80) NOT NULL,
    url varchar(80) NOT NULL,
    table varchar(80) NOT NULL,
    swagger BOOLEAN NOT NULL,
    viz varchar(80) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (id)
);

CREATE TABLE MetaData IF NOT EXISTS (
    id SERIAL PRIMARY KEY,
    product VARCHAR(60) NOT NULL,
    title VARCHAR(60) NOT NULL,
    category VARCHAR(40) NOT NULL,
    geography VARCHAR(80) NOT NULL,
    frequency VARCHAR(40) NOT NULL,
    timePeriod VARCHAR(40) NOT NULL,
    dataSource VARCHAR(300) NOT NULL,
    description VARCHAR(800) NOT NULL,
    lastUpdateDate DATE NOT NULL,
    futureRelease VARCHAR(40) NOT NULL,
    basePeriod VARCHAR(60) NOT NULL,
    keystatistics VARCHAR(300) NOT NULL,
    NMDS VARCHAR(300) NOT NULL,
    nmdslink VARCHAR(300) NOT NULL,
    remarks VARCHAR(200) NOT NULL,
    FOREIGN KEY (product) REFERENCES product(id),
    UNIQUE (product)
);

CREATE TABLE Theme IF NOT EXISTS(
    category varchar(20) NOT NULL,
    name varchar(40) NOT NULL,
    PRIMARY KEY (category)
);
CREATE TABLE ProductTheme IF NOT EXISTS(
    productId varchar(20) NOT NULL,
    category varchar(20) NOT NULL,
    FOREIGN KEY (productId) REFERENCES product(id),
    FOREIGN KEY (category) REFERENCES Theme(category),
    PRIMARY KEY (productId, category)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE Users IF NOT EXISTS(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(300) NOT NULL,
    -- admin BOOLEAN
    title  varchar(20) NOT NULL,
    -- FOREIGN KEY (title) REFERENCES UserRetation(id)
);
-- password 123456
INSERT INTO adminusers(username, password,title) VALUES ('Admin', '$2a$10$IDhLRlEAHiff18CIk5eKkeTfSIVG/YEFDB859xJklP8xIbTwbZ1kC','admin');
INSERT INTO adminusers(username, password,title) VALUES ('Domain', '$2a$10$IDhLRlEAHiff18CIk5eKkeTfSIVG/YEFDB859xJklP8xIbTwbZ1kC','domain');
INSERT INTO adminusers(username, password,title) VALUES ('Cpi_user', '$2a$10$IDhLRlEAHiff18CIk5eKkeTfSIVG/YEFDB859xJklP8xIbTwbZ1kC','cpi');
INSERT INTO adminusers(username, password,title) VALUES ('Asi_user', '$2a$10$IDhLRlEAHiff18CIk5eKkeTfSIVG/YEFDB859xJklP8xIbTwbZ1kC','asi');

-- CREATE TABLE UserRetation (
--     id SERIAL PRIMARY KEY,
--     description varchar(40) NOT NULL,
--     createAt DATE DEFAULT Now,
-- )