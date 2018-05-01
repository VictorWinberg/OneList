import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 16,
  margin: '0 0 8px 0',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

// Normally you would want to split things out into separate components.
// But in this example everything is just done in one place for simplicity
const Reorder = ({ items, onItemReorder }) => (
  <DragDropContext
    onDragEnd={({ source, destination }) => {
      if (destination) {
        onItemReorder({
          startIndex: source.index,
          endIndex: destination.index,
        });
      }
    }}
  >
    <Droppable droppableId="droppable">
      {provided => (
        <div ref={provided.innerRef}>
          {items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(_provided, snapshot) => (
                <div
                  ref={_provided.innerRef}
                  {..._provided.draggableProps}
                  {..._provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    _provided.draggableProps.style
                  )}
                >
                  {item.value}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

Reorder.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool,
    })
  ).isRequired,
  onItemReorder: PropTypes.func.isRequired,
};

export default Reorder;
