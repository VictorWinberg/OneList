import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ListItem from './ListItem';

const DnDList = ({ view, items, linkTo, onItemReorder }) => (
  <div className={view}>
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
        {({ innerRef }) => (
          <ul ref={innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, { isDragging }) => (
                  <div
                    className={isDragging ? 'isDragging' : null}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
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
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  </div>
);

DnDList.propTypes = {
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

export default DnDList;
