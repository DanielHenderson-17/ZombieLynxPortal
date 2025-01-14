// Sets the icon for the category based on the category name
export const categoryFormatter = (category) => {
  switch (category) {
    case "Bug":
      return '<i class="bi bi-bug-fill"></i>';
    case "Shop Issue":
      return '<i class="bi bi-bag"></i>';
    case "Connection Issue":
      return '<i class="bi bi-wifi-off"></i>';
    default:
      return '<i class="bi bi-question-lg"></i>';
  }
};
