# jsonschema-protobuf2

Converts [JSON Schema](http://json-schema.org/) to [Protocol Buffers](https://developers.google.com/protocol-buffers).

## Install
```
npm install -g jsonschema-protobuf
```

## Example
```
$ jsonschema-protobuf test.jsonschema
syntax = "proto3";

message Person {
  message AlterEgos {
    message City {
      optional string name = 1;
    }

    repeated City city = 1;
    optional string state = 2;
  }

  message Location {
    optional string city = 1;
    optional string state = 2;
  }

  required string name = 1;
  required int32 age = 2;
  required int32 income = 3;
  optional string universe = 4;
  optional bool living = 5;
  repeated AlterEgos alterEgos = 6;
  optional Location location = 7;
}
```

test.jsonschema
```
{
  "type": "object",
  "name": "person",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "min": 0, "max": 120 },
    "income": { "type": "number", "min": 0 },
    "universe": { "type": "string", "enum": [ "Marvel", "DC" ] },
    "living": { "type": "boolean", "default": true },
    "alterEgos": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "city": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" }
              }
            }
          },
          "state": { "type": "string", "regex": "/[A-Z]{2}/" }
        }
      }
    },
    "location": {
      "type": "object",
      "properties": {
        "city": { "type": "string" },
        "state": { "type": "string", "regex": "/[A-Z]{2}/" }
      }
    }
  },
  "required": [
    "name",
    "age",
    "income"
  ]
}
```

## JS usage

```js
var convert = require('jsonschema-protobuf')
var jsonschema = fs.readFileSync("test.jsonschema").toString()
var protobuf = convert(jsonschema)
console.log(protobuf)
```

## TODO

* Enum
