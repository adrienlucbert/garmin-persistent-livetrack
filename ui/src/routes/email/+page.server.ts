import { AskVerifyEmail } from '$lib/server/email/templates';
import Emailer from '@uraniadev/emailer';

export const load = async () => {
	const emailer = new Emailer();
	const template = AskVerifyEmail();
	const html = emailer.render(template.template, {
		email: 'demo@demo.dev',
		callbackURL: 'http://localhost:5173/auth/verify?token=oojp23adm6p6kz63witabcieivii4zynwi2rwqjhzb2cd63ohqbbaojp23adm6p6kz63witabcieivii4zynwi2rwqjhzb2cd63ohqbbajp23adm6p6kz63witabcieivii4zynwi2rwqjhzb2cd63ohqbba',
	});
	return {
		html: html
	};
};
