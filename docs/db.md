# DB Docs

## users
* `id`: number; primary key
* `name`: string
* `username`: string; unique
* `secretKey`: string
* `role`: enum UserRole; default None
    - Admin
    - TA
    - Student
    - None
* `createdAt`: Date (timestamp)
* `updatedAt`: Date (timestamp)
* `isActive`: boolean; default true

## labs
* `id`: number; primary key
* `name`: string; unique
* `openAt`: Date (timestamp)
* `dueDate`: Date (timestamp)
* `closeAt`: Date (timestamp)
* `needsSubmission`: boolean
* `createdAt`: Date (timestamp)
* `updatedAt`: Date (timestamp)
* `isDeleted`: boolean; default false

## skeleton_files
* `id`: number; primary key
* `lab`: labs.id
* `path`: string
* `content`: string (text)
* `isExecutable`: boolean
* `createdAt`: Date (timestamp)

## submission_filenames
* `id`: number; primary key
* `lab`: labs.id
* `filename`: string
* `createdAt`: Date (timestamp)
* `updatedAt`: Date (timestamp)
* `isDeleted`: boolean

## lab_logs
* `id`: number; primary key
* `lab`: labs.id
* `author`: users.id
* `action`: enum LabLogAction
    - Create
    - Update
    - Delete
* `category`: enum LabLogCategory
    - Lab
    - Skeleton
    - Filename
* `content`: string (long text); default `''`
* `createdAt`: Date (timestamp)

## submissions
* `id`: number; primary key
* `user`: users.id
* `filename`: submission_filenames.id
* `content`: string (text)
* `createdAt`: Date (timestamp)
* `updatedAt`: Date (timestamp)

## bombs
* `id`: number; primary key
* `name`: string
* `user`: users.id
* `phase`: number
* `explosions`: number
* `createdAt`: Date (timestamp)
* `updatedAt`: Date (timestamp)
