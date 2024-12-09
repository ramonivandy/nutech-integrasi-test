-- public.transactions definition

-- Drop table

-- DROP TABLE public.transactions;

CREATE TABLE public.transactions (
	id serial4 NOT NULL,
	user_id varchar NOT NULL,
	invoice_number varchar NOT NULL,
	service_code varchar NOT NULL,
	service_name varchar NOT NULL,
	transaction_type varchar NOT NULL,
	total_amount varchar NOT NULL,
	created_on timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT transaction_pk PRIMARY KEY (id)
);