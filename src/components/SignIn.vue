<template>
	<div class="signInComponent">
		<v-sheet width="500" class="mx-auto">
			<Title content="Sign in form"></Title>
			<v-form @submit.prevent="submitForm">
				<div class="form-control">
					<v-text-field label="Username" v-model.trim="username.val" id="username-input"
						@blur="clearValidity('username')"></v-text-field>
					<v-alert v-if="!username.isValid && !formIsValid" text="UserName must have a valid value!"
						color="error"></v-alert>
				</div>
				<div class="form-control">
					<v-text-field type="password" label="Password" v-model.trim="password.val" id="password-input"
						@blur="clearValidity('password')"></v-text-field>
					<v-alert v-if="!password.isValid && !formIsValid" text="Password must have 6 or more characters!"
						color="error"></v-alert>
				</div>
				<div class="form-control">
					<v-btn :disabled="isLoading" variant="flat" color="primary" type="submit" style="width: 100%;">
						Sign in
					</v-btn>
				</div>
				<v-divider />
				<div class="form-control" style="display: flex; flex-direction: row;justify-content: center;">
					<p>
						Don't have an account? <RouterLink to="/signup">Click here to sign up</RouterLink>
					</p>
				</div>
			</v-form>

			<Overlay v-model="isLoading" :loading="isLoading"></Overlay>
		</v-sheet>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import Title from "../components/Title.vue";
import Overlay from "@/components/overlay/Overlay.vue";

export default defineComponent({
	components: {
		Title,
		Overlay
	},
	props: {
		content: { type: String, required: true, default: '' },
		shouldShowFilters: { type: Boolean, required: false, default: false },
	},

	setup() {
		const username: Ref<{ val: string, isValid: boolean }> = ref({ val: '', isValid: true });
		const password: Ref<{ val: string, isValid: boolean }> = ref({ val: '', isValid: true });
		const formIsValid: Ref<boolean> = ref(true);
		const isLoading: Ref<boolean> = ref(false);
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
			try {
				validateForm();

				if (formIsValid.value === true) {
					isLoading.value = true;
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
					isLoading.value = false;
					router.replace('/discovery');
				}
			} catch (error) {
				isLoading.value = false;
				console.error("It not possible logged you in.", error);
				alert("It not possible logged you in.");
			}

		}

		return {
			username,
			password,
			formIsValid,
			isLoading,
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
