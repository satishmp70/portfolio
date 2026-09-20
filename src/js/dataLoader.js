/**
 * =========================================================================
 * DATA LOADER UTILITY
 * =========================================================================
 * Loads the master database from data/siteData.json.
 * Imports directly for Vite bundling, with robust asynchronous fetch fallback
 * if running as pure static HTML over HTTP/HTTPS.
 */

import staticSiteData from '../../data/siteData.json';

let cachedData = staticSiteData;

export async function getSiteData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch('/data/siteData.json');
    if (response.ok) {
      cachedData = await response.json();
      return cachedData;
    }
  } catch (err) {
    console.warn('Falling back to bundled static site data:', err);
  }

  return staticSiteData;
}

export function getProjectById(id, data = cachedData) {
  if (!data || !data.projects) return null;
  return data.projects.find(p => p.id === id) || null;
}
