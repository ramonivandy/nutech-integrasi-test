-- public.balances definition

-- Drop table

-- DROP TABLE public.balances;

CREATE TABLE public.balances (
	id int4 DEFAULT nextval('balance_id_seq'::regclass) NOT NULL,
	user_id varchar NOT NULL,
	balance varchar NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT balance_pk PRIMARY KEY (id)
);