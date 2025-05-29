interface Props<T> {
	when: T;
	fallback?: React.ReactNode;
	children: React.ReactNode | ((whenValue: NonNullable<T>) => React.ReactNode);
}

/**
 * A conditional component that renders its `children` when the `when` property
 * is truthy. If `when` is falsy, renders the `fallback` property or `null` if
 * `fallback` is not supplied.
 *
 * The `children` property can be either a React node or a function. If the
 * `children` property is a function, it is called with the value of the `when`
 * property as its argument.
 *
 * @example
 * <Show when={user.name}>
 *   <p>Welcome, {user.name}!</p>
 * </Show>
 *
 * @example
 * <Show when={user.name}>
 *   {(name) => <p>Welcome, {name}!</p>}
 * </Show>
 *
 * @param {Props<T>} props
 * @returns {React.ReactNode}
 */
export function Show<T>({
	children,
	when,
	fallback = null,
}: Props<T>): React.ReactNode {
	if (when) {
		const wrappedChildren = () => {
			if (typeof children === "function") {
				return children(when);
			}
			return children;
		};

		return wrappedChildren();
	}

	return fallback;
}