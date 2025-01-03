'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { FormData, FormField } from '@/types/onboarding';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AddFieldButton from './add-field-button';
import FieldItem from './field-item';
import FormPreview from './form-preview';

interface FormEditorProps {
  formData: FormData;
  onFieldsReorder: (fields: FormField[]) => void;
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string) => void;
}

export default function FormEditor({
  formData,
  onFieldsReorder,
  selectedFieldId,
  onFieldSelect,
}: FormEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragStart = (event: DragStartEvent) => {
    onFieldSelect('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Extract column drop zone info from the id
    const columnMatch = over.id.toString().match(/(.+)_column_(\d+)/);

    if (columnMatch) {
      const [, parentId, columnIndex] = columnMatch;
      const draggedField = formData.fields.find((f) => f.id === active.id);

      if (draggedField) {
        const newFields = formData.fields
          .map((field) => {
            if (field.id === parentId && 'fields' in field) {
              const newColumnFields = [...field.fields];
              newColumnFields[parseInt(columnIndex)] = draggedField;
              return { ...field, fields: newColumnFields };
            }
            return field;
          })
          .filter((f) => f.id !== active.id);

        onFieldsReorder(newFields);
        return;
      }
    }

    // Handle normal reordering
    const oldIndex = formData.fields.findIndex((f) => f.id === active.id);
    const newIndex = formData.fields.findIndex((f) => f.id === over.id);
    const newFields = arrayMove(formData.fields, oldIndex, newIndex);
    onFieldsReorder(newFields);
  };

  function handleAddSubField(
    parentId: string,
    columnIndex: number,
    newField: FormField
  ) {
    const updatedFields = formData.fields.map((field) => {
      if (field.id === parentId && 'fields' in field) {
        const newColumnFields = [...field.fields];
        newColumnFields[columnIndex] = newField;
        return { ...field, fields: newColumnFields };
      }
      return field;
    });
    onFieldsReorder(updatedFields);
  }

  function removeFieldRecursive(
    fields: FormField[],
    fieldId: string
  ): FormField[] {
    return fields
      .filter((f) => f.id !== fieldId)
      .map((f) => {
        if ('fields' in f && f.fields) {
          return {
            ...f,
            fields: removeFieldRecursive(
              f.fields.filter(Boolean) as FormField[],
              fieldId
            ),
          };
        }
        return f;
      });
  }

  function handleDeleteField(fieldId: string) {
    const newFields = removeFieldRecursive(formData.fields, fieldId);
    onFieldsReorder(newFields);
  }

  return (
    <Tabs defaultValue="edit" className="h-full w-full">
      <TabsList>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="h-[calc(100%-40px)] overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formData.fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {formData.fields.map((field) => (
                <div key={field.id}>
                  <FieldItem
                    field={field}
                    onClick={() => onFieldSelect(field.id)}
                    isSelected={selectedFieldId === field.id}
                    onDelete={() => handleDeleteField(field.id)}
                  />
                  {(field.fieldType === 'two-column-row' ||
                    field.fieldType === 'three-column-row') && (
                    <SortableContext
                      items={
                        field.fields
                          ?.filter((f) => f !== null)
                          .map((f) => f!.id) || []
                      }
                      strategy={horizontalListSortingStrategy}
                    >
                      <div
                        className={`grid grid-cols-${field.fieldType === 'two-column-row' ? '2' : '3'} mt-2 gap-4 rounded border-2 border-dashed p-2`}
                      >
                        {field.fields?.map((subField, index) => (
                          <div
                            key={`${field.id}_column_${index}`}
                            id={`${field.id}_column_${index}`}
                            className="flex min-h-[100px] items-center justify-center rounded border-2 border-dashed bg-muted p-2"
                          >
                            {subField ? (
                              <FieldItem
                                field={subField}
                                onClick={() => onFieldSelect(subField.id)}
                                isSelected={selectedFieldId === subField.id}
                                hideHandle
                                onDelete={() => handleDeleteField(subField.id)}
                              />
                            ) : (
                              <AddFieldButton
                                onAddField={(newField) =>
                                  handleAddSubField(field.id, index, newField)
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </div>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>{/* Drag overlay content */}</DragOverlay>
        </DndContext>
      </TabsContent>
      <TabsContent
        value="preview"
        className="h-[calc(100%-40px)] overflow-y-auto"
      >
        <FormPreview formData={formData} />
      </TabsContent>
    </Tabs>
  );
}
