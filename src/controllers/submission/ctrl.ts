import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import {
    CreateSubmissionRequest,
    GetSubmissionListRequest,
} from './request.dto';
import {
    NotFoundError,
    ForbiddenError,
    UnprocessableError,
} from '../../lib/http-errors';
import { LabDAO, SubmissionDAO, SubmissionFileDAO, UserDAO } from '../../daos';
import { CreateSubmissionResponse } from './response.dto';
import { getChecksum } from '../../lib/checksum';

export const getSubmissionList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    const { content, authorName, labName } = new GetSubmissionListRequest(req);

    if (!requester.isAdmin && content && !authorName && !labName)
        throw ForbiddenError;

    if (requester.isStudent && requester.username !== authorName)
        throw ForbiddenError;

    const author = authorName ? await UserDAO.getByUsername(authorName) : null;
    if (authorName && !author) throw NotFoundError;

    const lab = labName
        ? await LabDAO.getByName(labName, requester.isAdmin)
        : null;
    if (labName && !lab) throw NotFoundError;
    if (lab && requester.isStudent && !lab.isOpen) throw ForbiddenError;

    const submissionFiles = await SubmissionDAO.getListByLabAndAuthor(
        author,
        lab,
        content,
    );

    return res.send(toResponse(GetSubmissionListRequest, submissionFiles));
};

export const createSubmission: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isAdmin) throw ForbiddenError;

    const { labName, fileName, content, checksum } =
        new CreateSubmissionRequest(req);

    // TODO: Consider using createdAt

    const file = await SubmissionFileDAO.getByLabAndName(
        labName,
        fileName,
        requester.isAdmin,
    );
    if (!file) throw NotFoundError;

    if (getChecksum(content) !== checksum) throw UnprocessableError;

    SubmissionDAO.deleteListByAuthorAndFile(requester, file);

    const submission = await SubmissionDAO.create(
        requester,
        file,
        content,
        checksum,
    );

    return res.send(toResponse(CreateSubmissionResponse, submission));
};
