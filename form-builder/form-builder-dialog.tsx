'use client';

import { FileQuestion } from 'lucide-react';

import { useState } from 'react';

import { FormData, FormField } from '@/types/onboarding';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import AddFieldButton from './add-field-button';
import FieldEditor from './field-editor';
import FormEditor from './form-editor';

interface FormBuilderDialogProps {
  initialData: FormData;
  onSaveForm?: (data: FormData) => void;
}

export default function FormBuilderDialog({
  initialData,
  onSaveForm,
}: FormBuilderDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Recursively find a field by ID within nested fields
  function findFieldById(
    fields: FormField[],
    targetId: string
  ): FormField | null {
    for (const field of fields) {
      if (field.id === targetId) return field;
      if ('fields' in field && field.fields) {
        const found = findFieldById(
          field.fields.filter(Boolean) as FormField[],
          targetId
        );
        if (found) return found;
      }
    }
    return null;
  }

  // Recursively update a field (top-level or subfield)
  function updateFieldRecursive(
    fields: FormField[],
    updatedField: FormField
  ): FormField[] {
    return fields.map((field) => {
      if (field.id === updatedField.id) {
        return updatedField;
      }
      if ('fields' in field && field.fields) {
        return {
          ...field,
          fields: updateFieldRecursive(
            field.fields.filter(Boolean) as FormField[],
            updatedField
          ),
        };
      }
      return field;
    });
  }

  // Modify existing updateField to use recursion
  const updateField = (updatedField: FormField) => {
    setFormData((prevData) => ({
      ...prevData,
      fields: updateFieldRecursive(prevData.fields, updatedField),
    }));
  };

  const addField = (newField: FormField) => {
    setFormData((prevData) => ({
      ...prevData,
      fields: [...prevData.fields, newField],
    }));
  };

  const handleFieldsReorder = (fields: FormField[]) => {
    setFormData((prevData) => ({
      ...prevData,
      fields,
    }));
  };

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId || null);
  };

  const selectedField = selectedFieldId
    ? findFieldById(formData.fields, selectedFieldId)
    : null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Open Form Builder
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="flex h-[90vh] w-full max-w-[90vw] flex-col overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0 pt-4">
          <DialogTitle>Form Builder</DialogTitle>
        </DialogHeader>
        <div className="flex h-[calc(100%-60px)] w-full items-start justify-start overflow-y-auto">
          <div className="flex h-full w-2/3 flex-col overflow-y-auto border-r p-6 pt-4">
            <div className="overflow flex-1">
              <FormEditor
                formData={formData}
                onFieldsReorder={handleFieldsReorder}
                selectedFieldId={selectedFieldId}
                onFieldSelect={handleFieldSelect}
              />
            </div>
          </div>
          <div className="h-full w-1/3 overflow-y-auto p-6 pt-4">
            {selectedField ? (
              <FieldEditor field={selectedField} onUpdate={updateField} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-muted p-2 text-muted-foreground">
                <FileQuestion size={48} className="mb-4" />
                <h3 className="mb-2 text-lg font-semibold">
                  No Field Selected
                </h3>
                <p className="text-center">
                  Select a field to edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 pt-0">
          <AddFieldButton onAddField={addField} />
          <Button
            onClick={() => {
              onSaveForm?.(formData);
              setDialogOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
