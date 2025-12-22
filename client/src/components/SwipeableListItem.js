import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import ListItem from './ListItem';

const SWIPE_THRESHOLD = 100;

const getIndicatorStyle = (opacity, isDragging) => ({
  opacity,
  transitionProperty: isDragging ? 'none' : 'opacity',
  transitionDuration: isDragging ? 'none' : '0.2s',
  transitionTimingFunction: 'ease-out',
});

const SwipeableListItem = ({
  item,
  onItemClick,
  linkTo,
  getData,
  backUrl,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.key,
      disabled: !onDelete && !onItemClick,
    });

  const swipeDistance = transform?.x || 0;

  const deleteOpacity =
    swipeDistance < 0 ? Math.min(-swipeDistance / SWIPE_THRESHOLD, 1) : 0;
  const cartOpacity =
    swipeDistance > 0 ? Math.min(swipeDistance / SWIPE_THRESHOLD, 1) : 0;

  let backgroundColor = 'transparent';
  if (swipeDistance < -SWIPE_THRESHOLD) {
    backgroundColor = '#ffcccc';
  } else if (swipeDistance > SWIPE_THRESHOLD) {
    backgroundColor = '#e6ffd9';
  }

  const contentStyle = {
    transform: CSS.Translate.toString(transform),
    position: 'relative',
    zIndex: 1,
    backgroundColor,
    transitionProperty: transform ? 'none' : 'transform, background-color',
    transitionDuration: transform ? 'none' : '0.2s',
    transitionTimingFunction: 'ease-out',
  };

  return (
    <div className="swipeable-wrapper">
      <div
        className="swipeable-indicator swipeable-indicator--delete"
        style={getIndicatorStyle(deleteOpacity, isDragging)}
      >
        {t('edit.delete')}
      </div>
      <div
        className="swipeable-indicator swipeable-indicator--cart"
        style={getIndicatorStyle(cartOpacity, isDragging)}
      >
        {t('products.cart')}
      </div>
      <div ref={setNodeRef} style={contentStyle}>
        <div {...listeners} {...attributes} style={{ touchAction: 'pan-y' }}>
          <ListItem
            id={item.key}
            value={item.value}
            description={item.description}
            days={item.days}
            checked={item.checked}
            onClick={() => onItemClick(item, getData)}
            linkTo={linkTo(item.id)}
            backUrl={backUrl}
            italic={item.italic}
          />
        </div>
      </div>
    </div>
  );
};

SwipeableListItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.element,
    days: PropTypes.number,
    checked: PropTypes.bool,
    italic: PropTypes.bool,
  }).isRequired,
  onItemClick: PropTypes.func.isRequired,
  linkTo: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  backUrl: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default SwipeableListItem;
