import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import { ForbiddenError, NotFoundError } from '../../lib/http-errors';
import { CreateSubmissionFileListRequest } from './request.dto';
import { LabDAO, SubmissionFileDAO } from '../../daos';
import { CreateSubmissionFileListResponse } from './response.dto';

export const createSubmissionFileList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isTA) throw ForbiddenError;

    const { labName, names } = new CreateSubmissionFileListRequest(req);

    const lab = await LabDAO.getByName(labName);
    if (!lab) throw NotFoundError;
    if (!lab.author.is(requester)) throw ForbiddenError;

    const submissionFiles = await SubmissionFileDAO.getListByLab(lab.id, true);
    const namesToBeCreated = names.filter(
        name => !submissionFiles.find(sf => sf.name === name),
    );
    const idsToBeDeleted = submissionFiles
        .filter(sf => !names.find(name => sf.name === name) && !sf.isDeleted)
        .map(sf => sf.id);
    const idsToBeUndeleted = submissionFiles
        .filter(sf => names.find(name => sf.name === name) && sf.isDeleted)
        .map(sf => sf.id);

    await SubmissionFileDAO.createList(lab, namesToBeCreated);
    await SubmissionFileDAO.deleteListByIds(idsToBeDeleted);
    await SubmissionFileDAO.undeleteListByIds(idsToBeUndeleted);

    const updatedSubmissionFiles = await SubmissionFileDAO.getListByLab(lab.id);

    return res.send(
        toResponse(CreateSubmissionFileListResponse, updatedSubmissionFiles),
    );
};
