# DB Docs

## users
* `id`: number; primary key
* `username`: string; unique
* `secretKey`: string; unique
* `role`: enum UserRole
    - Admin
    - TA
    - Student
    - Default
* `isActive`: boolean

## labs
* `id`: number; primary key
* `name`: string; unique

## lab_versions
* `id`: number; primary key
* `lab`: labs.id
* `author`: users.id
* `openAt`: Date
* `dueDate`: Date
* `closeAt`: Date
* `needsSubmission`: boolean
* `skeletonPath`: string
* `createdAt`: Date
* `isActive`: boolean

## lab_files
* `id`: number; primary key
* `lab`: labs.id
* `filename`: string

## submissions
* `id`: number; primary key
* `user`: users.id
* `file`: lab_files.id

## submission_versions
* `id`: number; primary key
* `submission`: submissions.id
* `content`: string (text)
* `createdAt`: Date

## bombs
* `id`: number; primary key
* `bombId`: string
* `user`: users.id
* `phase`: number
* `explosions`: number
* `createdAt`: Date
* `updatedAt`: Date
