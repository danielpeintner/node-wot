
/** TypeSystem based on https://w3c.github.io/wot-thing-description/#type-system  */

export enum Type {
    string,
    integer,
    number,
    object,
    array,
    boolean,
    null
}


/** Object properties */
export interface FieldType {
    /** The name attribute represents the field name. */
    name: string;

    value: TypeSystem;
}

export interface TypeSystem {

    /** The type attribute represents the type name. */
    type: Type;

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

    /* TODO String facets */

    /** for object */
    field? : FieldType[];

    /** for arrays */
    items? : TypeSystem;
    minItems?: number;
    maxItems?: number;

}

/** General comments/questions
 * - any way to define conditional statements such as (if type integer OR number minimum available, in any othe case not)
 * 
 * 
 */

 
/**
 * String Type features
 * - "minLength": 2
 * - "maxLength": 3
 * - Regular Expressions: "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
 * - Format: "date-time", "email", "hostname", "ipv4", "ipv6", "ipv6"
 */


/**
 * Numeric Type features
 * - "multipleOf" e.g.,  10
 * - range:  "minimum"/numericValue, "maximum"/numericValue, "exclusiveMinimum"/boolean and "exclusiveMaximum"/boolean
 */

/**
 * Object Type features
 * - properties: "field" in JSON-LD
 * - "additionalProperties": false
 * - "required": ["name", "email"]
 * - Size: "minProperties": 2 and "maxProperties": 3
 * - dependencies ??
 * - "patternProperties":
 */

 /**
 * Array Type features
 * - "items"
 * - additionalItems
 * - Length: "minItems": 2 and "maxItems": 3
 * - "uniqueItems": true
 */


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

/** Example type that should be forbidden/not possible mix between integer and array type */
let wrongInteger1 : TypeSystem = {
    type: Type.integer,
    minItems: 123
};


/**
 * 
 * EXPERIMANTAL!!!!!!!!!!!!!!!!!!!!
 * 
 */

export interface ImprovedTypeSystem {
    integer?: IntegerType;
    array?: ArrayType;
}

export interface IntegerType {
    minimum?: number;
    maximum?: number;
}

export interface ArrayType {
    minItems?: number;
}


let fooInteger1 : ImprovedTypeSystem = {
    integer:  {minimum: 12, maximum: 18
        // , minItems: 1 // not anymore possible
    }
};

let fooArray1 : ImprovedTypeSystem = {
    array:  {
        // minimum: 12, maximum: 18  // not anymore possible
        minItems: 1
    }
};