import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import { LabDAO, SkeletonDAO } from '../../daos';
import {
    CreateSkeletonRequest,
    DeleteSkeletonListRequest,
    GetSkeletonListRequest,
} from './request.dto';
import {
    NotFoundError,
    ForbiddenError,
    UnprocessableError,
} from '../../lib/http-errors';
import {
    CreateSkeletonResponse,
    GetSkeletonListResponse,
} from './response.dto';
import { getChecksum } from '../../lib/checksum';

export const getSkeletonList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const { labName } = new GetSkeletonListRequest(req);

    const lab = await LabDAO.getByName(labName, requester.isAdmin);

    if (!lab) throw NotFoundError;
    if (requester.isStudent && !lab.isOpen) throw ForbiddenError;

    const skeletons = await SkeletonDAO.getListByLab(lab.id, requester.isAdmin);

    return res.send(toResponse(GetSkeletonListResponse, skeletons));
};

export const createSkeleton: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isTA) throw ForbiddenError;

    const { labName, path, content, checksum, isExecutable } =
        new CreateSkeletonRequest(req);

    if (getChecksum(content) !== checksum) throw UnprocessableError;

    const lab = await LabDAO.getByName(labName);

    if (!lab) throw NotFoundError;
    if (!lab.author.is(requester)) throw ForbiddenError;

    const skeleton = await SkeletonDAO.create(lab, path, content, isExecutable);

    return res.send(toResponse(CreateSkeletonResponse, skeleton));
};

export const deleteSkeletonList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isStudent) throw ForbiddenError;

    const { labName } = new DeleteSkeletonListRequest(req);

    const lab = await LabDAO.getByName(labName, requester.isAdmin);
    if (!lab) throw NotFoundError;
    if (!requester.isAdmin && !lab.author.is(requester)) throw ForbiddenError;

    await SkeletonDAO.deleteListByLab(lab.id);

    return res.send();
};
