# MadBuilder

MadBuilder is a powerful YAML-driven generator for creating consistent data entities and DTOs across multiple programming languages and frameworks.

## Features

- YAML-Based Configuration: Define your data entities and their contexts (e.g., Read-DTO, Create-DTO) in an easy-to-read YAML format.
- Multi-Language Support: Generate code for multiple programming languages (e.g., TypeScript, Python, Java).
- Customizable Outputs: Adapt templates for various use cases and frameworks.
- Synchronization: Ensure consistent entity definitions across your tech stack.

## Installation

### Prerequisites

- Node.js (>= 16.x recommended)

### Steps

Simply clone the repository. That's all you have to do. There is a shell script included in the root folder of the project whcih you can use to generate your entities. No installation via NPM required.

```bash
git clone https://github.com/MarkusDanilow/MadBuilder.git
cd MadBuilder
```

## Usage

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

To generate your entities from the YAML file, simlpy execute the shell script already mentioned above.

```bash
# general command with placeholders
./madbuilder.sh <path-to-input-file.yaml> <path-to-output-file> <language> [<library>]

# example command for typescript generating typescript files for the event
./madbuilder.sh ./example-yaml/event.yaml ../ts-test/src/models/Event.dto.ts typescript

# example command for typescript generating TypeORM entity in typescript
./madbuilder.sh ./example-yaml/event.yaml ../ts-test/src/models/Event.entity.ts typescript typeorm

```

### Example Output

The following files have been genereated using the commands from above.

```ts
/* generated DTOs for the event in TypeScript */

export interface EventRead {
  /** @format uuid */
  id: string;
  /** @minLength 5, @maxLength 48 */
  name: string;
  /** @minLength 10, @maxLength 256 */
  description?: string;
  start: Date;
  end: Date;
  /** @format email */
  responsibleEmail: string;
}

export interface EventCreate {
  /** @minLength 5, @maxLength 48 */
  name: string;
  /** @minLength 10, @maxLength 256 */
  description?: string;
  start: Date;
  end: Date;
  /** @format email */
  responsibleEmail: string;
  onlyForCreation: string;
}

export interface EventUpdate {
  /** @minLength 5, @maxLength 48 */
  name: string;
  /** @minLength 10, @maxLength 256 */
  description?: string;
  start: Date;
  end: Date;
  /** @format email */
  responsibleEmail: string;
  onlyForCreation: string;
}
```

```ts
/* generated TypeORM entity for the event */

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("eventdb")
export class EventDb {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: "varchar", length: 48 })
  name: string;
  @Column({ type: "varchar", nullable: true, length: 256 })
  description?: string;
  @Column({ type: "timestamp" })
  start: Date;
  @Column({ type: "timestamp" })
  end: Date;
  @Column({ type: "varchar" })
  responsibleEmail: string;
}
```

## Supported Languages and Libraries

| Language   | Language Command | Libraries/Frameworks | Libraries/Frameworks Command |
| ---------- | ---------------- | -------------------- | ---------------------------- |
| TypeScript | typescript, ts   | TypeORM, ZOD, Prisma | typeorm, zod, prisma         |
| Python     | python, py       |                      |                              |
| Java       | java             |                      |                              |
| C#         | csharp, cs       |                      |                              |
