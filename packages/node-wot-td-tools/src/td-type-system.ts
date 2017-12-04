
/** TypeSystem based on https://w3c.github.io/wot-thing-description/#type-system  */

export declare type TypeSystem = StringType | NumericType | ArrayType | ObjectType | BooleanType | NullType;

/** enumeration of possible types */
export enum Type {
    string,
    integer,
    number,
    object,
    array,
    boolean,
    null
}



/**
 * Specify generic type attribute (e.g, boolean and null)
 */
export interface GenericType {    
    /** The type attribute represents the type name. */
    type: Type;
}

/**
 * String Type features
 * - "minLength": 2
 * - "maxLength": 3
 * - Regular Expressions: "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
 * - Format: "date-time", "email", "hostname", "ipv4", "ipv6", "ipv6"
 */
export interface StringType extends GenericType  {
    /** set to string type */
    type: Type.string;
}


/**
 * Numeric Type features
 * - "multipleOf" e.g.,  10
 * - range:  "minimum"/numericValue, "maximum"/numericValue, "exclusiveMinimum"/boolean and "exclusiveMaximum"/boolean
 */
export interface NumericType extends GenericType {
    /** set to integer/number type */
    type: Type.integer | Type.number;

    /**
     * minimum specifies a minimum numeric value
     * (Optional for Numeric types, forbidden for all other types)
     */
    minimum?: number;
    
    /**
     * exclusiveMinimum is a boolean. When true, it indicates that the range excludes the minimum value
     * (Optional for Numeric types, forbidden for all other types)
     */
    exclusiveMinimum?: boolean;
    
    /**
     * maximum specifies a maximum numeric value.
     * (Optional for Numeric types, forbidden for all other types)
     */
    maximum?: number;

    /**
     * exclusiveMaximum is a boolean. When true, it indicates that the range excludes the maximum value
     * (Optional for Numeric types, forbidden for all other types) 
     */
    exclusiveMaximum?: boolean;
    
}

/**
 * Object Type features
 * - properties: "field" in JSON-LD
 * - "additionalProperties": false
 * - "required": ["name", "email"]
 * - Size: "minProperties": 2 and "maxProperties": 3
 * - dependencies ??
 * - "patternProperties":
 */
export interface ObjectType extends GenericType  {
    /** set to string type */
    type: Type.object;

    field? : FieldType[];
}

/** Object properties */
export interface FieldType {
    /** The name attribute represents the field name. */
    name: string;

    value: TypeSystem;
}

 /**
 * Array Type features
 * - "items"
 * - additionalItems
 * - Length: "minItems": 2 and "maxItems": 3
 * - "uniqueItems": true
 */
export interface ArrayType extends GenericType  {
    /** set to integer type */
    type: Type.array;
    items? : TypeSystem;
    minItems?: number;
    maxItems?: number;
}

export interface BooleanType extends GenericType  {
    /** set to boolean type */
    type: Type.boolean;
}

export interface NullType extends GenericType  {
    /** set to null type */
    type: 6; // Type.null causes TS error ts1003
}


/* Some examples */

let string : TypeSystem = {type: Type.string};

let integer1 : TypeSystem = {type: Type.integer};
let integer2 : TypeSystem = {type: Type.integer, minimum: 12, maximum: 18};
let integer3 : TypeSystem = {type: Type.integer, minimum: 12, exclusiveMinimum: true};

let number1 : TypeSystem = {type: Type.number, maximum: 12.234, exclusiveMaximum: true};

let boolean1 : TypeSystem = {type: Type.boolean};

let null1 : TypeSystem = {type: Type.null};

let object1 : TypeSystem = {
    type: Type.object,
    field: [
        {
            name: "id",
            value: {type: Type.integer} 
        },
        {
            name: "name",
            value: {type: Type.string} 
        }
    ]
};

let array1 : TypeSystem = {
    type: Type.array,
    items: {
        type: Type.number,
        minimum: 0,
        maximum: 2047
    },
    minItems: 2,
    maxItems: 3
};

/** Example type that should be forbidden/not possible: mix between integer and array type */
/*
let wrongInteger1 : TypeSystem = {
    type: Type.integer,
    minItems: 123
};

*/
