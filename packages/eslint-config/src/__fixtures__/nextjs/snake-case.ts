export interface MemberRow {
  first_name: string;
}

export function displayName(row: MemberRow): string {
  const { first_name } = row;
  let display_name = first_name;
  display_name = display_name.trim();
  return display_name;
}
