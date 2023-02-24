<template>
	<div class="signInComponent">
		<!-- RETIRAR DEPOIS -->
		<h1>Sign in form</h1>
		<form @submit.prevent="submitForm">
			<div class="form-control" :class="{ invalid: !username.isValid }">
				<label for="username-input">Username</label>
				<input type="text" v-model.trim="username.val" id="username-input" @blur="clearValidity('username')"
					placeholder="Username" />
				<p v-if="!username.isValid && !formIsValid">UserName must have a valid value!</p>
			</div>
			<div class="form-control" :class="{ invalid: !password.isValid }">
				<label for="password-input">Password</label>
				<input type="password" v-model.trim="password.val" id="password-input" @blur="clearValidity('password')"
					placeholder="Password" />
				<p v-if="!password.isValid && !formIsValid">Password must have 6 or more characters!</p>
			</div>
			<div class="form-control">
				<button type="submit"> Sign in </button>
			</div>
			<p>
				Don't have an account? <RouterLink to="/signup">Click here to sign up</RouterLink>
			</p>
			<hr />
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	props: {
		content: { type: String, required: true, default: '' },
		shouldShowFilters: { type: Boolean, required: false, default: false },
	},

	setup() {
		const username: Ref<{ val: string, isValid: boolean }> = ref({ val: '', isValid: true });
		const password: Ref<{ val: string, isValid: boolean }> = ref({ val: '', isValid: true });
		const formIsValid: Ref<boolean> = ref(true);
		const router = useRouter();

		function validateForm() {
			formIsValid.value = true;
			if (username.value.val.length === 0) {
				username.value.isValid = false;
				formIsValid.value = false;
			}

			if (password.value.val.length < 6) {
				password.value.isValid = false;
				formIsValid.value = false;
			}

		}

		const clearValidity = (input: string): void => {
			eval(input).value.isValid = true;
		}

		const emailFromUserName = async (): Promise<string> => {
			const response = await fetch(`https://discovery-repositories-default-rtdb.firebaseio.com/users.json?orderBy="username"&equalTo="${username.value.val}"`);
			const responseData = await response.json() as { [key: string]: { email: string } };
			if (!response.ok) {
				console.error("Failed to login!", responseData);
				// @ts-ignore
				const error = new Error(responseData.error.errors[0].message || "Failed to login!");
				throw error;
			}
			// @ts-ignore
			return Object.values(responseData)[0]?.email ?? '' as string;
		}

		const submitForm = async (): Promise<void> => {
			validateForm();

			if (formIsValid.value === true) {
				const email = await emailFromUserName();
				let url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCoG9_oLjMpmAxVhlYRqnStbTpdWiMTS1A";

				const data = {
					email: email,
					username: username.value.val,
					idUser: null
				}

				const response = await fetch(url, {
					method: "POST",
					body: JSON.stringify({
						returnSecureToken: true,
						email: data.email,
						password: password.value.val,
					}),
				});


				const responseData = await response.json();
				data.idUser = responseData.localId;

				if (!response.ok) {
					console.error("Failed to login!", responseData);
					const error = new Error(responseData.error.errors[0].message || "Failed to login!");
					throw error;
				}

				localStorage.setItem("token", responseData.idToken);
				localStorage.setItem("userData", JSON.stringify(data));
				router.replace('/discovery');
			}
		}

		return {
			username,
			password,
			formIsValid,
			submitForm,
			clearValidity
		}
	},

});
</script>

<style scoped>
.form-control {
	margin: 15px 0px;
}

label {
	font-weight: bold;
	display: block;
	margin-bottom: 0.5rem;
}

.invalid p,
.invalid label {
	color: red;
}

.invalid input {
	border: 1px solid red;
}
</style>