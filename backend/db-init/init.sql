CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4(),
  github_id varchar(50) UNIQUE NOT NULL,
  github_username varchar(50) NOT NULL,
  github_avatar_url varchar DEFAULT null,
  github_profile_url varchar DEFAULT null,
  github_bio text DEFAULT null,
  github_location varchar(100) DEFAULT null,
  github_access_token varchar DEFAULT null,
  github_refresh_token varchar DEFAULT null,
  karma int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  last_login_at timestamptz NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE posts (
  id uuid DEFAULT uuid_generate_v4(),
  title varchar(300) NOT NULL,
  content text NOT NULL,
  upvotes int NOT NULL DEFAULT 0,
  downvotes int NOT NULL DEFAULT 0,
  author_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  last_edited_at timestamptz NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE post_votes (
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  vote_type vote_type NOT NULL,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4(),
  name varchar(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE has_category (
  post_id uuid,
  category_id uuid,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE post_images (
  id uuid DEFAULT uuid_generate_v4(),
  image_path text NOT NULL,
  post_id uuid NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments (
  id uuid DEFAULT uuid_generate_v4(),
  content text NOT NULL,
  author_id uuid NOT NULL,
  post_id uuid NOT NULL,
  upvotes int NOT NULL DEFAULT 0,
  downvotes int NOT NULL DEFAULT 0,
  created_at timestampz NOT NULL,
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

CREATE TABLE sessions {
  id uuid,
  user_id uuid NOT NULL,
  "session" json,
  expires_at timestamptz,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
};
