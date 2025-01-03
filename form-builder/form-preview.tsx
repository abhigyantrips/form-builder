import { FormData } from '@/types/onboarding';

import FormGenerator from './form-generator';

export default function FormPreview({ formData }: { formData: FormData }) {
  return (
    <div className="rounded border p-4">
      <h2 className="mb-4 text-lg font-semibold">Form Preview</h2>
      {formData.fields.length === 0 ? (
        <div className="my-4 flex flex-col items-center space-y-4">
          <div className="p-4 text-center text-gray-500">
            No fields have been added to the form.
          </div>
        </div>
      ) : (
        <FormGenerator formData={formData} />
      )}
    </div>
  );
}
