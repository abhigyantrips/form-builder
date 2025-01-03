'use client';

import {
  AlignLeft,
  CheckSquare,
  CircleDot,
  Columns,
  Columns3,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  List,
  Mail,
  Minus,
  NotepadTextIcon as Paragraph,
  Type,
} from 'lucide-react';

import {
  ChoiceField,
  ColumnField,
  FieldType,
  FormField,
  InputField,
  StaticField,
} from '@/types/onboarding';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AddFieldButton({
  onAddField,
}: {
  onAddField: (field: FormField) => void;
}) {
  const handleAddField = (fieldType: FieldType) => {
    const baseField = {
      id: `${fieldType}_${Date.now()}`,
      name:
        fieldType === 'two-column-row'
          ? 'Two Columns'
          : fieldType === 'three-column-row'
            ? 'Three Columns'
            : `${fieldType.charAt(0).toUpperCase()}${fieldType.slice(1)}`,
      fieldType,
    };

    let newField: FormField;

    if (
      fieldType === 'text' ||
      fieldType === 'number' ||
      fieldType === 'email' ||
      fieldType === 'textarea'
    ) {
      newField = {
        ...baseField,
        fieldType,
        placeholder: '',
        description: '',
        required: false,
      } as InputField;
    } else if (
      fieldType === 'select' ||
      fieldType === 'radio' ||
      fieldType === 'checkbox'
    ) {
      newField = {
        ...baseField,
        fieldType,
        options: ['Option 1', 'Option 2', 'Option 3'],
        placeholder: '',
        description: '',
        required: false,
      } as ChoiceField;
    } else if (
      fieldType === 'two-column-row' ||
      fieldType === 'three-column-row'
    ) {
      newField = {
        ...baseField,
        fieldType,
        fields:
          fieldType === 'two-column-row' ? [null, null] : [null, null, null],
      } as ColumnField;
    } else {
      newField = {
        ...baseField,
        fieldType,
      } as StaticField;
    }

    onAddField(newField);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Add Field</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleAddField('text')}>
          <Type className="mr-2 h-4 w-4" /> Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('number')}>
          <Hash className="mr-2 h-4 w-4" /> Number
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('email')}>
          <Mail className="mr-2 h-4 w-4" /> Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('textarea')}>
          <AlignLeft className="mr-2 h-4 w-4" /> Textarea
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('select')}>
          <List className="mr-2 h-4 w-4" /> Select
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('radio')}>
          <CircleDot className="mr-2 h-4 w-4" /> Radio
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('checkbox')}>
          <CheckSquare className="mr-2 h-4 w-4" /> Checkbox
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('h1')}>
          <Heading1 className="mr-2 h-4 w-4" /> Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('h2')}>
          <Heading2 className="mr-2 h-4 w-4" /> Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('h3')}>
          <Heading3 className="mr-2 h-4 w-4" /> Heading 3
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('paragraph')}>
          <Paragraph className="mr-2 h-4 w-4" /> Paragraph
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('separator')}>
          <Minus className="mr-2 h-4 w-4" /> Separator
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('two-column-row')}>
          <Columns className="mr-2 h-4 w-4" /> Two Columns
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddField('three-column-row')}>
          <Columns3 className="mr-2 h-4 w-4" /> Three Columns
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
