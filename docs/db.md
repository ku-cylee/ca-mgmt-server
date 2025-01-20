# DB Docs

## Commons
* `timestamp` type indicates unix-time in milliseconds.

## users
* `id`: number; primary key
* `username`: string
    - unique
    - maxlength: 16
    - Small alphabets, numbers, hyphes only
* `secretKey`: string; maxlength 64
* `role`: enum UserRole
    - Admin
    - TA
    - Student
* `createdAt`: timestamp
* `updatedAt`: timestamp
* `deletedAt`: timestamp

## labs
* `id`: number; primary key
* `name`: string
    - unique
    - maxlength: 32
    - Small alphabets, numbers, hyphes only
* `openAt`: timestamp
* `dueDate`: timestamp
* `closeAt`: timestamp
* `submissionFiles`: [string]
* `author`: number; users.id
* `createdAt`: timestamp
* `updatedAt`: timestamp
* `deletedAt`: timestamp

## skeleton_files
* `id`: number; primary key
* `lab`: number; labs.id
* `path`: string
* `content`: string (text)
* `checksum`: string; maxlength: 16
* `isExecutable`: boolean
* `createdAt`: timestamp

## submissions
* `id`: number; primary key
* `lab`: number; labs.id
* `author`: number; users.id
* `filename`: string; maxlength: 256
* `content`: string (text)
* `checksum`: string; maxlength: 16
* `createdAt`: timestamp
* `updatedAt`: timestamp

## bombs
* `id`: string; primary key
* `longId`: string; unique
* `lab`: number; labs.id
* `author`: number; users.id
* `phase1Answer`: string
* `phase2Answer`: string
* `phase3Answer`: string
* `phase4Answer`: string
* `phase5Answer`: string
* `phase6Answer`: string
* `createdAt`: timestamp

## defuses
* `id`: number; primary key
* `bomb`: number; bombs.id
* `phase`: number
* `answer`: string
* `exploded`: boolean
* `createdAt`: timestamp
