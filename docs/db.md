# DB Docs

## users
* `id`: number; primary key
* `username`: string; unique
* `secretKey`: string; unique
* `role`
    - `0`: admin
    - `1`: TA
    - `2`: student
    - `3`: etcetera

## labs
* `id`: number; primary key
* `name`: string; unique
* `openAt`: Date
* `dueDate`: Date
* `closeAt`: Date
* `needsSubmission`: boolean
* `skeletonPath`: string

## lab_files
* `id`: number; primary key
* `lab`: lab.id
* `fileName`: string

## lab_submissions
* `id`: number; primary key
* `user`: users.id
* `lab`: labs.id
* `fileName`: string
* `submittedAt`: Date
* `content`: text

## bomblab_history
* `id`: number; primary key
* `bombId`: string
* `user`: users.id
* `phase`: number
* `explosions`: number
* `updatedAt`: Date
