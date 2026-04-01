import { FormCheckbox } from "./form-checkbox";
import { FormError } from "./form-error";
import { FormField } from "./form-field";
import { FormFields } from "./form-fields";
import { FormRoot } from "./form-root";
import { FormSubmit } from "./form-submit";

export const Form = Object.assign(FormRoot, {
  Root: FormRoot,
  Fields: FormFields,
  Field: FormField,
  Error: FormError,
  Submit: FormSubmit,
  Checkbox: FormCheckbox,
});
