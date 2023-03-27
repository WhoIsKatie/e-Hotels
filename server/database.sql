CREATE DATABASE e-Hotel;


CREATE TABLE hotel_chain (chain_id integer NOT NULL DEFAULT 'nextval('hotel_chain_chain_id_seq'::regclass)',
                                                                                              name character varying(50) COLLATE pg_catalog."default",
                                                                                                                                 street_num integer, street_name character varying(100) COLLATE pg_catalog."default",
                                                                                                                                                                                                unit_num integer, city character varying(20) COLLATE pg_catalog."default",
                                                                                                                                                                                                                                                     country character varying(20) COLLATE pg_catalog."default",
                                                                                                                                                                                                                                                                                           postal_code character varying(10) COLLATE pg_catalog."default",
                                                                                                                                                                                                                                                                                                                                     CONSTRAINT hotel_chain_pkey PRIMARY KEY (chain_id));