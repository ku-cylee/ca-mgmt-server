# DB Docs

## Commons
* `timestamp` type indicates unix-time in milliseconds.

## users
* `id`: number; primary key
* `username`: string
    - unique
    - maxlength: 16
    - Small alphabets, numbers, hyphens only
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
    - Small alphabets, numbers, hyphens only
* `openAt`: timestamp
* `dueDate`: timestamp
* `closeAt`: timestamp
* `author`: number; users.id
* `createdAt`: timestamp
* `updatedAt`: timestamp
* `deletedAt`: timestamp

## skeleton_files
* `id`: number; primary key
* `lab`: number; labs.id
* `path`: string; maxlength: 128
* `content`: string (text)
* `checksum`: string; maxlength: 16
* `isExecutable`: boolean
* `createdAt`: timestamp
* `deletedAt`: timestamp

## submission_files
* `id`: number; primary key
* `name`: string; maxlength: 32
* `lab`: number; labs.id
* `createdAt`: timestamp
* `deletedAt`: timestamp

## submissions
* `id`: number; primary key
* `author`: number; users.id
* `file`: number; submission_files.id
* `content`: string (text)
* `checksum`: string; maxlength: 16
* `createdAt`: timestamp

## bombs
* `id`: string; primary key
* `longId`: string; unique
* `lab`: number; labs.id
* `author`: number; users.id
* `answerPhase1`: string
* `answerPhase2`: string
* `answerPhase3`: string
* `answerPhase4`: string
* `answerPhase5`: string
* `answerPhase6`: string
* `createdAt`: timestamp

## defuses
* `id`: number; primary key
* `bomb`: number; bombs.id
* `phase`: number
* `answer`: string
* `exploded`: boolean
* `createdAt`: timestamp
