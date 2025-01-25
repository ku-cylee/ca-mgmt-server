import { RequestHandler } from 'express';
import { toResponse } from '../../lib/dtos';
import { LabDAO } from '../../daos';
import {
    CreateLabRequest,
    DeleteLabRequest,
    GetLabRequest,
    UpdateLabRequest,
} from './request.dto';
import { NotFoundError, ForbiddenError } from '../../lib/http-errors';
import {
    CreateLabResponse,
    GetLabListResponse,
    GetLabResponse,
    UpdateLabResponse,
} from './response.dto';

export const getLabList: RequestHandler = async (req, res) => {
    const { requester } = res.locals;

    const labs = await LabDAO.getList(!requester.isStudent, requester.isAdmin);

    return res.send(toResponse(GetLabListResponse, labs));
};

export const getLab: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    const { labName } = new GetLabRequest(req);

    const lab = await LabDAO.getByName(labName, requester.isAdmin);

    if (!lab) throw NotFoundError;
    if (requester.isStudent && !lab.isOpen) throw ForbiddenError;

    return res.send(toResponse(GetLabResponse, lab));
};

export const createLab: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isTA) throw ForbiddenError;

    const { name, openAt, dueDate, closeAt } = new CreateLabRequest(req);

    const lab = await LabDAO.create(name, openAt, dueDate, closeAt, requester);

    return res.send(toResponse(CreateLabResponse, lab));
};

export const updateLab: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (!requester.isTA) throw ForbiddenError;

    const { labName, name, openAt, dueDate, closeAt } = new UpdateLabRequest(
        req,
    );

    const lab = await LabDAO.getByName(labName);
    if (!lab) throw NotFoundError;
    if (!lab.author.is(requester)) throw ForbiddenError;

    await LabDAO.updateById(lab.id, name, openAt, dueDate, closeAt);

    const updatedLab = await LabDAO.getById(lab.id);
    if (!updatedLab) throw NotFoundError;

    return res.send(toResponse(UpdateLabResponse, updatedLab));
};

export const deleteLab: RequestHandler = async (req, res) => {
    const { requester } = res.locals;
    if (requester.isStudent) throw ForbiddenError;

    const { labName } = new DeleteLabRequest(req);

    const lab = await LabDAO.getByName(labName);

    if (!lab) throw NotFoundError;

    if (!requester.isAdmin && !lab.author.is(requester)) throw ForbiddenError;

    await LabDAO.deleteById(lab.id);

    return res.send();
};
