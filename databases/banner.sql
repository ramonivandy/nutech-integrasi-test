-- public.banner definition

-- Drop table

-- DROP TABLE public.banner;

CREATE TABLE public.banner (
	id serial4 NOT NULL,
	banner_name varchar NOT NULL,
	banner_image varchar NOT NULL,
	description varchar NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT banner_pk PRIMARY KEY (id)
);