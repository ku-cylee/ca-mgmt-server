import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import { LabDAO, SkeletonDAO } from '../../daos';
import {
    CreateSkeletonRequest,
    DeleteSkeletonRequest,
    GetSkeletonListRequest,
} from './request.dto';
import {
    ConflictError,
    NotFoundError,
    ForbiddenError,
} from '../../lib/http-errors';
import {
    CreateSkeletonResponse,
    GetSkeletonListResponse,
} from './response.dto';

export const getSkeletonList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const { labName } = new GetSkeletonListRequest(req);

    const lab = await LabDAO.getByName(labName);

    if (!lab) throw NotFoundError;
    if (requester.isStudent && lab.isOpen) throw ForbiddenError;

    const skeletons = await SkeletonDAO.getListByLab(lab.id);

    return res.send(toResponse(GetSkeletonListResponse, skeletons));
};

export const createSkeleton: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isTA) throw ForbiddenError;

    const { labName, path, content, isExecutable } = new CreateSkeletonRequest(
        req,
    );

    const lab = await LabDAO.getByName(labName);

    if (!lab) throw NotFoundError;
    if (!lab.author.is(requester)) throw ForbiddenError;
    if (lab.skeletonFiles.length) throw ConflictError;

    const skeleton = await SkeletonDAO.create(lab, path, content, isExecutable);

    return res.send(toResponse(CreateSkeletonResponse, skeleton));
};

export const deleteSkeleton: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isTA) throw ForbiddenError;

    const { labName } = new DeleteSkeletonRequest(req);

    const lab = await LabDAO.getByName(labName);
    if (!lab) throw NotFoundError;
    if (!requester.isAdmin && !lab.author.is(requester)) throw ForbiddenError;

    await SkeletonDAO.deleteListByLab(lab.id);

    return res.send();
};
