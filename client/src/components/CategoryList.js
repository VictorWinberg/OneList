import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ListItem from './ListItem';

const SortableItem = ({ item, linkTo, history, isDraggingGlobal }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeft: `5px solid ${item.color || '#ccc'}`,
    touchAction: isDragging ? 'none' : 'pan-y',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  };

  const handleClick = (e) => {
    if (isDragging || isDraggingGlobal) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    history.push(`/categories/${item.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'isDragging' : null}
      {...attributes}
    >
      <ListItem
        id={item.id}
        value={item.value}
        onClick={handleClick}
        linkTo={linkTo(item.id)}
        dragListeners={listeners}
      />
    </div>
  );
};

SortableItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.string.isRequired,
    color: PropTypes.string,
    orderidx: PropTypes.number,
  }).isRequired,
  linkTo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isDraggingGlobal: PropTypes.bool,
};

const CategoryList = ({ view, items, linkTo, history, onItemReorder }) => {
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onItemReorder({
          startIndex: items[oldIndex].orderidx,
          endIndex: items[newIndex].orderidx,
        });
      }
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
  };

  const itemIds = items.map((item) => item.id);

  return (
    <div className={view}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <ul>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                linkTo={linkTo}
                history={history}
                isDraggingGlobal={isDragging}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

CategoryList.propTypes = {
  view: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      orderidx: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
  linkTo: PropTypes.func.isRequired,
  onItemReorder: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CategoryList;
