import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import ListItem from './ListItem';

const SWIPE_THRESHOLD = 100;

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
  const isSwipedLeftEnough = swipeDistance < -SWIPE_THRESHOLD;
  const isSwipedRightEnough = swipeDistance > SWIPE_THRESHOLD;

  const wrapperStyle = {
    position: 'relative',
    overflow: 'hidden',
  };

  const deleteIndicatorStyle = {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100px',
    backgroundColor: '#fb9191',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: 0,
    opacity:
      swipeDistance < 0
        ? Math.min(Math.abs(swipeDistance) / SWIPE_THRESHOLD, 1)
        : 0,
    transitionProperty: isDragging ? 'none' : 'opacity',
    transitionDuration: isDragging ? 'none' : '0.2s',
    transitionTimingFunction: 'ease-out',
  };

  const cartIndicatorStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100px',
    backgroundColor: '#c8eea0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: 0,
    opacity:
      swipeDistance > 0 ? Math.min(swipeDistance / SWIPE_THRESHOLD, 1) : 0,
    transitionProperty: isDragging ? 'none' : 'opacity',
    transitionDuration: isDragging ? 'none' : '0.2s',
    transitionTimingFunction: 'ease-out',
  };

  let backgroundColor = 'transparent';
  if (isSwipedLeftEnough) {
    backgroundColor = '#ffcccc';
  } else if (isSwipedRightEnough) {
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
    <div style={wrapperStyle}>
      <div style={deleteIndicatorStyle}>{t('edit.delete')}</div>
      <div style={cartIndicatorStyle}>{t('products.cart')}</div>
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
