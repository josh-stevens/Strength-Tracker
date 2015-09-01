CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255),
  password VARCHAR(255),
  facebook_id VARCHAR(255),
  facebook_token VARCHAR(255),
  facebook_name VARCHAR(255),
  facebook_email VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE workouts (
  id INT NOT NULL AUTO_INCREMENT,
  uid INT NOT NULL,
  day DATE NOT NULL UNIQUE,
  set1_weight INT NOT NULL,
  set1_reps INT NOT NULL,
  set2_weight INT NOT NULL,
  set2_reps INT NOT NULL,
  set3_weight INT NOT NULL,
  set3_reps INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE
);