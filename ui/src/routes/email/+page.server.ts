import { RecoverPassword } from '$lib/server/email/templates';
import Emailer from '@uraniadev/emailer';

export const load = async () => {
	const emailer = new Emailer();
	const template = RecoverPassword();
	const html = emailer.render(template.template, {
		expiresIn: '15 minutes',
		recoverURL: 'http://localhost:5173/auth/recover',
		resetURL: 'http://localhost:5173/auth/recover?token=oojp23adm6p6kz63witabcieivii4zynwi2rwqjhzb2cd63ohqbbaojp23adm6p6kz63witabcieivii4zynwi2rwqjhzb2cd63ohqbbajp23adm6p6kz63witabcieivii4zynwi2rwqjhzb2cd63ohqbba',
	});
	return {
		html: html
	};
};
