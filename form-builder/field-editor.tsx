'use client';

import { useEffect, useState } from 'react';

import {
  ChoiceField,
  FormField,
  InputField,
  StaticField,
} from '@/types/onboarding';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FieldEditorProps {
  field: FormField | null;
  onUpdate: (updatedField: FormField) => void;
}

export default function FieldEditor({ field, onUpdate }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<FormField | null>(field);

  useEffect(() => {
    setEditedField(field);
  }, [field]);

  if (!editedField) return null;

  const handleChange = (key: string, value: any) => {
    setEditedField((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value } as FormField;
    });
  };

  const handleSave = () => {
    if (editedField) {
      onUpdate(editedField);
    }
  };

  const renderFieldTypeSpecificInputs = () => {
    switch (editedField.fieldType) {
      case 'text':
      case 'number':
      case 'email':
      case 'textarea':
        return (
          <>
            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={(editedField as InputField).placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={(editedField as InputField).description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={(editedField as InputField).required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required">Required</Label>
            </div>
          </>
        );
      case 'select':
      case 'radio':
      case 'checkbox':
        return (
          <>
            <div>
              <Label htmlFor="options">Options (comma-separated)</Label>
              <Input
                id="options"
                value={(editedField as ChoiceField).options.join(', ')}
                onChange={(e) =>
                  handleChange(
                    'options',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={(editedField as ChoiceField).description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={(editedField as ChoiceField).required || false}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required">Required</Label>
            </div>
          </>
        );
      case 'h1':
      case 'h2':
      case 'h3':
      case 'paragraph':
        return (
          <div>
            <Label htmlFor="name">Text</Label>
            <Input
              id="name"
              value={(editedField as StaticField).name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Field</h2>
      {editedField.fieldType !== 'separator' && (
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={editedField.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
      )}
      {renderFieldTypeSpecificInputs()}
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
