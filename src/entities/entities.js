import { Svue } from 'svue';
import { getEntities } from "@/api/entity";
import { getDocument } from '@/api/document';
import { callEveryAsync } from '@/util/callEvery';
const cache = {};

export async function getE(id, page = 1) {
  const key = `${id},${page}`;
  if (cache[key] != null) return cache[key];
  const results = await getEntities(id, page);
  cache[key] = results;
  return results;
}

export const entities = new Svue({
  data() {
    return {
      document: null,
      entities: null,
    }
  },
  computed: {
    pollEvents(document) {
      // Update document only if it is readable
      if (document == null || (!document.readable && this.entities != null && this.entities.length > 0)) return [];
      return [
        callEveryAsync(async () => {
          // Call once every ~15 seconds
          const doc = await getDocument(document.id);
          const newEntities = await getE(document.id);
          entities.entities = newEntities;
          this.document = doc;
        }, 3),
      ];
    },
  }
});