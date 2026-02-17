// Small helper to prefetch lazily-loaded route chunks on link hover/touch.
// This keeps the app visually responsive: when users hover a nav/link we
// start loading the route bundle so navigation is near-instant.

export function prefetchHome() {
  return import(/* webpackChunkName: "home" */ '../pages/Home');
}

export function prefetchAbout() {
  return import(/* webpackChunkName: "about" */ '../pages/About');
}

export function prefetchAddProduct() {
  return import(/* webpackChunkName: "add-product" */ '../pages/AddProduct');
}

export function prefetchProfile() {
  return import(/* webpackChunkName: "profile" */ '../pages/Profile');
}

export function prefetchProduct() {
  return import(/* webpackChunkName: "product" */ '../pages/ProductDetails');
}

export function prefetchSearch() {
  return import(/* webpackChunkName: "search" */ '../pages/Search');
}

export function prefetchCategory() {
  return import(/* webpackChunkName: "category" */ '../pages/CategoryPage');
}
