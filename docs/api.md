# API Docs

## Commons
* All requests should contain
```
{
    cookies: {
        username: string | null,
        secretKey: string | null,
    },
}
```
* Response
    - 401
        + Cookie values are not given.
        + Requester does not exist.
        + Requester is deleted.

## Users

### GET /user
* Gets list of users.
* Request
```
{
    query: {
        ta: boolean,
        student: boolean,
        deleted = false,
    },
}
```
* Response
    - 200
    ```
    [{
        id: number,
        username: string,
        role: 'ta' | 'student',
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: timestamp,
    }]
    ```
    - 403
        + Requester is student.
        + Requester is TA and `deleted` is `true`.

### POST /user
* Creates multiple users.
* Request
```
{
    body: {
        role: 'ta' | 'student',
        usersData: [{
            username: string,
            secretKey: string,
        }],
    },
}
```
* Response
    - 200
    - 403
        + Requester is not admin.
    - 409
        + Some usernames already exist.

### DELETE /user/:userId
* Deletes users `userId`.
* Request
```
{
    params: {
        userId: string,
    },
}
```
* Response
    - 200
    - 403
        + Requester is not admin.
        + User `userId` is admin.
    - 404
        + User `userId` does not exist.
        + User `userId` is already deleted.

## Lab

### GET /lab
* Gets the brief list of the labs.
* Request: `{}`
* Response
    - 200
    ```
    [{
        id: number,
        name: string,
        openAt: timestamp,
        dueDate: timestamp,
        closeAt: timestamp,
        author: {
            username: string,
        },
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: timestamp,
        submissionFiles: [{
            id: number,
            name: string,
            createdAt: timestamp,
        }],
    }]
    ```
    + Student requester receives undeleted, open labs.
    + TA requester receives undeleted labs.
    + Admin requesters receive all labs.

### GET /lab/:labName
* Gets the detailed data of the lab `labName`.
* Request
```
{
    params: {
        labName: string,
    },
}
```
* Response
    - 200
    ```
    {
        id: number,
        name: string,
        openAt: timestamp,
        dueDate: timestamp,
        closeAt: timestamp,
        author: {
            username: string,
        },
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: timestamp,
        skeletonFiles: [{
            id: number,
            path: string,
            createdAt: timestamp,
        }],
        submissionFiles: [{
            id: number,
            name: string,
            createdAt: timestamp,
        }],
    }
    ```
    - 403
        + Requester is student and the lab `labName` is not yet open.
    - 404
        + Lab `labName` does not exist.
        + Requester is not admin and the lab `labName` is deleted.

### POST /lab
* Creates a lab from the request.
* Request
```
{
    body: {
        name: string,
        openAt: number,
        dueDate: number,
        closeAt: number,
    },
}
```
* Response
    - 200
    ```
    {
        id: number,
        name: string,
        openAt: number,
        dueDate: number,
        closeAt: number,
        createdAt: number,
        updatedAt: number,
        deletedAt: number,
    }
    ```
    - 400
        + `body.name` exceeds max length.
        + `openAt < dueDate <= closeAt` is not satisfied.
    - 403
        + Requester is not TA.
    - 409
        + Lab named `body.name` already exists.

### PUT /lab/:labName
* Updates the lab `labName` from the request.
* Request
```
{
    params: {
        labName: string,
    },
    body: {
        name: string,
        openAt: number,
        dueDate: number,
        closeAt: number,
    },
}
```
* Response
    - 200
    ```
    {
        id: number,
        name: string,
        openAt: number,
        dueDate: number,
        closeAt: number,
        createdAt: number,
        updatedAt: number,
        deletedAt: number,
    }
    ```
    - 400
        + `body.name` exceeds max length.
        + `openAt < dueDate <= closeAt` is not satisfied.
    - 403
        + Requester is not TA.
        + Requester is not the author of the lab `labName`.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted.
    - 409
        + Lab named `body.name` already exists.

### DELETE /lab/:labName
* Deletes the lab `labName`.
* Request
```
{
    params: {
        labName: string,
    },
}
```
* Response
    - 200
    - 403
        + Requester is student.
        + Requester is neither admin nor the author of the lab `labName`.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is already deleted.

## Skeleton

### GET /skeleton
* Gets the detailed list of skeleton files of lab `labName`.
* Request
```
{
    query: {
        labName: string,
    },
}
```
* Response
    - 200
    ```
    [{
        id: number,
        path: string,
        content: string,
        checksum: string,
        isExecutable: boolean,
        createdAt: timestamp,
        deletedAt: timestamp,
    }]
    ```
    - 403
        + Requester is student and lab `labName` is not yet open.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted.

### POST /skeleton
* Creates the skeleton file of `labName`.
* Request
```
{
    query: {
        labName: string,
    },
    body: {
        path: string,
        content: string,
        checksum: string,
        isExecutable: boolean,
    },
}
```
* Response
    - 200
    ```
    {
        id: number,
        path: string,
        checksum: string,
        isExecutable: boolean,
        createdAt: timestamp,
        deletedAt: timestamp,
    }
    ```
    - 403
        + Requester is not TA.
        + Requester is not an author of lab `labName`.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted.
    - 409
        + Undeleted skeleton file of path `path` on lab `labName` already exists.
    - 422
        + Checksum mismatch.

### DELETE /skeleton
* Deletes the skeleton files of lab `labName`.
* Request
```
{
    query: {
        labName: string,
    },
}
```
* Response
    - 200
    - 403
        + Requester is student.
        + Requester is neither admin nor the author of the lab `labName`.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted and the requester is ta.

## Submission Files

### POST /submission_file
* Deletes the submission files of `labName`, then creates the submission files of `labName`.
* Request
```
{
    query: {
        labName: string,
    },
    body: {
        filenames: [string],
    },
}
```
* Response
    - 200
    ```
    [{
        id: number,
        name: string,
        createdAt: timestamp,
    }]
    ```
    - 403
        + Requester is not TA.
        + Requester is not an author of lab `labName`.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted.

## Submission

### GET /submission
* Gets the list of submissions.
* Request
```
{
    query: {
        content: boolean,
        author: string | undefined,
        labName: string | undefined,
    },
}
```
* Response
    - 200
        + `content` is `true`
        ```
        [{
            id: number,
            author: {
                username: string,
            },
            file: {
                name: string,
                lab: {
                    id: number,
                    name: string,
                },
            },
            content: string,
            checksum: string,
            createdAt: string,
        }]
        ```
        + `content` is `false`
        ```
        [{
            id: number,
            author: {
                username: string,
            },
            file: {
                name: string,
                lab: {
                    id: number,
                    name: string,
                },
            },
            createdAt: string,
        }]
        ```
        + If `author` or `labName` is invalid, the respond is an empty array.
        + Invalid `author`: User `author` does not exist or is deleted. Requester is student and the user `author` is not the requester.
        + Invalid `labName`: Lab `labName` does not exist or is deleted. Requester is student and the lab `labName` is not yet open.
    - 403
        + Requester is not admin and `content` is `true` and `author`, `labName` are both `undefined`.

### POST /submission
* Creates the submission of `labName`.
* Request
```
{
    query: {
        labName: string,
        fileName: string,
    },
    body: {
        content: string,
        checksum: string,
        createdAt: timestamp,
    },
}
```
* Response
    - 200
    ```
    {
        id: string,
        checksum: string,
    }
    ```
    - 403
        + Requester is admin.
        + Requester is student and lab `labName` is not yet open.
        + Requester is student and lab `labName` is closed.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted.
        + Submission file `fileName` on the lab `labName` does not exist.
        + Submission file `fileName` on the lab `labName` is deleted.
    - 422
        + Checksum mismatch.

## Bomb

### GET /bomb
* Gets the list of bombs with defuse trial data.
* Request
```
{
    query: {
        labName: number | undefined,
        author: string | undefined,
    },
}
```
* Response
    - 200
        + Requester is student
        ```
        [{
            id: number,
            createdAt: timestamp,
            defuses: {
                phase: number,
                explosions: number,
            },
        }]
        ```
        + Requester is not student
        ```
        [{
            id: number,
            author: {
                username: string,
            },
            createdAt: timestamp,
            defuses: {
                phase: number,
                explosions: number,
            },
        }]
        ```
        + If requester is student and `author` is not requester, response is an empty array.

### POST /bomb
* Creates a bomb for the requester, and responds its `longId` for download.
* Request
```
{
    query: {
        labName: string,
    },
}
```
* Response
    - 200
    ```
    {
        longId: string,
        createdAt: string,
    }
    ```
    - 403
        + Requester is admin.
        + Lab `labName` is not yet open.
        + Lab `labName` is closed.
    - 404
        + Lab `labName` does not exist.
        + Lab `labName` is deleted.

## Defuse Trials

### GET /defuse
* Gets list of defuse trials of bomb `bombId`.
* Request
```
{
    query: {
        bombId: string,
    },
}
```
* Response
    - 200
    ```
    [{
        id: number,
        bomb: {
            id: string,
            author: {
                username: string,
            }
        },
        phase: number,
        answer: string,
        exploded: boolean,
        createdAt: timestamp,
    }]
    ```
    - 403
        + Requester is student and the requester is not author of the bomb `bombId`.
        + The lab of the bomb `bombId` is not yet open or closed.
    - 404
        + Bomb `bombId` does not exist.
        + The lab of the bomb `bombId` does not exist or is deleted.

### POST /defuse
* Request
```
{
    bombId: string,
    phase: number,
    answer: string,
}
```
* Response
    - 200
    ```
    {
        exploded: boolean,
    }
    ```
    - 400
        + `phase` value is not an integer in [1, 5].
    - 403
        + Requester is not the author of bomb `bombId`.
        + The lab of the bomb `bombId` is not yet open or closed.
    - 404
        + Bomb `bombId` does not exist.
        + The lab of the bomb `bombId` does not exist or is deleted.
