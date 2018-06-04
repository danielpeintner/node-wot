/********************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
 * 
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 * Document License (2015-05-13) which is available at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/

// global W3C WoT Scripting API definitions
import WoT from "wot-typescript-definitions";

export const DEFAULT_HTTP_CONTEXT: string = "http://w3c.github.io/wot/w3c-wot-td-context.jsonld";
export const DEFAULT_HTTPS_CONTEXT: string = "https://w3c.github.io/wot/w3c-wot-td-context.jsonld";
export const DEFAULT_THING_TYPE: string = "Thing";

/* TODOs / Questions
 ~ In Thing index structure could be read-only (sanitizing needs write access)
*/

/**
 * node-wot definition for instantiated Thing Descriptions (Things)
 */
export default class Thing {
  /** collection of string-based keys that reference values of any type */
  // readonly
  [key: string]: any; /* e.g., @context besides the one that are explitecly defined below */
  // readonly 
  id: string;
  // readonly
  name: string;
  // readonly
  description: string;
  // readonly
  base?: string;

  /** collection of string-based keys that reference a property of type Property2 */
  // readonly
  properties: {
    [key: string]: Property
  };

  /** collection of string-based keys that reference a property of type Action2 */
  // readonly
  actions: {
    [key: string]: Action;
  }

  /** collection of string-based keys that reference a property of type Event2 */
  // readonly
  events: {
    [key: string]: Event;
  }
  // readonly
  securityDefinitions: Security;

  /** Web links to other Things or metadata */
  public link?: Array<any>;

  constructor() {
    // this.context = [DEFAULT_HTTPS_CONTEXT];
    // this.semanticType = []; // DEFAULT_THING_TYPE
    // this.metadata = [];
    // this.interaction = [];
    // this.link = []
  }
}

/**
 * node-wot definition for Interactions
 */
export class Interaction {
  name: string;
  form: Array<Form>;
}




/**
 * node-wot definition for form / binding metadata
 */
export class Form {
  href: string;
  mediaType: string;
  rel: string;
  security: string; /* FIXME: what type */
}

export class Property extends Interaction {
  writable: boolean;
  observable: boolean;

  schema: string;
}

export class Action extends Interaction {
  /** TODO add definitions */
  inputSchema: string;
  outputSchema: string;
}
export class Event extends Interaction {
  /** TODO add definitions */
  schema: string;
}


/**
 * node-wot definition for security metadata
 */
export class Security {
  readonly in: string;
  readonly scheme: string;
}