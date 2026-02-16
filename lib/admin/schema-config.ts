/**
 * Admin schema config: maps table slugs to table names, columns, FKs, and CRUD flags.
 * Single source for what the admin UI can do; validated at runtime via schema-check.
 */

export type ColumnDef = {
  key: string;
  label?: string;
  editable: boolean;
  type?: "string" | "number" | "boolean" | "uuid" | "timestamp" | "text" | "integer" | "numeric" | "enum";
  enumValues?: readonly string[];
  required?: boolean;
};

export type ForeignKeyDef = {
  column: string;
  targetTable: string;
  targetLabelColumn: string;
  /** Optional: filter target rows, e.g. by parent FK for townships by region */
  targetSlug: string;
};

export type TableConfig = {
  slug: string;
  tableName: string;
  displayName: string;
  primaryKey: string;
  /** For composite PKs (e.g. listing_favorites: listing_id, user_id). Detail [id] is encoded as "val1_val2". */
  compositePrimaryKey?: string[];
  columns: ColumnDef[];
  foreignKeys: ForeignKeyDef[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  /** For list view: select these relations (e.g. "region:regions(id,name_en)") */
  listSelect?: string;
  /** Optional: column to use for search (e.g. "title", "name_mm") */
  searchColumn?: string;
  /** Column to show as primary label (user-friendly name instead of ID) */
  displayColumn?: string;
};

const LISTING_KINDS = ["sale", "rent", "new_launch", "hostel"] as const;
const LISTING_STATUSES = ["draft", "published", "archived"] as const;
const CURRENCY_CODES = ["MMK", "USD", "THB"] as const;

export const ADMIN_TABLE_SLUGS = [
  "regions",
  "townships",
  "property-types",
  "agencies",
  "listings",
  "listing-images",
  "listing-favorites",
  "listing-views",
  "listing-messages",
  "listing-reports",
] as const;

/** Slugs for manage-data under /protected (no admin path). Admin-only. */
export const PROTECTED_MANAGE_SLUGS = [
  "regions",
  "townships",
  "property-types",
  "agencies",
] as const;

export type AdminTableSlug = (typeof ADMIN_TABLE_SLUGS)[number];

export const SCHEMA_CONFIG: Record<AdminTableSlug, TableConfig> = {
  regions: {
    slug: "regions",
    tableName: "regions",
    displayName: "Regions",
    primaryKey: "id",
    displayColumn: "name_en",
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: true, type: "integer", required: true },
      { key: "name_mm", label: "Name (MM)", editable: true, type: "string", required: true },
      { key: "name_en", label: "Name (EN)", editable: true, type: "string" },
      { key: "sort_order", label: "Sort order", editable: true, type: "integer" },
    ],
    foreignKeys: [],
    searchColumn: "name_mm",
  },
  townships: {
    slug: "townships",
    tableName: "townships",
    displayName: "Townships",
    primaryKey: "id",
    displayColumn: "name_en",
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "integer" },
      { key: "region_id", label: "Region", editable: true, type: "integer", required: true },
      { key: "name_mm", label: "Name (MM)", editable: true, type: "string", required: true },
      { key: "name_en", label: "Name (EN)", editable: true, type: "string" },
      { key: "sort_order", label: "Sort order", editable: true, type: "integer" },
    ],
    foreignKeys: [
      { column: "region_id", targetTable: "regions", targetLabelColumn: "name_en", targetSlug: "regions" },
    ],
    listSelect: "region:regions(id,name_en,name_mm)",
    searchColumn: "name_mm",
  },
  "property-types": {
    slug: "property-types",
    tableName: "property_types",
    displayName: "Property types",
    primaryKey: "id",
    displayColumn: "name_en",
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: true, type: "integer", required: true },
      { key: "name_mm", label: "Name (MM)", editable: true, type: "string", required: true },
      { key: "name_en", label: "Name (EN)", editable: true, type: "string" },
      { key: "sort_order", label: "Sort order", editable: true, type: "integer" },
    ],
    foreignKeys: [],
    searchColumn: "name_mm",
  },
  agencies: {
    slug: "agencies",
    tableName: "agencies",
    displayName: "Agencies",
    primaryKey: "id",
    displayColumn: "display_name",
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "uuid" },
      { key: "display_name", label: "Display name", editable: true, type: "string", required: true },
      { key: "logo_url", label: "Logo URL", editable: true, type: "string" },
      { key: "phone", label: "Phone", editable: true, type: "string" },
      { key: "email", label: "Email", editable: true, type: "string" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [],
    searchColumn: "display_name",
  },
  listings: {
    slug: "listings",
    tableName: "listings",
    displayName: "Listings",
    primaryKey: "id",
    displayColumn: "title",
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "uuid" },
      { key: "listing_code", label: "Listing code", editable: true, type: "string", required: true },
      { key: "kind", label: "Kind", editable: true, type: "enum", enumValues: LISTING_KINDS, required: true },
      { key: "status", label: "Status", editable: true, type: "enum", enumValues: LISTING_STATUSES, required: true },
      { key: "is_featured", label: "Featured", editable: true, type: "boolean" },
      { key: "title", label: "Title", editable: true, type: "string", required: true },
      { key: "description", label: "Description", editable: true, type: "text" },
      { key: "region_id", label: "Region", editable: true, type: "integer", required: true },
      { key: "township_id", label: "Township", editable: true, type: "integer" },
      { key: "property_type_id", label: "Property type", editable: true, type: "integer" },
      { key: "floor_label", label: "Floor label", editable: true, type: "string" },
      { key: "bedrooms", label: "Bedrooms", editable: true, type: "integer" },
      { key: "bathrooms", label: "Bathrooms", editable: true, type: "integer" },
      { key: "width_ft", label: "Width (ft)", editable: true, type: "numeric" },
      { key: "length_ft", label: "Length (ft)", editable: true, type: "numeric" },
      { key: "area_sqft", label: "Area (sqft)", editable: true, type: "integer" },
      { key: "area_label", label: "Area label", editable: true, type: "string" },
      { key: "currency", label: "Currency", editable: true, type: "enum", enumValues: CURRENCY_CODES, required: true },
      { key: "price_amount", label: "Price amount", editable: true, type: "numeric" },
      { key: "price_unit_label", label: "Price unit label", editable: true, type: "string" },
      { key: "price_per_sqft", label: "Price per sqft", editable: true, type: "numeric" },
      { key: "address_text", label: "Address", editable: true, type: "string" },
      { key: "lat", label: "Lat", editable: true, type: "numeric" },
      { key: "lng", label: "Lng", editable: true, type: "numeric" },
      { key: "agency_id", label: "Agency", editable: true, type: "uuid" },
      { key: "owner_user_id", label: "Owner user ID", editable: true, type: "uuid" },
      { key: "views_count", label: "Views", editable: true, type: "integer" },
      { key: "published_at", label: "Published at", editable: true, type: "timestamp" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
      { key: "updated_at", label: "Updated at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [
      { column: "region_id", targetTable: "regions", targetLabelColumn: "name_en", targetSlug: "regions" },
      { column: "township_id", targetTable: "townships", targetLabelColumn: "name_en", targetSlug: "townships" },
      { column: "property_type_id", targetTable: "property_types", targetLabelColumn: "name_en", targetSlug: "property-types" },
      { column: "agency_id", targetTable: "agencies", targetLabelColumn: "display_name", targetSlug: "agencies" },
    ],
    listSelect: "region:regions(id,name_en),township:townships(id,name_en),property_type:property_types(id,name_en),agency:agencies(id,display_name)",
    searchColumn: "title",
  },
  "listing-images": {
    slug: "listing-images",
    tableName: "listing_images",
    displayName: "Listing images",
    primaryKey: "id",
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "uuid" },
      { key: "listing_id", label: "Listing", editable: true, type: "uuid", required: true },
      { key: "image_url", label: "Image URL", editable: true, type: "string", required: true },
      { key: "sort_order", label: "Sort order", editable: true, type: "integer" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [
      { column: "listing_id", targetTable: "listings", targetLabelColumn: "listing_code", targetSlug: "listings" },
    ],
    listSelect: "listing:listings(id,listing_code,title)",
  },
  "listing-favorites": {
    slug: "listing-favorites",
    tableName: "listing_favorites",
    displayName: "Listing favorites",
    primaryKey: "listing_id",
    compositePrimaryKey: ["listing_id", "user_id"],
    columns: [
      { key: "listing_id", label: "Listing ID", editable: false, type: "uuid" },
      { key: "user_id", label: "User ID", editable: false, type: "uuid" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [],
    canCreate: false,
    canEdit: false,
    canDelete: true,
    listSelect: "listing:listings(id,listing_code,title)",
  },
  "listing-views": {
    slug: "listing-views",
    tableName: "listing_views",
    displayName: "Listing views",
    primaryKey: "id",
    canCreate: false,
    canEdit: false,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "uuid" },
      { key: "listing_id", label: "Listing ID", editable: false, type: "uuid" },
      { key: "viewer_user_id", label: "Viewer user ID", editable: false, type: "uuid" },
      { key: "viewer_ip", label: "Viewer IP", editable: false, type: "string" },
      { key: "user_agent", label: "User agent", editable: false, type: "text" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [],
    listSelect: "listing:listings(id,listing_code,title)",
  },
  "listing-messages": {
    slug: "listing-messages",
    tableName: "listing_messages",
    displayName: "Listing messages",
    primaryKey: "id",
    canCreate: false,
    canEdit: false,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "uuid" },
      { key: "listing_id", label: "Listing ID", editable: false, type: "uuid" },
      { key: "sender_user_id", label: "Sender user ID", editable: false, type: "uuid" },
      { key: "sender_name", label: "Sender name", editable: false, type: "string" },
      { key: "sender_phone", label: "Sender phone", editable: false, type: "string" },
      { key: "sender_email", label: "Sender email", editable: false, type: "string" },
      { key: "message_body", label: "Message", editable: false, type: "text" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [],
    listSelect: "listing:listings(id,listing_code,title)",
  },
  "listing-reports": {
    slug: "listing-reports",
    tableName: "listing_reports",
    displayName: "Listing reports",
    primaryKey: "id",
    canCreate: false,
    canEdit: false,
    canDelete: true,
    columns: [
      { key: "id", label: "ID", editable: false, type: "uuid" },
      { key: "listing_id", label: "Listing ID", editable: false, type: "uuid" },
      { key: "reporter_user_id", label: "Reporter user ID", editable: false, type: "uuid" },
      { key: "reason", label: "Reason", editable: false, type: "string" },
      { key: "details", label: "Details", editable: false, type: "text" },
      { key: "created_at", label: "Created at", editable: false, type: "timestamp" },
    ],
    foreignKeys: [],
    listSelect: "listing:listings(id,listing_code,title)",
  },
};

/** Get config by URL slug (e.g. "listing-images" -> listing_images config). */
export function getTableConfigBySlug(slug: string): TableConfig | null {
  if (ADMIN_TABLE_SLUGS.includes(slug as AdminTableSlug)) {
    return SCHEMA_CONFIG[slug as AdminTableSlug];
  }
  return null;
}

/** Slug to table name for dynamic routes. */
export function slugToTableName(slug: string): string | null {
  const config = getTableConfigBySlug(slug);
  return config?.tableName ?? null;
}
