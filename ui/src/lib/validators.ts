export function validateEmail(email: unknown): email is string {
	return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

export function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 8;
}

