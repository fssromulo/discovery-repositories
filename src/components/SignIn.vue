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
					placeholder="E-mail" />
				<p v-if="!password.isValid && !formIsValid">Password must have 6 or more characters!</p>
			</div>
			<div class="form-control">
				<button type="submit"> Sign in </button>
			</div>
			<p>Don't have an account? <RouterLink to="/signup">Click here to sign up</RouterLink>
				<hr />
			</p>
			Username --> {{ username }} <br />
			Password --> {{ password }}
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';

export default defineComponent({
	props: {
		content: { type: String, required: true, default: '' },
		shouldShowFilters: { type: Boolean, required: false, default: false },
	},

	setup() {
		const username: Ref<{ val: string, isValid: boolean }> = ref({ val: '', isValid: true });
		const password: Ref<{ val: string, isValid: boolean }> = ref({ val: '', isValid: true });
		let formIsValid: Ref<boolean> = ref(true);

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

		const submitForm = (): void => {
			validateForm();

			if (formIsValid.value === true) {
				console.log('POST TO SOMEWHERE...');
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
