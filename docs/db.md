# DB Docs

## Commons
* `timestamp` type indicates unix-time in milliseconds.

## users
* `id`: number; primary key
* `username`: string; unique
* `secretKey`: string; maxlength 64
* `role`: enum UserRole
    - Admin
    - TA
    - Student
* `createdAt`: timestamp
* `updatedAt`: timestamp
* `deletedAt`: timestamp | null

## labs
* `id`: number; primary key
* `name`: string
    - unique
    - maxlength: 32
* `openAt`: timestamp
* `dueDate`: timestamp
* `closeAt`: timestamp
* `submissionFiles`: [string]
* `author`: number; users.id
* `createdAt`: timestamp
* `updatedAt`: timestamp
* `deletedAt`: timestamp | null

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
* `filename`: string
* `content`: string (text)
* `checksum`: string; maxlength: 16
* `createdAt`: timestamp
* `updatedAt`: timestamp

## bombs
* `id`: string; primary key
* `longId`: string; unique
* `lab`: number; labs.id
* `author`: number; users.id
* `phase1_answer`: string
* `phase2_answer`: string
* `phase3_answer`: string
* `phase4_answer`: string
* `phase5_answer`: string
* `phase6_answer`: string
* `createdAt`: timestamp

## defuses
* `id`: number; primary key
* `bomb`: number; bombs.id
* `phase`: number
* `answer`: string
* `exploded`: boolean
* `createdAt`: timestamp
