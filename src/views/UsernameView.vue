<template>
	<div class="username">
		<v-sheet width="500" class="mx-auto">
			<Title content="My Account"></Title>
			<v-form @submit.prevent="submitForm">
				<div class="form-control">
					<v-text-field label="Username" v-model.trim="username.val" id="username-input"
						@blur="clearValidity('username')"></v-text-field>
					<v-alert v-if="!username.isValid && !formIsValid" text="UserName must have a valid value!"
						color="error"></v-alert>
				</div>
				<div class="form-control">
					<v-text-field label="E-mail" v-model.trim="email.val" id="email-input"
						@blur="clearValidity('email')"></v-text-field>

					<v-alert closable v-if="!email.isValid && !formIsValid" text="E-mail must have a valid value!"
						color="error"></v-alert>
				</div>
				<div class="form-control">
					<v-btn :disabled="isLoading" variant="flat" color="primary" type="submit">
						Save
					</v-btn>
				</div>
			</v-form>
			<Overlay v-model="isLoading" :loading="isLoading"></Overlay>
		</v-sheet>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRouter } from "vue-router";
import Overlay from "@/components/overlay/Overlay.vue";
import Title from "@/components/Title.vue";

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
		const router = useRouter();
		const userLocalStorage = JSON.parse(localStorage.getItem('userData') ?? '{}');

		const username: Ref<{ val: string, isValid: boolean }> = ref({ val: userLocalStorage?.username ?? '', isValid: true });
		const email: Ref<{ val: string, isValid: boolean }> = ref({ val: userLocalStorage?.email ?? '', isValid: true });
		let formIsValid: Ref<boolean> = ref(true);
		const isLoading: Ref<boolean> = ref(false);

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
			try {
				validateForm();
				if (formIsValid.value === true) {
					const token = localStorage.getItem('token') ?? '';
					isLoading.value = true;

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
					isLoading.value = false;
					router.replace('/discovery');
				}
			} catch (error) {
				isLoading.value = false;
				console.error("It not possible save your changes.", error);
				alert("It not possible save your changes.");
			}

		}

		return {
			username,
			email,
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
