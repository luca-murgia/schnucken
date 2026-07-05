// Language-neutral dietary tag keys stored on MenuItem.dietaryTags. Labels are
// localised via the `menu.dietary.<key>` message keys. Shared by the admin
// editor (checkboxes), the public menu (badges), and server-side validation —
// kept prisma-free so it's safe to import into client components.
export const DIETARY_TAGS = ["vegetarian", "vegan", "glutenFree"] as const;

export type DietaryTag = (typeof DIETARY_TAGS)[number];
