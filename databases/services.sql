-- public.services definition

-- Drop table

-- DROP TABLE public.services;

CREATE TABLE public.services (
	id int4 DEFAULT nextval('service_id_seq'::regclass) NOT NULL,
	service_code varchar NOT NULL,
	service_name varchar NOT NULL,
	service_icon varchar NOT NULL,
	service_tarif numeric NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT service_pk PRIMARY KEY (id)
);