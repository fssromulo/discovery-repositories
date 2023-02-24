<template>
	<div class="username">
		<Title content="My Account"></Title>
		<form @submit.prevent="submitForm">
			<div class="form-control" :class="{ invalid: !username.isValid }">
				<label for="username-input">Username*</label>
				<input type="text" v-model.trim="username.val" id="username-input" @blur="clearValidity('username')"
					placeholder="Username" />
				<p v-if="!username.isValid && !formIsValid">UserName must have a valid value!</p>
			</div>
			<div class="form-control" :class="{ invalid: !email.isValid }">
				<label for="email-input">E-mail*</label>
				<input type="email" v-model.trim="email.val" id="email-input" @blur="clearValidity('email')"
					placeholder="E-mail" />
				<p v-if="!email.isValid && !formIsValid">E-mail must have a valid value!</p>
			</div>
			<div class="form-control">
				<button type="submit"> Save </button>

			</div>
			<hr />
			Username --> {{ username }} <br />
			E-mail --> {{ email }}
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRouter } from "vue-router";
import Title from "../components/Title.vue";

export default defineComponent({
	components: {
		Title
	},
	props: {
		content: { type: String, required: true, default: '' },
		shouldShowFilters: { type: Boolean, required: false, default: false },
	},

	setup() {

		const router = useRouter();
		const userLocalStorage = JSON.parse(localStorage.getItem('userData') ?? '{}');

		const username: Ref<{ val: string, isValid: boolean }> = ref({ val: userLocalStorage?.username ?? '', isValid: true });
		const email: Ref<{ val: string, isValid: boolean }> = ref({ val: userLocalStorage?.email ?? '', isValid: true });
		let formIsValid: Ref<boolean> = ref(true);

		function validateEmail(): boolean {
			return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value.val)) ?? false;
		}

		function validateForm() {
			formIsValid.value = true;
			if (username.value.val.length === 0) {
				username.value.isValid = false;
				formIsValid.value = false;
			}

			if (email.value.val.length === 0 && !validateEmail()) {
				email.value.isValid = false;
				formIsValid.value = false;
			}
		}

		const clearValidity = (input: string): void => {
			eval(input).value.isValid = true;
		}

		const submitForm = async (): Promise<void> => {
			validateForm();
			if (formIsValid.value === true) {
				const token = localStorage.getItem('token') ?? '';

				// Salvar o user no banco do FIREBASE
				const authUrl = `auth=${token}`;
				const urlSaveUser = `https://discovery-repositories-default-rtdb.firebaseio.com/users/${userLocalStorage.idUser}/.json?${authUrl}`;

				const changedData = {
					username: username.value.val,
					email: email.value.val,
				};

				const data = { ...userLocalStorage, ...changedData }

				const responseSaveUser = await fetch(urlSaveUser, {
					method: "PUT",
					body: JSON.stringify(data),
				});

				const responseDataSaveUSer = await responseSaveUser.json();
				if (!responseSaveUser.ok) {
					const error = new Error(responseDataSaveUSer.message || "Failed to send a user!");
					throw error;
				}

				localStorage.setItem("userData", JSON.stringify(data));

				router.replace('/discovery');
			}
		}

		return {
			username,
			email,
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
