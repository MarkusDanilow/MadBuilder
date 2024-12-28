# MadEntitySync

Welcome to **MadEntitySync** – the ultimate YAML-driven generator for creating consistent data entities and DTOs across multiple programming languages and frameworks! Imagine effortlessly generating clean, maintainable code for various languages and frameworks without spending hours writing boilerplate code. That's exactly what MadEntitySync offers!

**Please note:** This is a hobby project and does not claim to be complete or fully comprehensive. Contributions and feedback are always welcome!

## Why MadEntitySync?

In today's fast-paced development world, time is a precious commodity. MadEntitySync helps you save this valuable resource by automating the tedious and error-prone task of code generation. Whether you're working with TypeScript, Python, Java, or other languages – MadEntitySync has the tools to take your productivity to the next level.

### Features

- **YAML-Based Configuration**: Define your data entities and their contexts (e.g., Read-DTO, Create-DTO) in an easy-to-read YAML format.
- **Multi-Language Support**: Generate code for multiple programming languages (e.g., TypeScript, Python, Java).
- **Customizable Outputs**: Adapt templates for various use cases and frameworks.
- **Synchronization**: Ensure consistent entity definitions across your tech stack.

Get ready to revolutionize your development processes and discover the power of automated code generation with MadEntitySync. Start today and experience how simple and efficient software development can be!

## Installation

### Prerequisites

- Node.js (>= 16.x recommended)

### Steps

Simply clone the repository and install the required packages using NPM.

```bash
git clone https://github.com/MarkusDanilow/MadEntitySync.git
cd MadEntitySync
npm install
```

## Usage

MadEntitySync is designed to be easy to use. Follow these steps to get started:

1. **Define Your Entities**: Create a YAML file to define your data entities and their contexts.
2. **Generate Code**: Run the MadEntitySync command to generate code for your desired programming language and framework.
3. **Integrate**: Integrate the generated code into your project.

### Example Input

First of all you need to define your entity using a YAML file. Example files for entity definitions can be found in subfolder `example-yaml`.

```yaml
# Example entity definition for an event
Event:
  # all possible contexts this entity can occur in.
  # The "db" context is a fixed keyword for generating the database entity.
  contexts: ["db", "read", "create", "update"]

  # next we define the all possible fields for the entity.
  # each field needs to have a name, a type, and whether it's required.
  # optionally you can define a format, min and max length for strings, min and max value for numbers, and a set of contexts the field should be included.
  # If no context is defined, the field will be included in all generated entity files.
  fields:
    - name: "id"
      type: "string"
      format: "uuid"
      required: true
      contexts: ["read", "db"]
    - name: "name"
      type: "string"
      required: true
      minLength: 5
      maxLength: 48
    - name: "description"
      type: "string"
      required: false
      minLength: 10
      maxLength: 256
    - name: "start"
      type: "date"
      required: true
    - name: "end"
      type: "date"
      required: true
    - name: "responsibleEmail"
      type: "string"
      format: "email"
      required: true
    # this field will only be used for creation und update entity, but not in the database entity.
    - name: "onlyForCreation"
      type: "string"
      required: true
      contexts: ["create", "update"]
```

To generate your entities from the YAML file, simlpy execute the shell script that is included in the root folder of the project.

```bash
# general command with placeholders
./MadEntitySync.sh <path-to-input-file.yaml> <path-to-output-file> <language> [<library>]

# example command for typescript generating typescript files for the event
./MadEntitySync.sh ./example-yaml/event.yaml ../ts-test/src/models/Event.dto.ts typescript

# example command for typescript generating TypeORM entity in typescript
./MadEntitySync.sh ./example-yaml/event.yaml ../ts-test/src/models/Event.entity.ts typescript typeorm

```

## Integration

After generating the code, you can integrate it into your project. For example, if you generated TypeScript code for a TypeORM entity, you can use it as follows:

```ts
import { Event } from "./path/to/generated/Event";

const event = new Event();
event.name = "Sample Event";
event.start = new Date();
event.end = new Date();
event.responsibleEmail = "example@example.com";
```

## Error Handling

If you encounter any errors, please refer to the following common issues and solutions:

- Error: "Cannot find module": Ensure that you have installed all required dependencies.
- Error: "Invalid YAML format": Check your YAML file for syntax errors.

## Supported Languages and Libraries

| Language   | Language Command | Libraries/Frameworks | Libraries/Frameworks Command |
| ---------- | ---------------- | -------------------- | ---------------------------- |
| TypeScript | typescript, ts   | TypeORM, ZOD, Prisma | typeorm, zod, prisma         |
| JavaScript | javascript, js   |                      |                              |
| Python     | python, py       |                      |                              |
| Java       | java             |                      |                              |
| C#         | csharp, cs       |                      |                              |
| PHP        | php              |                      |                              |

## Contributing

We welcome contributions from the community! If you'd like to contribute, please fork the repository and submit a pull request. Here are some ways you can contribute:

- Add new language support: Implement generators for additional programming languages.
- Improve documentation: Help us improve the documentation with more examples and use cases.
- Report issues: If you find any bugs or have suggestions for improvements, please open an issue on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
