# Wix Restaurants Cleanup — 2026-08-14

Production site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`
Migration branch: `studio-rebuild-2026`

## Owner decision

Keep Wix Stores and the core eCommerce layer. Remove Wix Restaurants functionality from the GatorBait migration target.

## Verified before destructive cleanup

- Wix Stores is installed and must be preserved.
- Wix Restaurants Menus and Wix Restaurants Orders were installed.
- One restaurant menu existed: `Dinner Menu` (`bbb65621-6338-4837-8fdd-aebc654523e0`).
- The menu was associated with the default business location named `The Swamp`.
- Search of Wix eCommerce orders for restaurant catalog app ID `9a5d83fd-8570-482e-81ab-cfa88942ee60` returned **0 restaurant-origin orders**.

## Completed

- Deleted the unused `Dinner Menu`.
- Re-listed restaurant menus and verified the menu catalog is empty.
- Did **not** modify Wix Stores, Wix Store products, or the shared Wix eCommerce layer.

## Remaining blocker

Attempts to uninstall both Wix Restaurants app shells are blocked by Wix with:

`UNINSTALL_FAILED: HAS_EDITOR_PRESENCE`

This means the Classic Wix Editor still contains app-owned restaurant page/component presence. The public App Installation API will not uninstall the app while those editor components exist.

Do not use App Extensions/Dev Center component deletion for this: those APIs manage components of apps being developed, not site-level installed Wix app placements.

## Studio migration decision

- Do not migrate restaurant functionality into the Studio design.
- Remove the restaurant app-owned Classic Editor page/components during the editor migration/cutover cleanup.
- Retry uninstall only after editor presence is removed.
- Preserve Wix Stores and checkout throughout.
