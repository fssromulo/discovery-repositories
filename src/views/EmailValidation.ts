export function validateEmail(login: string): boolean {
	console.log("teste", login);
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(login) ?? false;
}
