-- public.memberships definition

-- Drop table

-- DROP TABLE public.memberships;

CREATE TABLE public.memberships (
	id int4 DEFAULT nextval('membership_id_seq'::regclass) NOT NULL,
	email varchar(255) NOT NULL,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	profile_image varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT membership_pkey1 PRIMARY KEY (id)
);