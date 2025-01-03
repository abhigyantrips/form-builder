'use client';

import { FormData, FormField, InputField } from '@/types/onboarding';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function FormGenerator({ formData }: { formData: FormData }) {
  const renderField = (field: FormField) => {
    switch (field.fieldType) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <Input
            type={field.fieldType}
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'h1':
        return <h1 className="text-4xl font-bold">{field.name}</h1>;
      case 'h2':
        return <h2 className="text-3xl font-semibold">{field.name}</h2>;
      case 'h3':
        return <h3 className="text-2xl font-medium">{field.name}</h3>;
      case 'paragraph':
        return <p>{field.name}</p>;
      case 'separator':
        return <Separator />;
      case 'two-column-row':
        return (
          <div className="grid grid-cols-2 gap-4">
            {field.fields?.map((subField, index) => (
              <div key={index}>
                {subField && renderFieldWithLabel(subField)}
              </div>
            ))}
          </div>
        );
      case 'three-column-row':
        return (
          <div className="grid grid-cols-3 gap-4">
            {field.fields?.map((subField, index) => (
              <div key={index}>
                {subField && renderFieldWithLabel(subField)}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderFieldWithLabel = (field: FormField) => {
    if (
      [
        'h1',
        'h2',
        'h3',
        'paragraph',
        'separator',
        'two-column-row',
        'three-column-row',
      ].includes(field.fieldType)
    ) {
      return renderField(field);
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>{field.name}</Label>
        {renderField(field)}
        {(field as InputField).description && (
          <p className="text-sm text-muted-foreground">
            {(field as InputField).description}
          </p>
        )}
      </div>
    );
  };

  return (
    <form className="space-y-6">
      {formData.fields.map((field) => (
        <div key={field.id}>{renderFieldWithLabel(field)}</div>
      ))}
    </form>
  );
}
