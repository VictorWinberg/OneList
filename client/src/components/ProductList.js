import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import ListItem from './ListItem';
import SwipeableListItem from './SwipeableListItem';

const parseAgeFilter = (filter) => {
  const unitMultipliers = { d: 1, w: 7, m: 30, y: 365 };
  if (!filter) return null;

  const amount = parseInt(filter.slice(0, -1), 10);
  const unit = filter.slice(-1);

  return amount * unitMultipliers[unit];
};

const countDays = (date) => {
  if (!date) return null;

  const today = new Date().getTime();
  const updated = new Date(date).getTime();

  return Math.floor((today - updated) / (1000 * 60 * 60 * 24));
};

const showAmount = (amount, unit) => {
  if (amount && amount !== '0') {
    return (
      <span className="amountText">
        {amount.replace(/\./, ',')}
        {unit}
      </span>
    );
  }
  return null;
};

const getDays = (date) => countDays(date) ?? Number.MAX_SAFE_INTEGER;
const compareStrings = (a, b) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });
const sorters = {
  nameAsc: (a, b) => compareStrings(a.value, b.value),
  dateDesc: (a, b) => getDays(a.updated_at) - getDays(b.updated_at),
};

const sortItems = (items = [], sortOrder = 'nameAsc') => {
  const key = sortOrder === 'dateDesc' ? 'dateDesc' : 'nameAsc';
  return [...items].sort(sorters[key]);
};

const EMPTY_RESTOCK_NAMES = new Set();

const filterByRestock = (items, restockFilter, restockProductNames) => {
  if (!restockFilter) return items;
  return items.filter((item) => {
    const name = (item.name || item.value || '').toLowerCase();
    return restockProductNames.has(name);
  });
};

const li = (
  item,
  onItemClick,
  linkTo,
  getData,
  backUrl,
  onDelete,
  useSwipe = false
) => {
  const itemProps = {
    item: {
      ...item,
      description: showAmount(item.amount, item.unit),
      days: countDays(item.updated_at),
    },
    onItemClick,
    linkTo,
    getData,
    backUrl,
    onDelete: onDelete ? () => onDelete(item, getData) : null,
  };

  if (useSwipe && (onDelete || onItemClick)) {
    return <SwipeableListItem key={item.key} {...itemProps} />;
  }

  return (
    <ListItem
      key={item.key}
      id={item.key}
      value={item.value}
      description={itemProps.item.description}
      days={itemProps.item.days}
      checked={item.checked}
      onClick={() => onItemClick(item, getData)}
      linkTo={linkTo(item.id)}
      backUrl={backUrl}
      italic={item.italic}
      onDelete={onDelete ? () => onDelete(item, getData) : null}
    />
  );
};

const ProductList = ({
  active,
  checked,
  onItemClick,
  onDoneClick,
  linkTo,
  backUrl,
  view,
  getData,
  ageFilter,
  sortOrder,
  restockFilter = false,
  restockProductNames = EMPTY_RESTOCK_NAMES,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const handleDragMove = (event) => {
    if (event.delta) {
      setDragDelta(event.delta);
    }
  };

  const handleDragEnd = (event) => {
    const { active: activeDrag } = event;
    const SWIPE_THRESHOLD = 100;

    const allItems = active.flatMap((category) => category.items);
    const draggedItem = allItems.find(
      (listItem) => listItem.key === activeDrag.id
    );

    if (draggedItem) {
      if (dragDelta.x < -SWIPE_THRESHOLD && onDelete) {
        onDelete(draggedItem, getData);
      } else if (dragDelta.x > SWIPE_THRESHOLD && onItemClick) {
        onItemClick(draggedItem, getData);
      }
    }

    setDragDelta({ x: 0, y: 0 });
  };

  const handleDragStart = () => {
    setDragDelta({ x: 0, y: 0 });
  };

  const handleDragCancel = () => {
    setDragDelta({ x: 0, y: 0 });
  };

  const maxDays = parseAgeFilter(ageFilter);

  return (
    <div className={view}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div>
          {active.map(({ value, color, items }) => {
            const ageFilteredItems = items.filter((item) => {
              if (!maxDays) return true;

              const days = countDays(item.updated_at);
              return days !== null && days <= maxDays;
            });

            const filteredItems = filterByRestock(
              ageFilteredItems,
              restockFilter,
              restockProductNames
            );

            const sortedItems = sortItems(filteredItems, sortOrder);

            if (sortedItems.length === 0) return null;

            return (
              <div
                key={value}
                style={{ borderLeft: `5px solid ${color || '#ccc'}` }}
              >
                <div className="section">{value}</div>
                <ul className="active">
                  {sortedItems.map((item) =>
                    li(
                      item,
                      onItemClick,
                      linkTo,
                      getData,
                      backUrl,
                      onDelete,
                      true
                    )
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </DndContext>

      <ul className={checked.length ? 'done' : 'hidden'}>
        <h2>{t(`${view}.cart`)}</h2>
        {onDoneClick && (
          <button
            type="button"
            className="removeBtn"
            onClick={(evt) => onDoneClick(evt, getData)}
          >
            {t(`${view}.remove`)}
          </button>
        )}
        <ul>
          {checked.map((item) =>
            li(item, onItemClick, linkTo, getData, backUrl, onDelete)
          )}
        </ul>
      </ul>
    </div>
  );
};

ProductList.propTypes = {
  active: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      color: PropTypes.string,
      items: PropTypes.array,
    })
  ).isRequired,
  checked: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      items: PropTypes.array,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
  onDoneClick: PropTypes.func,
  linkTo: PropTypes.func.isRequired,
  backUrl: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  ageFilter: PropTypes.string,
  sortOrder: PropTypes.string,
  restockFilter: PropTypes.bool,
  restockProductNames: PropTypes.instanceOf(Set),
  onDelete: PropTypes.func,
};

export default ProductList;
