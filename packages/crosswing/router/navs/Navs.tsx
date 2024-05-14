import Debug from "debug";
import {
  createRef,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { flattenChildren } from "../../hooks/flattenChildren.js";
import { RouterContextValue, useRouter } from "../context/RouterContext.js";
import { Redirect } from "../redirect/Redirect.js";
import { MatchParams, RouterLocation } from "../RouterLocation.js";
import { NavStack, NavStackItem } from "./NavStack.js";

export * from "./NavAccessoryView.js";
export * from "./NavLayout.js";
export * from "./NavStack.js";
export * from "./NavTitleView.js";

const debug = Debug("router:Navs");

export interface NavRouteProps<Path extends string = any> {
  path?: Path;
  render: (params: MatchParams<Path>) => ReactElement;
}

export function Navs({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  // Coerce children to array, flattening fragments and falsy conditionals.
  const routes = flattenChildren(children).filter(isNavRoute);

  // Pull our route information from context.
  const { location, nextLocation, history, parent, flags } = useRouter();

  const selected = selectRoute(routes, location);
  const root = selectRoot(routes, location);
  const isRootSelected = !selected.route.props.path;

  // Construct our storage for previous routes on this nav.
  const previousLocations = useRef<RouterLocation[]>([]);

  debug(
    `Render <Navs> with location "${location}" and next location "${nextLocation}" and previous locations: ${previousLocations.current}`,
  );

  // What route is on top?
  const locationRoute = selectRoute(routes, location);
  console.log("pushing", locationRoute.route.props.path);
  const cleanedPreviousLocations = previousLocations.current.filter(
    (loc) =>
      selectRoute(routes, loc).route.props.path !==
      locationRoute.route.props.path,
  );

  // Construct the new list of locations to render.
  // If we are displaying the default route, erase history (because there
  // shouldn't be any way to go back further, and also as a safety valve).
  const allLocations = isRootSelected
    ? [location]
    : pushLocation(root.location, cleanedPreviousLocations, location);

  console.log(
    previousLocations.current.map(
      (l) => selectRoute(routes, l).route.props.path,
    ),
    cleanedPreviousLocations.map(
      (l) => selectRoute(routes, l).route.props.path,
    ),
    allLocations.map((l) => selectRoute(routes, l).route.props.path),
  );

  // Store the list of locations we rendered.
  useEffect(() => {
    previousLocations.current = allLocations;
  }, [location.href()]);

  if (selected.redirect) {
    console.warn(
      `No routes exactly matched location "${location}". Redirecting to "${selected.location}"`,
    );
    return <Redirect to={selected.location.href()} />;
  }

  debug(`Rendering locations: ${allLocations}`);

  function getNavStackItem(
    savedLocation: RouterLocation,
    index: number,
  ): NavStackItem {
    const { route, location: childLocation } = selectRoute(
      routes,
      savedLocation,
    );
    const backLocation = allLocations[index - 1];

    // Get the next location in the universe of these <Navs>.
    const { location: nextChildLocation } = selectRoute(routes, nextLocation);

    const childContext: RouterContextValue = {
      location: childLocation,
      nextLocation: nextChildLocation,
      history,
      flags,
      ...(parent ? { parent } : null),
      ...(backLocation ? { back: backLocation.href() } : null),
    };

    return {
      key: index + " - " + childLocation.claimedHref(),
      childContext,
      child: route.props.render(childLocation.params),
      ref: createRef(),
    };
  }

  // Figure out where to go if you swipe right on the nav stack.
  const back = allLocations[allLocations.length - 2];

  return (
    <NavStack back={back} items={allLocations.map(getNavStackItem)} {...rest} />
  );
}

interface SelectedRoute {
  route: ReactElement<NavRouteProps>;
  location: RouterLocation;
  redirect?: boolean;
}

function selectRoot(
  routes: ReactElement<NavRouteProps>[],
  location: RouterLocation,
): SelectedRoute {
  const root = routes.find((route) => !route.props.path);

  if (!root) {
    throw new Error(
      "You must include at least a <NavRoute> with an empty path to serve as the default.",
    );
  }

  return { route: root, location: location.rewrite("") };
}

function selectRoute(
  routes: ReactElement<NavRouteProps>[],
  location: RouterLocation,
): SelectedRoute {
  // Look through all routes and attempt to match.
  for (const route of routes) {
    const path = route.props.path;
    const childLocation = location.tryClaim(path || "");

    // If we matched the path completely with nothing leftover, we found it.
    if (childLocation && !childLocation.unclaimedPath()) {
      debug(`Selecting <NavRoute> with path: ${path || "/"}`);
      return { route, location: childLocation };
    }
  }

  // Redirect to the root route by default.
  return { ...selectRoot(routes, location), redirect: true };
}

function pushLocation(
  root: RouterLocation,
  previous: RouterLocation[],
  current: RouterLocation,
): RouterLocation[] {
  // If this is the first place we're landing on, make sure you can go
  // back to the root.
  if (previous.length === 0) {
    return [root, current];
  }

  const lastLocation = previous[previous.length - 1];
  const penultimateLocation = previous[previous.length - 2];

  // If we're already at this location, replace it with the new one (in case
  // the search string changed).
  if (lastLocation?.equals(current, { excludeSearch: true })) {
    return [...previous.slice(0, previous.length - 1), current];
  }

  // If you are navigating to the location just before the last one, we
  // assume you are going "back".
  if (penultimateLocation?.equals(current, { excludeSearch: true })) {
    return [...previous.slice(0, previous.length - 2), current];
  }

  // Just add it on to the end like usual.
  return [...previous, current];
}

export function NavRoute<Path extends string>({}: NavRouteProps<Path>) {
  // Our own render method is never called.
  return null;
}
// We use this instead of comparing item.type === NavRoute because that class
// pointer is not stable during development with hot reloading.
NavRoute.isNavRoute = true;

function isNavRoute(item: ReactNode): item is ReactElement<NavRouteProps> {
  return isValidElement(item) && !!item.type?.["isNavRoute"];
}
