import { format } from "date-fns";

export const getLegendCount = (tables, groupId) => {
  return tables.reduce(
    (acc, item) => (item.group_id === groupId ? acc + 1 : acc),
    0
  );
};

export const getGroupColor = (legend, groupId) => {
  const group = legend.find(({ group_id }) => group_id === groupId);

  return group?.color || "transparent";
};

export const formatDate = (date) => format(new Date(date), "dd.MM.yyyy");
