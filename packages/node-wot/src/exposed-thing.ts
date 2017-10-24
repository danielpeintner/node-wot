/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

// import * as WoT from "wot-typescript-definitions";

import {ResourceListener} from "./resource-listeners/protocol-interfaces"
import {ThingDescription} from "node-wot-td-tools";
import ConsumedThing from "./consumed-thing";
import * as TD from "node-wot-td-tools";
import * as Rest from "./resource-listeners/all-resource-listeners"
import Servient from "./servient";
import * as TDGenerator from "./td-generator"

//import {RequestType} from "wot-typescript-definitions";
// import * as WoT from 'wot-typescript-definitions';

export default class ExposedThing extends ConsumedThing implements WoT.ExposedThing {
    // these arrays and their contents are mutable
    private interactions: Array<TD.Interaction> = [];
    // private interactionStates: { [key: string]: InteractionState } = {}; //TODO migrate to Map
    private propertyStates: { [key: string]: InteractionState } = {}; //TODO migrate to Map
    private restListeners: Map<string, ResourceListener> = new Map<string, ResourceListener>();

    private updatePropertyHandler: WoT.RequestHandler = undefined;
    private retrievePropertyHandler: WoT.RequestHandler = undefined;
    private invokeActionHandler: WoT.RequestHandler = undefined;
    private observeHandler: WoT.RequestHandler = undefined;
    

    constructor(servient: Servient, td: ThingDescription) { // name: string
        super(servient, td);
        this.addResourceListener("/" + this.name, new Rest.TDResourceListener(this));
    }

    private addResourceListener(path: string, resourceListener: ResourceListener) {
        this.restListeners.set(path, resourceListener);
        this.srv.addResourceListener(path, resourceListener);
    }

    private removeResourceListener(path: string) {
        this.restListeners.delete(path);
        this.srv.removeResourceListener(path);
    }

    public getInteractions(): Array<TD.Interaction> {
        // returns a copy
        return this.interactions.slice(0);
    }

    /** invokes an action on the target thing
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters
    */
    public invokeAction(actionName: string, parameter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            console.log("Try to invokeAction for: " + actionName + " (handler --> " + this.invokeActionHandler + ")");

            if(this.invokeActionHandler != null) {
                resolve(this.invokeActionHandler((
                    {
                        type: null, // WoT.RequestType.action, // error TS2686: 'WoT' refers to a UMD global, but the current file is a module. Consider adding an import instead.
                        from: "",
                        name: actionName,
                        options: {},
                        data: parameter,
                        respond: null,
                        respondWithError: null
                    }
                )));
            } else {
                reject(new Error("No invokeAction handler set"));
            }

            // let state = this.interactionStates[actionName];
            // if (state) {
            //     console.log("Action state : " + state);

            //     if (state.handlers.length) {
            //         let handler = state.handlers[0];
            //         resolve(handler(parameter));
            //     } else {
            //         reject(new Error("No handler for " + actionName + " on " + this.name));
            //     }
            // } else {
            //     reject(new Error("No action " + actionName + " on " + this.name));
            // }
        });
    }

    /**
     * Set a given property
     * @param Name of the property
     * @param newValue value to be set
     */
    public setProperty(propertyName: string, newValue: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            console.log("Try to setProperty for: " + propertyName + " (handler --> " + this.updatePropertyHandler + ")");

            // if(this.updatePropertyHandler != null) {
            //     resolve(this.updatePropertyHandler((
            //         {
            //             type: null, // WoT.RequestType.property,
            //             from: "",
            //             name: propertyName,
            //             options: {},
            //             data: newValue,
            //             respond: null,
            //             respondWithError: null
            //         }
            //     )));
            // } else {
                // reject(new Error("No updateProperty handler set"));
                let state = this.propertyStates[propertyName];
                if (state) {
                    let oldValue = state.value;
                    state.value = newValue;
                    // call handler if any
                    if(this.updatePropertyHandler != null) {
                        let req : WoT.Request = {
                            type: null, // WoT.RequestType.property,
                            from: "",
                            name: propertyName,
                            options: {},
                            data: newValue,
                            respond: null,
                            respondWithError: null
                        }
                        // this.updatePropertyHandler.call(req);
                        this.updatePropertyHandler.apply(this, req);
                    }
                    console.log("set new value for " + propertyName + " to: " + newValue);
                    resolve(state.value);
                } else {
                    reject(new Error("No property called " + propertyName));
                }
            // }

            // let state = this.interactionStates[propertyName];
            // if (state) {
            //     let oldValue = state.value;
            //     state.value = newValue;

            //     // calls all handlers
            //     state.handlers.forEach(handler => handler.apply(this, [newValue, oldValue]))

            //     resolve(newValue);
            // } else {
            //     reject(new Error("No property called " + propertyName));
            // }
        });
    }

    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    public getProperty(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            super.getProperty(propertyName);

            console.log("Try to getProperty for: " + propertyName + " (handler --> " + this.retrievePropertyHandler + ")");
            
            // if(this.retrievePropertyHandler != null) {
            //     resolve(this.retrievePropertyHandler((
            //         {
            //             type: null, //  WoT.RequestType.property,
            //             from: "",
            //             name: propertyName,
            //             options: {},
            //             data: null,
            //             respond: null,
            //             respondWithError: null
            //         }
            //     )));
            // } else {
                // reject(new Error("No updateProperty handler set"));

                let state = this.propertyStates[propertyName];
                if (state) {
                    console.log("in getProperty, state = " + JSON.stringify(state));
                    // call handler if any
                    if(this.retrievePropertyHandler != null) {
                        this.retrievePropertyHandler.apply(this, [state.value]);
                    }
                    console.log("return value for " + propertyName + ": " + state.value);
                    resolve(state.value);
                } else {
                    reject(new Error("No property called " + propertyName));
                }
            // }



            // let state = this.interactionStates[propertyName];
            // if (state) {
            //     resolve(state.value);
            // } else {
            //     reject(new Error("No property called " + propertyName));
            // }
        });
    }

    // define how to expose and run the Thing

    /** @inheritDoc */
    register(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    unregister(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    start(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    stop(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    public emitEvent(eventName: string, payload: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    onRetrieveProperty(handler: WoT.RequestHandler): ExposedThing {
        this.retrievePropertyHandler = handler;

        return this;
    }


    // function (request: WoT.Request) {
    //     request.name;
    //     return 1;
    // }

    /** @inheritDoc */
    // (request: WoT.Request) => any
    // handler: WoT.RequestHandler
    onInvokeAction(handler: WoT.RequestHandler): ExposedThing {
        this.invokeActionHandler = handler;

        // let state = this.interactionStates[handler.request.name]; // actionName
        // if (state) {
        //     if (state.handlers.length > 0) state.handlers.splice(0);
        //     state.handlers.push(handler); // .callback); // cb
        // } else {
        //     console.error("no such action " + handler.request.name + " on " + this.name);
        // }

        return this;
    }

    /** @inheritDoc */
    onUpdateProperty(handler: WoT.RequestHandler): ExposedThing {
        this.updatePropertyHandler = handler;

        // // propertyName: string, cb: (newValue: any, oldValue?: any) => void
        // let state = this.interactionStates[handler.request.name]; // propertyName
        // if (state) {
        //     state.handlers.push(handler.callback); // cb
        // } else {
        //     console.error("no such property " + handler.request.name + " on " + this.name);
        // }

        return this;
    }

    /** @inheritDoc */
    onObserve(handler: WoT.RequestHandler): ExposedThing {
        this.updatePropertyHandler = handler;

        return this;
    }


    /**
     * Retrive the ExposedThing description for this object
     */
    getDescription(): Object {
        //this is downright madness - TODO clean it up soon
        return JSON.parse(
            TD.serializeTD(
                TDGenerator.generateTD(this, this.srv)
            )
        )
    }

    /** @inheritDoc */
    addProperty(property: WoT.ThingPropertyInit): ExposedThing {
        // propertyName: string, valueType: Object, initialValue?: any

        // new way
        let newProp = new TD.Interaction();
        newProp.pattern = TD.InteractionPattern.Property;
        newProp.name = property.name;  //propertyName;
        // newProp.inputData = { 'valueType' : valueType};
        // newProp.outputData =  { 'valueType' : valueType};
        newProp.outputData = null; // need paramater for valueType;
        newProp.writable = property.writable;

        this.interactions.push(newProp);
        console.log("Add property '" + property.name + "' to interactions");

        let propState = new InteractionState();
        propState.value = property.value; // initialValue;
        this.propertyStates[property.name] = propState;
        console.log("in addProperty, state = " + JSON.stringify(propState));
        // propState.handlers = [];
        // this.interactionStates[property.name] = propState;
        console.log("Add property '" + property.name + "' to propertyStates with value " + propState.value);

        this.addResourceListener("/" + this.name + "/properties/" + property.name, new Rest.PropertyResourceListener(this, newProp));

        return this;
    }

    /** @inheritDoc */
    addAction(action: WoT.ThingActionInit): ExposedThing {
        // actionName: string, inputType?: Object, outputType?: Object
        // new way
        let newAction = new TD.Interaction();
        newAction.pattern = TD.InteractionPattern.Action;
        newAction.name = action.name;
        // TODO inputData & outputData
        newAction.inputData = null; // inputType ? inputType : null;
        newAction.outputData = null; //  outputType ? outputType : null;

        this.interactions.push(newAction);
        console.log("Add action '" + action.name + "' to interactions");

        // let actionState = new InteractionState();
        // // actionState.value = action.action;
        // actionState.handlers = [];

        // console.log("Add action '" + action.name + "' to interactionStates");

        // this.interactionStates[action.name] = actionState;

        this.addResourceListener("/" + this.name + "/actions/" + action.name, new Rest.ActionResourceListener(this, newAction));

        return this;
    }

    /**
     * declare a new eventsource for the ExposedThing
     */
    addEvent(event: WoT.ThingEventInit): ExposedThing { 
        // eventName: string
        let newEvent = new TD.Interaction();
        newEvent.pattern = TD.InteractionPattern.Event;
        newEvent.name = event.name; //  eventName;

        this.interactions.push(newEvent);
        console.log("Add event '" + event.name + "' to interactions");

        //  let eventState = new InteractionState();
        // eventState.handlers = [];

        // this.interactionStates[event.name] = eventState;

        // TODO this.addResourceListener(...)

        return this;
    }

    /** @inheritDoc */
    removeProperty(propertyName: string): ExposedThing {
        for (let i = this.interactions.length - 1; i >= 0; i--) {
            if (this.interactions[i].pattern == TD.InteractionPattern.Property && this.interactions[i].name == propertyName) { 
                this.interactions.splice(i, 1);
            }
        }

        // delete this.interactionStates[propertyName];
        this.removeResourceListener(this.name + "/properties/" + propertyName)
        return this;
    }

    /** @inheritDoc */
    removeAction(actionName: string): ExposedThing {
        for (let i = this.interactions.length - 1; i >= 0; i--) {
            if (this.interactions[i].pattern == TD.InteractionPattern.Action && this.interactions[i].name == actionName) { 
                this.interactions.splice(i, 1);
            }
        }

        // delete this.interactionStates[actionName];
        this.removeResourceListener(this.name + "/actions/" + actionName)
        return this;
    }

    /** @inheritDoc */
    removeEvent(eventName: string): ExposedThing {
        for (let i = this.interactions.length - 1; i >= 0; i--) {
            if (this.interactions[i].pattern == TD.InteractionPattern.Event && this.interactions[i].name == eventName) { 
                this.interactions.splice(i, 1);
            }
        }

        // TODO remove resource

        return this;
    }
}

class InteractionState {
    public value: any;
    // public handlers: Array<(param?: any) => any> = [];
    // public handlers: Array<Function> = [];
    // public path: string;
}
