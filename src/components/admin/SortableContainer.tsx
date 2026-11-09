"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical, ArrowUp, ArrowDown } from "@phosphor-icons/react";

export function SortableItemRow({
  id,
  index,
  total,
  onMoveUp,
  onMoveDown,
  children,
}: {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-md border border-border bg-surface/70 p-4"
    >
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Geser untuk mengubah urutan"
          className="inline-flex items-center justify-center w-8 h-8 rounded-sm border border-border bg-bg text-text-secondary hover:text-primary hover:border-primary"
        >
          <DotsSixVertical size={18} aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Pindahkan ke atas"
            className="inline-flex items-center justify-center w-6 h-6 rounded-sm border border-border bg-bg text-text-secondary hover:text-primary disabled:opacity-40"
          >
            <ArrowUp size={12} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Pindahkan ke bawah"
            className="inline-flex items-center justify-center w-6 h-6 rounded-sm border border-border bg-bg text-text-secondary hover:text-primary disabled:opacity-40"
          >
            <ArrowDown size={12} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (nextItems: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  }

  function moveByOffset(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    onReorder(arrayMove(items, index, target));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((item, idx) => (
            <SortableItemRow
              key={item.id}
              id={item.id}
              index={idx}
              total={items.length}
              onMoveUp={() => moveByOffset(idx, -1)}
              onMoveDown={() => moveByOffset(idx, 1)}
            >
              {renderItem(item)}
            </SortableItemRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

