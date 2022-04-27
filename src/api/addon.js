/**
 * Methods related to the DocumentCloud note API
 */

import session from "./session";
import { Addon, AddonRun } from "@/structure/addon";
import { apiUrl } from "./base";
import { queryBuilder } from "@/util/url";
import { grabAllPages } from "@/util/paginate";

export async function getActiveAddons() {
  // Returns all active add-ons
  const results = await grabAllPages(apiUrl(queryBuilder(`addons/`, { active: true })));
  return results.map((result) => new Addon(result));
}

export async function getAddons(query = "") {
  const { data } = await session.get(apiUrl(queryBuilder(`addons/`, { query })));
  return data.results.map((result) => new Addon(result));
}

export async function getAddonsPage(url) {
  // Use the URL from the next or previous url in the response
  const { data } = await session.get(url);
  return data.results.map((result) => new Addon(result));
}

export async function getAddon(addonId) {
  // Get the note with the specified id
  const { data } = await session.get(apiUrl(`addons/${addonId}/`));
  return new Addon(data);
}

export async function activateAddon(addonId, active) {
  // XXX error check result?
  const { data } = await session.patch(apiUrl(`addons/${addonId}/`), { active });
  return new Addon(data);
}

export async function postAddonDispatch(
  addon,
  addonParameters,
  userActiveQuery,
  ids,
) {
  // Dispatch the addon for the specified document ids with the parameters fulfilled by
  // the user
  const { data } = await session.post(apiUrl(`addon_runs/`), {
    addon: addon.id,
    parameters: addonParameters,
    query: userActiveQuery,
    documents: ids.map((id) => parseInt(id.id, 10)),
  });
  data.addon = addon;
  return new AddonRun(data);
}

export async function getAddonRuns(dismissed = false, expand = "addon") {
  // Returns all add-on runs
  const results = await grabAllPages(
    apiUrl(queryBuilder(`addon_runs/`, { expand, dismissed })),
  );
  return results.map((result) => new AddonRun(result));
}

export async function dismissAddonRun(runUuid) {
  await session.patch(apiUrl(`addon_runs/${runUuid}/`), { dismissed: true });
}
