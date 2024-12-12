CREATE TABLE IF NOT EXISTS annotation (
  id INTEGER NOT NULL AUTOINCREMENT,
  x DECIMAL,
  y DECIMAL,
  z DECIMAL,
  content TEXT,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS operator (
	id INTEGER NOT NULL AUTOINCREMENT,
	name TEXT,
	surname TEXT,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS annotation_operator (
  annotation_id INTEGER NOT NULL,
  operator_id INTEGER NOT NULL,
	PRIMARY KEY (annotation_id, operator_id)
);

CREATE TABLE IF NOT EXISTS model_annotation (
  model_id INTEGER NOT NULL,
  annotation_id INTEGER NOT NULL,
	PRIMARY KEY (model_id, annotation_id)
);
