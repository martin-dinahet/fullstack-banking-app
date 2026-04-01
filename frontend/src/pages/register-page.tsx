import type { FC } from "react";
import { RegisterForm } from "@/features/auth/components/register-form";

export const RegisterPage: FC = () => {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<RegisterForm />
		</div>
	);
};
