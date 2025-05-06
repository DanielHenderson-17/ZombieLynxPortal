export function isPackageFree(pkg) {
  return parseFloat(pkg.total_price) === 0;
}
