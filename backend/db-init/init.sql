CREATE TABLE categories (
  id SERIAL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

-- CREATE TABLE users (
--   id SERIAL,
--   github_id VARCHAR(50) UNIQUE NOT NULL,
--   username VARCHAR(50) NOT NULL,
--   email VARCHAR(255), -- Do I really need this?
--   avatar_url TEXT,
--   bio TEXT,
--   github_url TEXT, 
--   karma INT NOT NULL,
  
--   PRIMARY KEY(id)
-- );

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  content TEXT,
  upvotes INT NOT NULL,
  downvotes INT NOT NULL,
  author_id SERIAL,
  PRIMARY KEY(id),
  FOREIGN KEY(author_id) REFERENCES users
);