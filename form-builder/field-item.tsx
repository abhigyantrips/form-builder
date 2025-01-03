'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlignLeft,
  CheckSquare,
  CircleDot,
  Columns,
  Columns3,
  GripVertical,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  List,
  Mail,
  Minus,
  NotepadTextIcon as Paragraph,
  Trash2,
  Type,
} from 'lucide-react';

import { FormField } from '@/types/onboarding';

import { cn } from '@/lib/utils';

import { Button } from '../button';

interface FieldItemProps {
  field: FormField;
  onClick: () => void;
  isSelected?: boolean;
  hideHandle?: boolean;
  onDelete?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  textarea: <AlignLeft className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  radio: <CircleDot className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  h1: <Heading1 className="h-4 w-4" />,
  h2: <Heading2 className="h-4 w-4" />,
  h3: <Heading3 className="h-4 w-4" />,
  paragraph: <Paragraph className="h-4 w-4" />,
  separator: <Minus className="h-4 w-4" />,
  'two-column-row': <Columns className="h-4 w-4" />,
  'three-column-row': <Columns3 className="h-4 w-4" />,
};

export default function FieldItem({
  field,
  onClick,
  isSelected,
  hideHandle = false,
  onDelete,
}: FieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex h-full w-full cursor-pointer items-center gap-2 rounded border p-2 hover:bg-accent',
        isDragging && 'z-50 opacity-50',
        isSelected && 'border-primary',
        (field.fieldType === 'two-column-row' ||
          field.fieldType === 'three-column-row') &&
          'bg-muted'
      )}
      onClick={onClick}
    >
      {!hideHandle && (
        <div className="cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="mr-2">{iconMap[field.fieldType]}</div>
      <div className="flex-1">
        <div className="font-medium">{field.name}</div>
        <div className="text-sm text-muted-foreground">{field.fieldType}</div>
      </div>
      {(field.fieldType === 'two-column-row' ||
        field.fieldType === 'three-column-row') && (
        <div className="ml-2 text-xs text-muted-foreground">
          {field.fields?.filter((f) => f !== null).length || 0}/
          {field.fields?.length} columns filled
        </div>
      )}
      {onDelete && !hideHandle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-destructive hover:bg-foreground/10"
        >
          <Trash2 className="size-5" />
        </Button>
      )}
    </div>
  );
}
