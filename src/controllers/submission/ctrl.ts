import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import {
    CreateSubmissionRequest,
    GetSubmissionListRequest,
} from './request.dto';
import { NotFoundError, PermissionDeniedError } from '../../lib/http-errors';
import { LabDAO, SubmissionDAO, UserDAO } from '../../daos';
import { CreateSubmissionResponse } from './response.dto';

export const getSubmissionList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    const { content, authorUsername, labName } = new GetSubmissionListRequest(
        req,
    );

    if (!requester.isAdmin && content && !authorUsername && !labName)
        throw PermissionDeniedError;

    const author = authorUsername
        ? await UserDAO.getByUsername(authorUsername)
        : null;
    const lab = labName
        ? await LabDAO.getByName(
              labName,
              !requester.isStudent,
              requester.isAdmin,
          )
        : null;

    const submissionFiles = await SubmissionDAO.getListByLabAndAuthor(
        author,
        lab,
        content,
    );

    return res.send(toResponse(GetSubmissionListRequest, submissionFiles));
};

export const createSubmission: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isAdmin) throw PermissionDeniedError;

    const { labName, filename, content } = new CreateSubmissionRequest(req);

    const lab = await LabDAO.getByName(labName, !requester.isStudent);
    if (!lab) throw NotFoundError;

    const submission = await SubmissionDAO.create(
        lab,
        requester,
        filename,
        content,
    );

    return res.send(toResponse(CreateSubmissionResponse, submission));
};
