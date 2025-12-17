import { removeFollower, setFollowerStatus } from '$lib/server/followers/followers';
import { FollowStatus } from '$lib/types/followers';
import type { UUID } from 'crypto';
import type { RequestHandler, RouteParams } from './$types';
import { error, isHttpError, json, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { m } from '$lib/paraglide/messages.js';

async function updateFollowerStatus(locals: App.Locals, params: RouteParams): Promise<Response> {
	if (!locals.user) {
		error(StatusCodes.UNAUTHORIZED, m.user_not_logged_in());
	}

	const userUUID = locals.user.uuid
	const followerUserUUID = params.follower_user_uuid

	try {
		switch (params.action) {
			case 'approve':
				await setFollowerStatus(userUUID as UUID, followerUserUUID as UUID, FollowStatus.APPROVED)
				break
			case 'deny':
				await setFollowerStatus(userUUID as UUID, followerUserUUID as UUID, FollowStatus.DENIED)
				break
			case 'ban':
				await removeFollower(userUUID as UUID, followerUserUUID as UUID)
				break
			default:
				error(StatusCodes.NOT_FOUND)
		}
		return json({ success: true })
	} catch (err) {
		error(StatusCodes.INTERNAL_SERVER_ERROR, m.failed_to_answer_follow_request({ action: m.approve().toLowerCase() }));
	}
}

export const GET: RequestHandler = async ({ request, locals, params, url }) => {
	// Allow GET only if user is navigating to this route, otherwise PUT
	if (request.headers.get('Sec-Fetch-Mode') !== 'navigate') {
		error(StatusCodes.METHOD_NOT_ALLOWED)
	}

	try {
		await updateFollowerStatus(locals, params)
	} catch (e) {
		if (isHttpError(e) && e.status === StatusCodes.UNAUTHORIZED) {
			redirect(StatusCodes.MOVED_TEMPORARILY, `/auth?follow=${encodeURIComponent(url.toString())}`)
		}
		throw e
	}
	redirect(StatusCodes.SEE_OTHER, url.searchParams.get('follow') ?? '/manage-access')
}

export const PUT: RequestHandler = async ({ locals, params }) => {
	return updateFollowerStatus(locals, params)
};
