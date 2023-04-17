select * from loaning;
select * from opus;
select * from specimen;
select * from student;

CREATE TABLE kotelezo.loaning (
  id INT(11) NOT NULL AUTO_INCREMENT,
  specimentid INT(11) DEFAULT NULL,
  studentid INT(11) DEFAULT NULL,
  away DATE DEFAULT NULL,
  back DATE DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

CREATE TABLE kotelezo.opus (
  id INT(11) NOT NULL AUTO_INCREMENT,
  writer VARCHAR(255) DEFAULT NULL,
  title VARCHAR(255) DEFAULT NULL,
  year INT(11) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

CREATE TABLE kotelezo.specimen (
  id INT(11) NOT NULL AUTO_INCREMENT,
  opusid INT(11) DEFAULT NULL,
  price INT(11) DEFAULT NULL,
  acquisition DATE DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

CREATE TABLE kotelezo.student (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) DEFAULT NULL,
  year INT(11) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

CREATE TABLE kotelezo.users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(255) DEFAULT NULL,
  lastName VARCHAR(255) DEFAULT NULL,
  gender VARCHAR(255) DEFAULT NULL,
  userName VARCHAR(255) DEFAULT NULL,
  email VARCHAR(50) DEFAULT NULL,
  password VARCHAR(255) DEFAULT NULL,
  number VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

# get loaningSpecimen (inner join)
select * from loaning l
  inner join specimen s on s.sId = l.id;

