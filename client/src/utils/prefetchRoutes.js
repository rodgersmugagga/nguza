// Small helper to prefetch lazily-loaded route chunks on link hover/touch.
// This keeps the app visually responsive: when users hover a nav/link we
// start loading the route bundle so navigation is near-instant.

export function prefetchHome() {
  return import(/* webpackChunkName: "home" */ '../pages/Home');
}

export function prefetchAbout() {
  return import(/* webpackChunkName: "about" */ '../pages/About');
}

export function prefetchCreateListing() {
  return import(/* webpackChunkName: "create-listing" */ '../pages/CreateListing');
}

export function prefetchProfile() {
  return import(/* webpackChunkName: "profile" */ '../pages/Profile');
}

export function prefetchListing() {
  return import(/* webpackChunkName: "listing" */ '../pages/Listing');
}

export function prefetchSearch() {
  return import(/* webpackChunkName: "search" */ '../pages/Search');
}

export function prefetchCategory() {
  return import(/* webpackChunkName: "category" */ '../pages/CategoryPage');
}
