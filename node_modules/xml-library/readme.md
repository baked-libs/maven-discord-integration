# XML Library

This Library allows you to convert XML strings into the JSON Format and the other way around.

### Installing this Library

Run the following command
```
$ npm install xml-library --save
```

Then load it inside your node.js Application
```javascript
const XML = require('xml-library');
```

### XML (Extensible Markup Language)

#### Parsing XML

To interpret XML Strings as JSON Objects, you can do

```javascript
XML.parseXML(xml, function(err, json) {
    // To make sure the parser did not throw any error
    if (!err) {
        // You can now use the 'json' Object to access your XML document
    }
});
```

For help on how to use the 'json' Object, see [XMLNode](#xmlnode)

#### Parsing JSON

You can also interpret JSON objects back into XML.<br>
BUT: This JSON object must be an [XMLNode](#xmlnode) Object (more Info down below)

'options' (if specified) is a simple JSON Object with keys and values. (Missing keys will be inserted with a default value)
```javascript
json.asXMLString(options, function(err, xml) {
    // To make sure the parser did not throw any error
    if (!err) {
        // You can now use the 'xml' Object (It is a String)
    }
});
```

<center>

|Key|Description|Default Value|
|:--:|:-----------:|:----------:|
|indent|Number of spaces prepended on each new level|2|
|new_lines|Whether new lines shall be used. Set it to false if you want the entire XML string to be on a single line|true|
|header|A header that is prepended to the entire xml string (e.g. <!DOCTYPE HTML> when you are messing with HTML documents or other important document settings)|&lt;?xml version="1.0" encoding="UTF-8"?&gt;|
</center>
You can of course just leave out the options.
And it will use the default values.

```javascript
json.asXMLString(function(err, xml) {
    // To make sure the parser did not throw any error
    if (!err) {
        // You can now use the 'xml' Object (It is a String)
    }
});
```

#### XMLNode

This module adds a class called "XMLNode".<br>
The JSON Object returned when [Parsing XML](#parsing-xml) is an instance of this class.<br>
[Parsing JSON Objects](#parsing-json) also requires an instance of this class.

You can use the class in your node.js Application using

```javascript
const XML = require('xml-library');
const XMLNode = XML.XMLNode;
```

Or by direct deconstruction of the module.

```javascript
const {XMLNode} = require('xml-library');
```

##### Constructor

The constructor requires you to specify a Name for the element.

```javascript
new XMLNode(name);
new XMLNode("project");
```
```html
<project></project>
```

You can also specify attributes.

```javascript
new XMLNode(name, attributes);
new XMLNode("project", {
    "version": "2.3.1",
    "author": "TheBusyBiscuit"
});
```
```html
<project version="2.3.1" author="TheBusyBiscuit"></project>
```

Or you can specify a value.

```javascript
new XMLNode(name, value);
new XMLNode("project", "XML-Library");
```
```html
<project>XML-Library</project>
```

Or a value and attributes.

```javascript
new XMLNode(name, attributes, value);
new XMLNode("project", {
    "version": "2.3.1",
    "author": "TheBusyBiscuit"
}, "XML-Library");
```
```html
<project version="2.3.1" author="TheBusyBiscuit">XML-Library</project>
```

#### Methods

For the following examples, we work with this node as our root.

```javascript
var node new XMLNode("project", {
    "version": "2.3.1",
    "author": "TheBusyBiscuit"
});
```
```html
<project version="2.3.1" author="TheBusyBiscuit"></project>
```

##### .addChild(node)

The specified child, must be an instance of [XMLNode](#xmlnode) of course.<br>
But it can also be an array of [XMLNode](#xmlnode) instances.

```javascript
node.addChild(new XMLNode("language", "JavaScript"));
```
```html
<project version="2.3.1" author="TheBusyBiscuit">
  <language>JavaScript</language>
</project>
```

##### .setChild(key, node)

The specified child, must be an instance of [XMLNode](#xmlnode) of course.
Because XML elements can have multiple children with the same name, each child needs to have an index. (e.g. language[0])<br>
This index will be omitted in the actual XML String when [Parsing JSON Objects](#parsing-json)<br>
If no index is specified, "[0]" will be appended to the name.

```javascript
node.setChild("language", new XMLNode("language", "JavaScript"));
node.setChild("language[1]", new XMLNode("language", "C#"));
node.setChild("language[0]", new XMLNode("language", "Java"));
```
```html
<project version="2.3.1" author="TheBusyBiscuit">
  <language>Java</language>
  <language>C#</language>
</project>
```

##### .setAttribute(key, value)

Pretty self-explaining.<br>
Specify a key (String) and a value (String) and set this as an attribute.

```javascript
node.setAttribute("version", "ALPHA");
```
```html
<project version="ALPHA" author="TheBusyBiscuit"></project>
```

If 'value' is null and an attribute with that name exists, then the attribute is removed.

```javascript
node.setAttribute("version", null);
```
```html
<project author="TheBusyBiscuit"></project>
```

##### .setValue(value)

Pretty self-explaining.<br>
Specify a value (String) and you set the inner content of your node.<br>
Specify no value and you will remove the inner content of your node (This does not remove any children)

```javascript
node.setValue("XML-Library");
```
```html
<project version="2.3.1" author="TheBusyBiscuit">XML-Library</project>
```

##### .getChild(path)

Specify the name of a child to get its instance.

```html
<project version="2.3.1" author="TheBusyBiscuit">
  <language>
    <name>Java</name>
  </language>

  <language>C#</language>
</project>
```

The name can include an index, if there are multiple children sharing the same name.

```javascript
node.getChild("language[1]");
```
```html
<language>C#</language>
```

If no index is specified, it is going to return the first child with that name.

```javascript
node.getChild("language");
```
```html
<language>
  <name>Java</name>
</language>
```

But you can also specify an array of names, to get the node's grandchildren or great grandchildren or ... (You get the idea.)

```javascript
node.getChild(["language", "name"]);
```
```html
<name>Java</name>
```

Here, you can specify an index to target a certain child at a certain point in the tree again.

##### .asXMLString(options, callback)

See [Parsing JSON Objects](#parsing-json)

## Copyright / Licensing

>Copyright (c) 2018 TheBusyBiscuit
><br>
>Licensed under the MIT License.
