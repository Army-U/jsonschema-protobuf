var protobuf = require('protocol-buffers-schema')
var mappings = {
  'array': 'repeated',
  'object': 'message',
  'integer': 'int32',
  'number': 'int32',
  'string': 'string',
  'boolean': 'bool'
}

module.exports = function (schema) {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  var result = {
    syntax: 3,
    package: null,
    enums: [],
    messages: []
  }

  if (schema.type === 'object') {
    result.messages.push(Message(schema))
  }
  return protobuf.stringify(result)
}

function formatMessageName (name) {
  return name.replace(/(^\w)|_(\w)|-(\w)/g, (str, p1, p2, p3) => (p1 || p2 || p3).toUpperCase())
}

function Message (schema) {
  var message = {
    name: formatMessageName(schema.name),
    enums: [],
    messages: [],
    fields: []
  }

  var tag = 1
  for (var key in schema.properties) {
    var field = Object.assign({}, schema.properties[key], { name: key })
    var isMessageType = ['object', 'array'].includes(field.type)
    var _message = isMessageType && Message(field)

    if (field.type === 'object') {
      message.messages.push(Message(field))
    }
    
    if (field.type === 'array') {
      var patch = {
        name: key,
        ...field.items
      }
      message.messages.push(Message(patch))
    }

    const _field = Field(field, tag)

    if (isMessageType) {
      Object.assign(_field, { type: _message.name })
    }

    message.fields.push(_field)
    tag += 1
  }

  for (var i in schema.required) {
    var required = schema.required[i]
    for (var i in message.fields) {
      var field = message.fields[i]
      if (required === field.name) field.required = true
    }
  }

  return message
}

function Field (field, tag) {
  var type = mappings[field.type] || field.type
  var repeated = false

  if (field.type === 'array') {
    repeated = true
    type = field.items.type
  }

  return {
    name: field.name,
    type: type,
    tag: tag,
    repeated: repeated
  }
}
