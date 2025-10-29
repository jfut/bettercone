/**
 * additional-fields
 * Additional form fields configuration
 */

export type FieldType = "text" | "number" | "boolean" | "date" | "select" | "textarea";

export interface AdditionalFields {
    [key: string]: any;
}
