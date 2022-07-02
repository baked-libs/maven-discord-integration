// Copyright (c) 2018 TheBusyBiscuit

'use strict'

/**
 *   Parses XML text and outputs a JSON XMLNode object
 *
 *   @param  {String}   xml      An XML string to parse
 *   @param  {Function} callback A callback that returns an error (if thrown) and a parsed JSON Object
 */

module.exports.promises = {
    fromXML: (xml) => new Promise((resolve, reject) => {
        module.exports.parseXML(xml, (err, json) => {
            if (err) reject(err);
            else resolve(json);
        })
    }),

    toXML: (node, options) => new Promise((resolve, reject) => {
        if (!(node instanceof XMLNode)) {
            reject(new TypeError("'node' must be of type 'XMLNode'"));
        }
        else {
            node.asXMLString(options, (err, xml) => {
                if (err) reject(err);
                else resolve(xml);
            });
        }
    })
}

module.exports.parseXML = (xml, callback) => {

    /** @type {Number} The index of our current character */
    let i = 0;

    /** @type {Number} The current layer in our hierarchy */
    let level = 0;

    /** @type {XMLNode} Our XML Tree*/
    let json = {};

    /** @type {XMLNode[]} A pool for all our nodes */
    let objects = [];

    /**
     *   XML content without line breaks, comments and the header element
     *   @type {String}
     */
    let doc = xml
    .replace(/(\r?\n|\r)|(<\?.*\?>)|(<!--.*-->)/g, "")
    .replace(/\t/g, " ")
    .replace(/\/>/g, "></>")
	.replace(/<!\[CDATA\[(\s*(?:.(?<!\]\]>)\s*)*)\]\]>/g, (str, cap) => cap.replace(/>/g, "&gt;").replace(/</g, "&lt;"));

    /** Crawl through the entire document, character by character */
    while (i < doc.length) {
        /** If the current character is '<' then we start to create a new element in the xml tree */
        if (doc.charAt(i) === "<") {

            /** @type {String} The name of our current node*/
            let node = "";
            i++;

            /** Keep appending the characters, until we hit an attribute or the end of this tag */
            while (doc.charAt(i) !== " " && doc.charAt(i) !== ">" && i < doc.length) {
                node += doc.charAt(i);
                i++;
            }

            /** If the tag name starts with a '/', then we are dealing with a closing tag */
            if (node.charAt(0) === "/") {
                /** We go a step back in our hierarchy */
                level--;
            }
            else {
                /** We advanced a layer in the hierarchy */
                level++;

                /** Let's create a new Node for our examined tag and set it's level to the current layer we are in */
                let obj = new XMLNode(node);
                obj.level = level;

                /** Keep looping while there are attributes to extract */
                while (doc.charAt(i) === " ") {
                    /** We can ignore blank characters, until we hit an actual attribute */
                    while (doc.charAt(i) === " ") {
                        i++;
                    }

                    let key = "";
                    let value = "";

                    /**
                    *   Continue scanning until we hit '=' which is a sign we finished reading our key
                    *   and can start to read our value
                    */
                    while (doc.charAt(i) !== "=" && i < doc.length) {
                        key += doc.charAt(i);
                        i++;
                    }

                    i++;
                    i++;

                    /** Keep reading our attribute's value until we hit the closing quotation mark */
                    while (!(doc.charAt(i) === "\"" && doc.charAt(i - 1) !== "\\") && i < doc.length) {
                        value += doc.charAt(i);
                        i++;
                    }
                    i++;

                    /** Now we can assign our attribute to the node */
                    obj.setAttribute(key, value);
                }

                /** Start to read the inner content of our element */
                let content = "";
                i++;

                /** Keep reading until we hit a new tag '<' */
                while (doc.charAt(i) !== "<" && i < doc.length) {
                    content += doc.charAt(i);
                    i++;
                }
                i--;

                /** Perform a regex test, to make sure, we disallow content that contains only blank spaces */
                if (!/^\s*$/.test(content)) {
                    obj.setValue(content);
                }

                /** Add our node to the pool */
                objects.push(obj);
            }
        }

        i++;
    }

    if (objects.length === 0) {
        callback(new Error("Invalid XML!"));
        return;
    }

    /** The first object in the pool is our root */
    json = objects[0];

    /** @type {Number} Index for our current node from the pool */
    let n = 1;

    /** @type {XMLNode[]} Our 'Path' that can be traced back, step-by-step */
    let hierarchy = [json];

    /** Loop through all Nodes in the pool */
    while (n < objects.length) {
        let obj = objects[n];
        let parent = hierarchy[hierarchy.length - 1];

        /** Check if the current node, is not a child of the node before */
        if (obj.level <= parent.level) {
            /** Move up in the hierarchy, until we reach our current node's layer*/
            for (let x = -1; x < parent.level - obj.level; x++) {
                hierarchy.splice(hierarchy.length - 1, 1);
            }

            /** Re-assign our parent to the node's actual parent */
            parent = hierarchy[hierarchy.length - 1];
        }
        hierarchy.push(obj);
        parent.addChild(obj);

        n++;
    }

    /** Remove the level value from all nodes, we no longer need it */
    for (let node of objects) {
        delete node.level;
    }

    /** We successfully parsed our XML string */
    callback(null, json);
}

/** Our XML Node class, that can contain a value, attributes and children (of type XMLNode) */
class XMLNode {

    /**
     *   Constructor for a new XML Node
     *   @param {String} name       The node's name
     *   @param {Object|String} [attributes] The node's attributes or value (if it's a String)
     *   @param {Object} [children]   Be careful with this one, refer to XMLNode#addChild(node: XMLNode) instead
     */
    constructor(name, attributes, children, value) {
        if (name instanceof String || typeof(name) === "string") {
            this.name = name;
        }
        else {
            throw new TypeError("XMLNodes need a valid 'name'");
        }

        /** 'this.attributes' has to be a proper JSON Object */
        if (attributes instanceof Object) this.attributes = attributes;
        else if (attributes instanceof String || typeof(attributes) === "string") {
            this.attributes = {};
            this.value = attributes;
        }
        else this.attributes = {};

        /** 'this.elements' has to be a proper JSON Object */
        if (children instanceof Object) this.elements = children;
        else if (children instanceof String || typeof(children) === "string") {
            this.elements = {};
            this.value = children;
        }
        else this.elements = {};

        if (value instanceof String || typeof(value) === "string") {
            this.value = value;
        }
    }

    /**
     *   Append another XMLNode to be this Node's child
     *   @param {XMLNode|XMLNode[]} node The Child Node
     */
    addChild(node) {
        /** In case we are adding multiple children at once */
        if (node instanceof Array) {
            for (let name of node) {
                this.addChild(name);
            }
        }
        else {
            /** 'node' must be of type 'XMLNode' */
            if (!(node instanceof XMLNode)) {
                throw new TypeError("'node' must be of type 'XMLNode'");
            }

            /**
             *   Assign this node a unique id, to be identified by
             */
            let index = 0;

            while(this.elements.hasOwnProperty(node.name + "[" + index + "]")) {
                index++;
            }

            this.elements[node.name + "[" + index + "]"] = node;
        }
    }

    /**
     *   Add/Set another XMLNode to be this node's children with a specified id/key
     *   @param {String} key  Must equal 'element[id]' where element equals the node's name and id is the index,
     *   refer to addChild(node: XMLNode) if unsure about the index
     *   @param {XMLNode} node The Child Node you want to add
     */
    setChild(key, node) {
        /** 'node' must be of type 'XMLNode' */
        if (!(node instanceof XMLNode)) {
            throw new TypeError("'node' must be of type 'XMLNode'");
        }

        /** Append the index 0 if none is specified */
        let path = key;
        if (!/^.*\[[0-9]\]$/.test(path)) {
            path += "[0]";
        }

        this.elements[path] = node;
    }

    /**
     *   Set a node's attribute, or delete it if 'value' is null
     *   @param {String} key The attribute's key
     *   @param {String} value The value you want to set
        */
    setAttribute(key, value) {
        if (!(key instanceof String || typeof(key) === "string")) {
            throw new TypeError("'key' must be of type 'String'");
        }

        /** 'value' is null, so we delete our attribute */
        if (value == null) {
            delete this.attributes[key];
        }
        else if (!(value instanceof String || typeof(value) === "string")) {
            throw new TypeError("'value' must be of type 'String'");
        }
        else {
            this.attributes[key] = value;
        }
    }

    /**
     *   Set a node's value, or delete it if 'value' is null
     *   @param {String} value The value you want to set
     */
    setValue(value) {
        /** 'value' is null, so we delete our value */
        if (value == null) {
            delete this.value;
        }
        else if (!(value instanceof String || typeof(value) === "string")) {
            throw new TypeError("'value' must be of type 'String'");
        }
        else {
            this.value = value;
        }
    }

    /**
     * Returns this node's value.
     * @return {String} The value
     */
    getValue() {
        return this.value;
    }

    /**
     * Returns a node's attribute value for the specified key.
     * @param  {String} key Attribute Key
     * @return {String}     Attribute Value
     */
    getAttribute(key) {
        return this.attributes[key];
    }

    /**
     *   Returns an XML Node that is either a direct child, or the child of a child of a... you get the idea
     *   @param  {(String|String[])} path  The name of the child node you are searching if it is a direct child, if not,
     *   then the path to your node must be specified as an array
     *   @return {XMLNode}      "This is the child node you are searching for!"
     */
    getChild(path) {
        /** We have to descent multiple times */
        if (path instanceof Array) {
            let node = this;
            for (let name of path) {
                node = node.getChild(name);
            }

            return node;
        }
        /** We only have to descent once */
        else if (path instanceof String || typeof(path) === "string") {

            /** Append the index 0 if none is specified */
            let key = path;
            if (!/^.*\[[0-9]\]$/.test(key)) {
                key += "[0]";
            }

            return this.elements[key];
        }
        /** 'path' is something 'path' should not be... */
        else {
            throw new TypeError("'path' must be of type 'String' or 'Array (String)'");
        }
    }

    /**
     *   Returns an XML String that represents this node's data structure
     *   @param  {Object|Function}   options  Options for the output (e.g. indent, new_lines)
     *   @param  {Function} callback A callback that returns an error (if thrown) and a generated XML String
     */
    asXMLString(options, callback) {
        let json = this;

        /** Generate default options, if none are specified */
        if (options == null) {
            options = defaultOptions();
        }
        /** If 'options' is a function, then use that as our callback, and use the default options instead */
        else if (options instanceof Function) {
            callback = options;
            options = defaultOptions();
        }
        /** Fill in missing options */
        else {
            let defaults = defaultOptions();
            if (!options.hasOwnProperty("indent")) options.indent = defaults.indent;
            if (!options.hasOwnProperty("new_lines")) options.new_lines = defaults.new_lines;
            if (!options.hasOwnProperty("header")) options.header = defaults.header;
        }

        let xml = "";
        let level = 0;

        if (options.header) {
            xml = options.header;
            if (options.new_lines) xml += "\n";
        }

        /** Add this node aka our root in this case */
        addNode(json, function() {
            xml += "</" + json.name + ">" + (options.new_lines ? "\n": "");
        });

        /**
         *   The default options for formatting XML
         *   @return {Object} default options
         */
        function defaultOptions() {
            return {
                indent: 2,
                header: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
                new_lines: true
            };
        }

        /**
         *   Add a new node to our XML String
         *   @param {XMLNode}   node The node we are adding
         *   @param {Function} cb   A callback for closing our node
         */
        function addNode(node, cb) {

            /** Adding indent */
            for (let x = 0; x < level * options.indent; x++) {
                xml += " ";
            }

            xml += "<" + node.name;

            /** Adding all attributes */
            for (let key in node.attributes) {
                xml += " " + key + "=\"" + node.attributes[key] + "\"";
            }
            xml += ">";

            /** Adding the node's value (if it has one) */
            if (node.hasOwnProperty("value")) {
                xml += node.value;
            }

            /** Append a new line, if there are children following this (and if the options allow us to do so) */
            if (Object.keys(node.elements).length > 0 && options.new_lines) {
                xml += "\n";
            }

            var action = (child) => () => {
                // Adding indent if this child also has children. That makes our node a grandfather. Or a grandmother.
                if (Object.keys(node.elements[child].elements).length > 0) {
                    /** Adding indent */
                    for (let x = 0; x < level * options.indent; x++) {
                        xml += " ";
                    }
                }

                level--;

                /** Close our children's tag */
                xml += "</" + node.elements[child].name + ">" + (options.new_lines ? "\n": "");
            };

            /** Adding the node's children */
            for (let child in node.elements) {
                level++;
                addNode(node.elements[child], action(child));
            }

            /** Close our tag */
            cb();
        }

        /** We successfully generated an XML String */
        callback(null, xml);
    }

}

/** Export our class to be used when importing this module */
module.exports.XMLNode = XMLNode;
