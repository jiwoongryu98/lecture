CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slideIndex INTEGER NOT NULL CHECK (slideIndex >= 1),
  step INTEGER NOT NULL CHECK (step >= 0),
  name TEXT,
  body TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  submissionRequestId TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS questions_slide_cursor ON questions (slideIndex, id);
