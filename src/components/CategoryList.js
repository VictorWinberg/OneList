import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ListItem from './ListItem';

const CategoryList = ({ view, items, linkTo, onItemReorder }) => (
  <div className={view}>
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        if (destination) {
          onItemReorder({
            startIndex: items[source.index].orderidx,
            endIndex: items[destination.index].orderidx,
          });
        }
      }}
    >
      <Droppable droppableId="droppable">
        {({ innerRef, placeholder }) => (
          <ul ref={innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, { isDragging }) => (
                  <div
                    className={isDragging ? 'isDragging' : null}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      borderLeft: `5px solid ${item.color || '#ccc'}`,
                    }}
                  >
                    <ListItem
                      id={item.id}
                      value={item.value}
                      linkTo={linkTo(item.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  </div>
);

CategoryList.propTypes = {
  view: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool,
    })
  ).isRequired,
  linkTo: PropTypes.func.isRequired,
  onItemReorder: PropTypes.func.isRequired,
};

export default CategoryList;
