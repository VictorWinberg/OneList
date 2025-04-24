import React from "react";
import PropTypes from "prop-types";

import ListItem from "./ListItem";

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
  if (amount && amount !== "0") {
    return (
      <span className="amountText">
        {amount.replace(/\./, ",")}
        {unit}
      </span>
    );
  }
  return null;
};

const getDays = (date) => countDays(date) ?? Number.MAX_SAFE_INTEGER;
const compareStrings = (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" });
const sorters = {
  nameAsc: (a, b) => compareStrings(a.value, b.value),
  nameDesc: (a, b) => compareStrings(b.value, a.value),
  dateAsc: (a, b) => getDays(b.updated_at) - getDays(a.updated_at),
  dateDesc: (a, b) => getDays(a.updated_at) - getDays(b.updated_at),
};

const sortItems = (items = [], sortOrder = "nameAsc") => [...items].sort(sorters[sortOrder]);

const li = (item, onItemClick, linkTo, getData, backUrl) => (
  <ListItem
    id={item.key}
    key={item.key}
    value={item.value}
    description={showAmount(item.amount, item.unit)}
    days={countDays(item.updated_at)}
    checked={item.checked}
    onClick={() => onItemClick(item, getData)}
    linkTo={linkTo(item.id)}
    backUrl={backUrl}
    italic={item.italic}
  />
);

const ProductList = ({
  active,
  checked,
  onItemClick,
  onDoneClick,
  linkTo,
  backUrl,
  translate,
  view,
  getData,
  ageFilter,
  sortOrder,
}) => (
  <div className={view}>
    <div>
      {active.map(({ value, color, items }) => {
        const filteredItems = items.filter((item) => {
          const maxDays = parseAgeFilter(ageFilter);
          if (!maxDays) return true;

          const days = countDays(item.updated_at);
          return days !== null && days <= maxDays;
        });

        const sortedItems = sortItems(filteredItems, sortOrder);

        if (sortedItems.length === 0) return null;

        return (
          <div key={value} style={{ borderLeft: `5px solid ${color || "#ccc"}` }}>
            <div className="section">{value}</div>
            <ul className="active">
              {sortedItems.map((item) => li(item, onItemClick, linkTo, getData, backUrl))}
            </ul>
          </div>
        );
      })}
    </div>

    <ul className={checked.length ? "done" : "hidden"}>
      <h2>{translate(`${view}.cart`)}</h2>
      <button type="button" className="removeBtn" onClick={(evt) => onDoneClick(evt, getData)}>
        {translate(`${view}.remove`)}
      </button>
      <ul>{checked.map((item) => li(item, onItemClick, linkTo))}</ul>
    </ul>
  </div>
);

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
  onDoneClick: PropTypes.func.isRequired,
  linkTo: PropTypes.func.isRequired,
  backUrl: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  ageFilter: PropTypes.string,
};

export default ProductList;
