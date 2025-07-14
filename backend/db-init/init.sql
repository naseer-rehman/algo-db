CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');

CREATE TABLE users (
  id UUID,
  github_id VARCHAR(50) UNIQUE,
  github_username VARCHAR(50),
  github_email VARCHAR(255), -- Do I really need this?
  github_avatar_url TEXT,
  github_profile_url TEXT,
  github_bio TEXT,
  github_location VARCHAR(100),
  github_access_token TEXT,
  karma INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  last_login_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE posts (
  id UUID,
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  upvotes INT NOT NULL,
  downvotes INT NOT NULL,
  author_id UUID,
  created_at timestamp NOT NULL,
  last_edited_at timestamp NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE post_votes (
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  vote_type vote_type NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE categories (
  id UUID,
  name VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE has_category (
  post_id UUID,
  category_id UUID,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE post_images (
  id uuid,
  image_path text NOT NULL,
  post_id uuid NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments (
  id uuid,
  content TEXT NOT NULL,
  author_id uuid NOT NULL,
  post_id uuid NOT NULL,
  upvotes int NOT NULL,
  downvotes int NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT commented
    FOREIGN KEY (author_id)
    REFERENCES users(id),
  CONSTRAINT comment_for_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
);

CREATE TABLE comment_votes (
  comment_id uuid NOT NULL,
  user_id uuid NOT NULL,
  vote_type vote_type NOT NULL,
  PRIMARY KEY (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);