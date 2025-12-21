-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
CREATE TABLE public.agencies (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    display_name text NOT NULL,
    logo_url text,
    phone text,
    email text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT agencies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.listing_favorites (
    listing_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT listing_favorites_pkey PRIMARY KEY (listing_id, user_id),
    CONSTRAINT listing_favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listing_images (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    listing_id uuid NOT NULL,
    image_url text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT listing_images_pkey PRIMARY KEY (id),
    CONSTRAINT listing_images_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listing_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    listing_id uuid NOT NULL,
    sender_user_id uuid,
    sender_name text,
    sender_phone text,
    sender_email text,
    message_body text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT listing_messages_pkey PRIMARY KEY (id),
    CONSTRAINT listing_messages_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listing_reports (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    listing_id uuid NOT NULL,
    reporter_user_id uuid,
    reason text,
    details text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT listing_reports_pkey PRIMARY KEY (id),
    CONSTRAINT listing_reports_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listing_views (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    listing_id uuid NOT NULL,
    viewer_user_id uuid,
    viewer_ip inet,
    user_agent text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT listing_views_pkey PRIMARY KEY (id),
    CONSTRAINT listing_views_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    listing_code text NOT NULL UNIQUE,
    kind USER - DEFINED NOT NULL,
    status USER - DEFINED NOT NULL DEFAULT 'draft'::listing_status,
    is_featured boolean NOT NULL DEFAULT false,
    title text NOT NULL,
    description text,
    region_id smallint NOT NULL,
    township_id integer,
    property_type_id smallint,
    floor_label text,
    bedrooms smallint,
    bathrooms smallint,
    width_ft numeric,
    length_ft numeric,
    area_sqft integer,
    area_label text,
    currency USER - DEFINED NOT NULL DEFAULT 'MMK'::currency_code,
    price_amount numeric,
    price_unit_label text,
    price_per_sqft numeric,
    address_text text,
    lat numeric,
    lng numeric,
    agency_id uuid,
    owner_user_id uuid,
    views_count integer NOT NULL DEFAULT 0,
    published_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT listings_pkey PRIMARY KEY (id),
    CONSTRAINT listings_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id),
    CONSTRAINT listings_township_id_fkey FOREIGN KEY (township_id) REFERENCES public.townships(id),
    CONSTRAINT listings_property_type_id_fkey FOREIGN KEY (property_type_id) REFERENCES public.property_types(id),
    CONSTRAINT listings_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id)
);
CREATE TABLE public.property_types (
    id smallint NOT NULL,
    name_mm text NOT NULL,
    name_en text,
    sort_order smallint NOT NULL DEFAULT 0,
    CONSTRAINT property_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.regions (
    id smallint NOT NULL,
    name_mm text NOT NULL,
    name_en text,
    sort_order smallint NOT NULL DEFAULT 0,
    CONSTRAINT regions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.townships (
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    region_id smallint NOT NULL,
    name_mm text NOT NULL,
    name_en text,
    sort_order smallint NOT NULL DEFAULT 0,
    CONSTRAINT townships_pkey PRIMARY KEY (id),
    CONSTRAINT townships_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id)
);
